import React, { Component } from 'react';
import { Button, Table, Card, Tooltip } from 'antd';
import { UnorderedListOutlined, EyeOutlined } from '@ant-design/icons';
import { getAll } from '@services/qlbenhnhan/qlhenkhamService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from '@components/Search/Search';
import { stringify } from 'qs';
import queryString from 'query-string';
import { compose } from 'redux';
import moment from 'moment';
import { withNhanVien } from '@reduxApp/NhanVien/connect';
import { withPhong } from '@reduxApp/PhongKham/connect';
import { Link } from 'react-router-dom';
import { URL } from '@url';

class QLHenKham extends Component {
  columns = [
    {
      title: 'STT',
      render: (limit, page, value) => this.formatSTT(this.state.limit, this.state.page, value),
      width: 5,
      align: 'center',
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'benhnhan_id',
      render: (val, row) => {
        return <>
          <div style={{ textAlign: 'left' }}>
            <Link to={URL.QL_BENHNHAN_ID.format(val?._id)}>
              <Tooltip title='Thông tin bệnh nhân' color="#2db7f5">
                <div>{val?.hoten}</div>
              </Tooltip>
            </Link>
            <div className="text-xs text-blue-500">- Mã BN: {val?._id}</div>
            <div className="text-xs text-blue-500">- Mã KCB: {row?._id}</div>
            <div className="text-xs text-blue-500">- Điện thoại: {val?.dienthoai}</div>
            <div className="text-xs text-blue-500">- Tài khoản: {val?.taikhoan}</div>
          </div>
        </>;
      },
      width: 120,
      align: 'center',
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'benhan_id',
      render: (value) => {
        return <>
          <div>{value?.bsdt?.tennv}</div>
          <div className="text-xs text-blue-500">- Điện thoại: {value?.bsdt?.dienthoai}</div>
        </>;
      },
      width: 120
    },
    {
      title: 'Phòng khám',
      dataIndex: 'benhan_id',
      render: (value) => {
        return <>
          <div>{value?.dmphong_id?.fullname}</div>
        </>;
      },
      width: 80
    },
    {
      title: 'Ngày hẹn',
      dataIndex: 'ngayhen',
      render: (value) => moment(value).format('DD/MM/YYYY'),
      width: 60,
      align: 'center',
    },
    {
      title: 'Hành động',
      render: (value) => {
        return <>
          <Link to={URL.QL_DANGKYKHAM_ID.format(value?.benhan_id?._id)}>
            <Tooltip placement="left" title="Thông tin đăng ký khám" color="#2db7f5">
              <Button
                icon={<EyeOutlined/>}
                size="small"
                type="primary"
                className="mr-1"
              />
            </Tooltip>
          </Link>
        </>;
      },
      width: 50,
      align: 'center',
    }];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.getDataFilter();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter();
    }
  }

  async getDataFilter() {
    let search = queryString.parse(this.props.location.search);
    let page = parseInt(search.page ? search.page : this.state.page);
    let limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = '';
    queryStr += `${search.mabn ? '&benhnhan_id={0}'.format(search.benhnhan_id) : ''}`;
    queryStr += `${search.hoten ? '&hoten={0}'.format(search.hoten) : ''}`;
    queryStr += `${search.makcb ? '&benhan_id={0}'.format(search.benhan_id) : ''}`;
    queryStr += `${search.from_date ? '&ngayhen[from]={0}'.format(search.from_date) : ''}`;
    queryStr += `${search.to_date ? '&ngayhen[to]={0}'.format(search.to_date) : ''}`;
    queryStr += `${search.bsdt ? '&bsdt={0}'.format(search.bsdt) : ''}`;
    queryStr += `${search.dmphong_id ? '&dmphong_id={0}'.format(search.dmphong_id) : ''}`;
    const apiResponse = await getAll(page, limit, queryStr);
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      this.setState({
        dataRes,
        totalDocs: apiResponse.totalDocs,
        limit: apiResponse.limit,
        page: apiResponse.page,
      });
    }
  }


  formatSTT(limit, page, index) {
    return (page - 1) * limit + (index + 1);
  }


  handleRefresh = (newQuery, changeTable) => {
    const { location, history } = this.props;
    const { pathname } = location;
    let { page, limit } = this.state;
    let objFilterTable = { page, limit };
    if (changeTable) {
      newQuery = queryString.parse(this.props.location.search);
      delete newQuery.page;
      delete newQuery.limit;
    }
    newQuery = Object.assign(objFilterTable, newQuery);
    history.push({
      pathname, search: stringify({ ...newQuery }, { arrayFormat: 'repeat' }),
    });
  };

  onChangeTable = (page) => {
    this.setState({ page: page.current, limit: page.pageSize },
      () => {
        this.handleRefresh({}, true);
      });
  };

  render() {
    const { loading, nhanvien, phong } = this.props;

    const { dataRes, totalDocs, page, limit } = this.state;

    const dataSearch = [
      {
        type: 'text',
        name: 'benhnhan_id',
        label: 'Mã bệnh nhân',
      },
      {
        type: 'text',
        name: 'hoten',
        label: 'Tên bệnh nhân',
      },
      {
        type: 'text',
        name: 'benhan_id',
        label: 'Mã KCB',
      },
      {
        type: 'select',
        name: 'bsdt',
        label: 'Tên bác sĩ',
        options: nhanvien,
        key: '_id',
        value: 'tennv',
      },
      {
        type: 'select',
        name: 'dmphong_id',
        label: 'Tên phòng',
        options: phong,
        key: '_id',
        value: 'fullname',
      },
      {
        type: 'date',
        name: 'from_date',
        label: 'Từ ngày',
      },
      {
        type: 'date',
        name: 'to_date',
        label: 'Đến ngày',
      },
    ];
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách hẹn khám
        </span>} md="24" bordered>
        <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch}/>
        <Table loading={loading} bordered columns={this.columns} dataSource={dataRes}
               size="small" rowKey="_id"
               pagination={{
                 ...PAGINATION_CONFIG,
                 current: page,
                 pageSize: limit,
                 total: totalDocs,
               }}
               onChange={this.onChangeTable}/>
      </Card>
    </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});


const withConnect = connect(mapStateToProps);
export default compose(withConnect, withNhanVien, withPhong)(QLHenKham);


