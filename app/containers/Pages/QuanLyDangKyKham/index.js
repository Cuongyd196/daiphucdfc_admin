import React, { Component } from 'react';
import { Button, Table, Card, Tooltip } from "antd";
import { UnorderedListOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getAll } from '@services/qlbenhnhan/qldangkykhamService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from "@components/Search/Search";
import { stringify } from 'qs';
import queryString from 'query-string';
import { dateFormatter, timeFormatter } from '@commons/dateFormat';
import { compose } from 'redux';
import { withPhong } from '@reduxApp/PhongKham/connect';
import { withNhanVien } from '@reduxApp/NhanVien/connect';
import { URL } from "@url";

class QLBenhNhan extends Component {

  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      align: 'center'
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'benhnhan_id',
      render: (val, row) => {
        if(val){
          return <>
            <Link to={URL.QL_BENHNHAN_ID.format(val?._id)}>
              <Tooltip title='Thông tin bệnh nhân' color="#2db7f5">
                <div>{val?.hoten}</div>
              </Tooltip>
            </Link>
            <div className="text-xs text-blue-500">-Mã BN: {row?.benhnhan_id?._id}</div>
            <div className="text-xs text-blue-500">-ĐT: {val?.dienthoai}</div>
            <div className="text-xs text-blue-500">-Tài khoản: {row?.benhnhan_id?.taikhoan}</div>
          </>
        }
        return null

      }
    },
    {
      title: 'Thông tin ngày khám',
      render: (value, rowData) => {
        return <>
          <div>-Mã đăng ký: {rowData._id}</div>
          <div>-Ngày đăng ký (ngaydk): {timeFormatter(rowData?.ngaydk, true)}</div>
          <div>-Ngày khám (ngayud): {timeFormatter(rowData?.ngayud, true)}</div>
        </>
      }
    },
    {
      title: 'Thông tin phòng',
      render: (value) => {return <>{value.dmphong_id?.fullname}</>}
    },
    {
      title: 'Thông tin bệnh nhân',
      render: (value, rowData, rowIndex) => {
        return <>
          <div>- Năm sinh: {rowData?.benhnhan_id?.yearofbirth}</div>
          <div>- Giới tính: {rowData?.benhnhan_id?.maphai === 1 ? 'Nam' : 'Nữ'}</div>
          <div>- Điện thoại: {rowData?.benhnhan_id?.dienthoai}</div>
          <div>- Địa chỉ: {rowData?.benhnhan_id?.address}</div>
        </>
      }
    },
    {
      title: '',
      render: (value) => this.formatActionCell(value),
      width: 50,
      align: 'center'
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0
    };
  }

  componentDidMount() {
    this.getDataFilter();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
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
    queryStr += `${search.benhnhan_id ? '&benhnhan_id={0}'.format(search.benhnhan_id) : ''}`
    queryStr += `${search.from_date ? '&ngaydk[from]={0}'.format(search.from_date) : ''}`
    queryStr += `${search.to_date ? '&ngaydk[to]={0}'.format(search.to_date) : ''}`
    queryStr += `${search.hoten ? '&hoten[like]={0}'.format(search.hoten) : ''}`
    queryStr += `${search.dienthoai ? '&dienthoai[like]={0}'.format(search.dienthoai) : ''}`
    queryStr += `${search.dmphong_id ? '&dmphong_id={0}'.format(search.dmphong_id) : ''}`
    queryStr += `${search.manv ? '&manv={0}'.format(search.manv) : ''}`
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

  formatActionCell(value) {
    return <Link to={URL.QL_DANGKYKHAM_ID.format(value._id)}>
      <Tooltip title={'Xem thông tin'} color="#2db7f5">
        <Button icon={<EyeOutlined/>} size='small' type="primary" className='mr-1'></Button>
      </Tooltip>
    </Link>
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
    const { loading, phong, nhanvien } = this.props;
    const { dataRes, totalDocs, page, limit } = this.state;
    const dataSearch = [
      {
        type: 'text',
        name: '_id',
        label: 'Mã đăng ký'
      },
      {
        type: 'text',
        name: 'benhnhan_id',
        label: 'Mã bệnh nhân'
      },
      {
        type: 'text',
        name: 'hoten',
        label: 'Họ Tên'
      },
      {
        type: 'text',
        name: 'dienthoai',
        label: 'Điện thoại'
      },
      {
        type: 'date',
        name: 'from_date',
        label: 'Ngày đăng ký'
      },
      {
        type: 'date',
        name: 'to_date',
        label: 'Đến ngày'
      },
      {
        type: 'select',
        name: 'dmphong_id',
        label: 'Phòng khám',
        options: phong,
        key: '_id',
        value: 'fullname'
      },
      {
        type: 'select',
        name: 'manv',
        label: 'giáo viên',
        options: nhanvien,
        key: '_id',
        value: 'tennv'
      }]
    return <div>

      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh sách đăng ký khám
        </span>} md="24" bordered >
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
export default compose(withConnect, withPhong, withNhanVien)(QLBenhNhan);


