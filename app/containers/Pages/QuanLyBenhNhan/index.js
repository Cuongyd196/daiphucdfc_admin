import React, { Component } from 'react';
import { Button, Table, Popconfirm, message, Card, Tooltip, Popover } from 'antd';
import { DeleteOutlined, HistoryOutlined, UnorderedListOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getAll, delById } from '@services/qlbenhnhan/qlbenhnhanService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from '@components/Search/Search';
import { stringify } from 'qs';
import queryString from 'query-string';
import { URL } from '@url';
import { dateFormatter } from '@commons/dateFormat';
import { compose } from 'redux';
import LichsukhamDialog from './LichsukhamDialog';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

class QLBenhNhan extends Component {
  columns = [
    {
      title: 'STT',
      render: (limit, page, value) => this.formatSTT(this.state.limit, this.state.page, value),
      width: 5,
      align: 'center',
    },
    {
      title: 'Mã bệnh nhân',
      dataIndex: '_id',
      width: 100,
      align: 'center',
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoten',
      width: 120,
      align: 'center',
    },
    {
      title: 'Ngày sinh',
      render: (value) => dateFormatter(value.ngaysinh),
      width: 60,
      align: 'center',
    },
    {
      title: 'Điện thoại',
      width: 100,
      dataIndex: 'dienthoai',
      align: 'center',
    },
    {
      title: 'Tài khoản',
      width: 100,
      render: (value) => this.formatTaiKhoan(value.taikhoan),
      align: 'center',
    },
    {
      title: 'Hành động',
      render: (value) => this.formatActionCell(value),
      width: 100,
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
    this.popoverTrigger = [];
    this.lichsukhamDialog = React.createRef();
    this.url = 'benhnhan';
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
    queryStr += `${search.hoten ? '&hoten[like]={0}'.format(search.hoten) : ''}`;
    queryStr += `${search._id ? '&_id={0}'.format(search._id) : ''}`;
    queryStr += `${search.dienthoai ? '&dienthoai[like]={0}'.format(search.dienthoai) : ''}`;
    queryStr += `${search.email ? '&email[like]={0}'.format(search.email) : ''}`;
    queryStr += `${search.taikhoan ? '&taikhoan[like]={0}'.format(search.taikhoan) : ''}`;
    queryStr += `${search.trangthai ? '&trangthai={0}'.format(search.trangthai) : ''}`;
    queryStr += `${search.loaitaikhoan ? '&taikhoanhis={0}'.format(search.loaitaikhoan === '1' ? true : false) : ''}`;
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


  async handleDelete(value) {
    const apiResponse = await delById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success('Xoá thành công');
    }
  }

  formatSTT(limit, page, index) {
    return (page - 1) * limit + (index + 1);
  }

  formatTaiKhoan(value) {
    return value ? <span className="text-green-600">{value}</span> : <i className="text-yellow-600 text-">Chưa có</i>;
  }


  formatActionCell(value) {
    let {myPermission} = this.props
    return <>
      {
        myPermission?.['dangky']?.xem &&
        <Popover ref={(c) => {
          this.popoverTrigger[value._id] = c
        }} title={null} trigger="click"
                 content={
                   <div>
                     <label className="label_lich_su_kb">
              <span>
                <HistoryOutlined/>
              </span>
                       Xem lịch sử của bệnh nhân
                     </label>
                     <br/>
                     <div className="box_space"/>
                     <Button type="primary" size='small' className='mr-1' onClick={() => {
                       this.popoverTrigger?.[value._id]?.setPopupVisible(false);
                       this.lichsukhamDialog.current?.open(value._id)
                     }}>Khám bệnh</Button>
                     <Button type="primary" size='small' className='mr-1' href={URL.QL_DONTHUOC_ID.format(value._id)}
                             onClick={() =>
                               this.popoverTrigger?.[value._id]?.setPopupVisible(false)
                             }>Đơn thuốc</Button>
                     <Button type="primary" size='small' className='mr-1' href={URL.QL_KQCLS_ID.format(value._id)}
                             onClick={() =>
                               this.popoverTrigger?.[value._id]?.setPopupVisible(false)
                             }>Kết quả cận lâm sàng</Button>
                   </div>
                 }>
          <Tooltip color="#f50">
            <Button icon={<HistoryOutlined/>} size='small' className="mr-1"></Button>
          </Tooltip>
        </Popover>
      }
      <LichsukhamDialog ref={this.lichsukhamDialog} kiemtra="1" />
      <Link to={URL.QL_BENHNHAN_ID.format(value._id)}>
        <Tooltip title='Xem và cập nhật thông tin' color="#2db7f5">
          <Button icon={<EditOutlined />} size='small' type="primary" className='mr-1'></Button>
        </Tooltip>
      </Link>
      {
        myPermission?.[this.url]?.xoa &&
        <Popconfirm key={value._id} title="Bạn chắc chắn muốn xoá?"
                    onConfirm={() => this.handleDelete(value)}
                    cancelText='Huỷ' okText='Xoá' okButtonProps={{ type: 'danger' }}>
          <Tooltip title='Xóa dữ liệu' color="#f50">
            <Button icon={<DeleteOutlined />} type='danger' size='small' className="mr-1"></Button>
          </Tooltip>
        </Popconfirm>
      }
    </>;
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
    const { loading } = this.props;
    const { dataRes, totalDocs, page, limit } = this.state;
    const loaitaikhoan = [{ _id: '1', value: 'Tài khoản His' }, { _id: '2', value: 'Tài khoản App' }];
    const dataSearch = [
      {
        type: 'text',
        name: '_id',
        label: 'Mã bệnh nhân',
      },
      {
        type: 'text',
        name: 'hoten',
        label: 'Họ tên',
      },
      {
        type: 'text',
        name: 'taikhoan',
        label: 'Tài khoản',
      },
      {
        type: 'text',
        name: 'dienthoai',
        label: 'Số điện thoại',
      },
      {
        type: 'text',
        name: 'email',
        label: 'Email',
      },
      {
        type: 'select',
        name: 'trangthai',
        label: 'Trạng thái',
        options: [{ key: true, value: 'Đã tạo tài khoản' }, { key: false, value: 'Chưa tạo tài khoản' }],
        key: 'key',
        value: 'value',
      },
      {
        type: 'select',
        name: 'loaitaikhoan',
        label: 'Loại tài khoản',
        options: loaitaikhoan,
        key: '_id',
        value: 'value',
      },
    ];
    return <div>

      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách bệnh nhân
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
  myPermission: makeGetPermission(),
});


const withConnect = connect(mapStateToProps);
export default compose(withConnect)(QLBenhNhan);


