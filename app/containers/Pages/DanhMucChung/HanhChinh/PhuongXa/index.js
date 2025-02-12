import React, { Component, } from 'react';
import { Table, Card } from "antd";
import { UnorderedListOutlined } from '@ant-design/icons';
import { getAll } from '@services/danhmucdiachi/phuongxaService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from "@components/Search/Search";
import { stringify } from 'qs';
import queryString from 'query-string';
import { compose } from 'redux';
import { withTinhThanh } from '@reduxApp/TinhThanh/connect';
import { withQuanHuyen } from '@reduxApp/QuanHuyen/connect';
class PhuongXa extends Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      width: 60,
      align: 'center'
    },
    {
      title: 'Tỉnh/thành phố',
      dataIndex: ['matt', 'tentinh'],
      width: 150,
    },
    {
      title: 'Quận/huyện',
      dataIndex: ['maqh', 'tenhuyen'],
      width: 150,
    },
    {
      title: 'Mã xã',
      dataIndex: '_id',
      width: 100,
      align: 'center'
    },
    {
      title: 'Phường/xã',
      dataIndex: 'tenxa'
    },
  ];

  constructor(props) {
    super(props);
    let search = queryString.parse(props.location.search);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      _id: "",
      matt: search.matt
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
    queryStr += `${search._id ? '&_id={0}'.format(search._id) : ''}`
    queryStr += `${search.tenxa ? '&tenxa[like]={0}'.format(search.tenxa) : ''}`
    queryStr += `${search.matt ? '&matt={0}'.format(search.matt) : ''}`
    queryStr += `${search.maqh ? '&maqh={0}'.format(search.maqh) : ''}`
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
    let { loading, tinhthanh, quanhuyen } = this.props;

    if(this.state.matt){
      quanhuyen = quanhuyen.filter(data => data.matt?._id.toString() === this.state.matt)
    }

    const { dataRes, totalDocs, page, limit } = this.state;
    const dataSearch = [
      {
        type: 'select',
        name: 'matt',
        label: 'Tỉnh/thành phố',
        options: tinhthanh,
        key: '_id',
        value: 'tentinh',
        children: { maqh: '' },
        onChange: (value) => this.setState({matt: value})
      },
      {
        type: 'select',
        name: 'maqh',
        label: 'Quận/huyện',
        options: quanhuyen,
        key: '_id',
        value: 'tenhuyen'
      },
      {
        type: 'text',
        name: '_id',
        label: 'Mã xã'
      },
      {
        type: 'text',
        name: 'tenxa',
        label: 'Phường/xã'
      }]
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh mục phường xã
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
export default compose(withConnect, withTinhThanh, withQuanHuyen)(PhuongXa);


