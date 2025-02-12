import React, { Component, } from 'react';
import { Table, Card } from "antd";
import { UnorderedListOutlined } from '@ant-design/icons';
import { getAll } from '@services/danhmucphong/phongService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from "@components/Search/Search";
import { stringify } from 'qs';
import queryString from 'query-string';
import { compose } from 'redux';

class DanhMucPhong extends Component {

  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      width: 50,
      align: 'center'
    },
    {
      title: 'Mã phòng',
      dataIndex: 'shortname',
      width: 100,
      align: 'center'
    },
    {
      title: 'Tên phòng',
      dataIndex: 'fullname',
      width: 200,
      align: 'center'
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      _id: "",
    };
    this.formRef = React.createRef();
  }

  async componentDidMount() {
    this.getDataFilter();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter()
    }
  }

  async getDataFilter() {
    let search = queryString.parse(this.props.location.search);
    let page = parseInt(search.page ? search.page : this.state.page);
    let limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = ''
    queryStr += `${search.shortname ? '&shortname[like]={0}'.format(search.shortname) : ''}`
    queryStr += `${search.fullname ? '&fullname[like]={0}'.format(search.fullname) : ''}`
    const apiResponse = await getAll(page, limit, queryStr);
    const dataRes = apiResponse.docs;
    console.log('dataRes',dataRes);
    if (apiResponse) {
      this.setState({
        dataRes,
        totalDocs: apiResponse.totalDocs,
        limit: apiResponse.limit,
        page: apiResponse.page,
      });
    }
  }

  handleRefresh = (newQuery, changeTable) => {
    const { location, history } = this.props;
    const { pathname } = location;
    let { page, limit } = this.state;
    let objFilterTable = { page, limit }
    if (changeTable) {
      newQuery = queryString.parse(this.props.location.search)
      delete newQuery.page
      delete newQuery.limit
    }
    newQuery = Object.assign(objFilterTable, newQuery);
    history.push({
      pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" })
    });
  };

  onChangeTable = (page) => {
    this.setState({ page: page.current, limit: page.pageSize },
      () => { this.handleRefresh({}, true) })
  }

  render() {
    const { loading } = this.props;

    const { dataRes, totalDocs, page, limit, _id } = this.state;
    const dataSearch = [
      {
        type: 'text',
        name: 'shortname',
        label: 'Mã phòng'
      },
      {
        type: 'text',
        name: 'fullname',
        label: 'Tên phòng'
      }]
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh mục phòng
      </span>}>
        <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch} />
        <Table loading={loading} bordered columns={this.columns} dataSource={dataRes}
          size="small" rowKey="_id"
          pagination={{
            ...PAGINATION_CONFIG,
            current: page,
            pageSize: limit,
            total: totalDocs,
          }}
          onChange={this.onChangeTable} />
      </Card>
    </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(DanhMucPhong);


