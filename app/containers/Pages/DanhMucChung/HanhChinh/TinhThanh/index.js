import React, { Component, } from 'react';
import { Button, Table, Card, Tooltip } from "antd";
import { UnorderedListOutlined, EyeOutlined } from '@ant-design/icons';
import { getAll } from '@services/danhmucdiachi/tinhthanhService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from "@components/Search/Search";
import { stringify } from 'qs';
import queryString from 'query-string';
import { compose } from 'redux';

class TinhThanh extends Component {

  columns = [
    {
      title: 'Mã tỉnh',
      dataIndex: '_id',
      width: 100,
      align: 'center'
    },
    {
      title: 'Tên tỉnh',
      dataIndex: 'tentinh'
    },
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

  componentDidMount() {
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
    queryStr += `${search.tentinh ? '&tentinh[like]={0}'.format(search.tentinh) : ''}`
    const apiResponse = await getAll(page, limit, queryStr);
    const dataRes = apiResponse.docs;
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

    const { dataRes, totalDocs, page, limit } = this.state;
    const dataSearch = [
      {
        type: 'text',
        name: 'tentinh',
        label: 'Tên tỉnh'
      }]
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh mục tỉnh thành
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
  loading: makeGetLoading()
});


const withConnect = connect(mapStateToProps);
export default compose(withConnect)(TinhThanh);


