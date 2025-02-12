import React, { Component } from 'react';
import { Button, Table, Card, Tooltip, Modal, Form, Row, Col, Divider } from 'antd';
import { UnorderedListOutlined, EyeOutlined, SnippetsOutlined, RightCircleOutlined, FullscreenOutlined } from '@ant-design/icons';
import { getAll, getChiTietDonThuocId } from '@services/qlbenhnhan/qldonthuocService';
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
import { dateFormatter } from '@commons/dateFormat';
import ModalGhiChu from '../QuanLyBenhNhan/ChiTietSuDungThuoc/ModalGhiChu'
import { URL } from '@url';
import { Link } from 'react-router-dom';
import ChiTietDonThuoc from './ChiTietDonThuoc'
import { getChiTietKhamBenhId } from '@services/qlbenhnhan/qldangkykhamService';
class QLDonThuoc extends Component {
  columns = [
    {
      title: 'STT',
      render: (limit, page, value) => this.formatSTT(this.state.limit, this.state.page, value),
      width: 5,
      align: 'center',
    },
    {
      title: 'Mã đơn thuốc',
      dataIndex: '_id',
      align: 'center',
      width: 100
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'benhnhan_id',
      render: (val, row) => {
        if(val){
          return <div>
            <Link to={URL.QL_BENHNHAN_ID.format(val?._id)}>
              <Tooltip title='Thông tin bệnh nhân' color="#2db7f5">
                <div>{val?.hoten}</div>
              </Tooltip>
            </Link>

            <div className="text-xs text-blue-500">- Mã BN: {val?._id}</div>
            <div className="text-xs text-blue-500">- Ngày sinh: {moment(val?.ngaysinh).format('DD/MM/YYYY')}</div>
            <div className="text-xs text-blue-500">- Điện thoại: {val?.dienthoai}</div>
            <div className="text-xs text-blue-500">- Tài khoản: {val?.taikhoan}</div>
          </div>
        }
        return null

      },
      width: 150
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'bacsi',
      render: (value, row) => {
        return <div>
          <div>{value?.tennv}</div>
          <div className="text-xs text-blue-500">- ĐT: {value?.dienthoai}</div>
        </div>;
      },
      width: 120
    },
    {
      title: 'Ngày kê đơn',
      dataIndex: 'ngay',
      render: (value) => moment(value).format('DD/MM/YYYY'),
      width: 60,
      align: 'center',
    },
    {
      title: 'Hành động',
      render: (value) => {
        return <>
          <Tooltip placement="topLeft" title="Thông tin chi tiết" color="#2db7f5">
            <Button
              icon={<EyeOutlined/>}
              size="small"
              type="primary"
              className="mr-1"
              onClick={() => this.detail(value)}
            />
          </Tooltip>

          {/*<Tooltip placement="topLeft" title="Ghi chú dùng thuốc" color="#2db7f5">*/}
          {/*  <Button*/}
          {/*    icon={<SnippetsOutlined />}*/}
          {/*    size="small"*/}
          {/*    type="primary"*/}
          {/*    className="mr-1"*/}
          {/*    onClick={() => this.funcNoteDonThuoc(value._id)}*/}
          {/*  />*/}
          {/*</Tooltip>*/}

          {/*<Link to={URL.QL_DANGKYKHAM_ID.format(value?._id)}>*/}
          {/*  <Tooltip title={'Thông tin đăng ký'} color="#2db7f5">*/}
          {/*    <Button icon={<FullscreenOutlined />} size='small' type="primary" className='mr-1'></Button>*/}
          {/*  </Tooltip>*/}
          {/*</Link>*/}
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
      donthuocct: [],
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
    queryStr += `${search.benhnhan_id ? '&benhnhan_id={0}'.format(search.benhnhan_id) : ''}`;
    queryStr += `${search.hoten ? '&hoten[like]={0}'.format(search.hoten) : ''}`;
    queryStr += `${search.benhan_id ? '&benhan_id={0}'.format(search.benhan_id) : ''}`;
    queryStr += `${search.from_date ? '&ngay[from]={0}'.format(search.from_date) : ''}`;
    queryStr += `${search.to_date ? '&ngay[to]={0}'.format(search.to_date) : ''}`;
    queryStr += `${search.bacsi ? '&bacsi={0}'.format(search.bacsi) : ''}`;
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

  async detail(data) {
    let donthuocct = await getChiTietDonThuocId(data._id);
    let chitietdangky = await getChiTietKhamBenhId(data._id);
    if (!donthuocct) donthuocct = [];
    this.setState({ rowData: data, showModal: true, donthuocct, iddonthuoc: data._id, chitietdangky: chitietdangky });
  }

  toggleModal =  () => {
    this.setState({ showModal: false, rowData: null, donthuocct: [] });
  };

  funcNoteDonThuoc = (iddonthuoc) => {
    this.setState({showModalThuoc: !this.state.showModalThuoc, iddonthuoc})
  }

  render() {
    const { loading, nhanvien } = this.props;

    const { dataRes, totalDocs, page, limit } = this.state;

    const { rowData } = this.state;
    const labelColCol = { xs: 12, lg: 10 };

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
        name: 'makcb',
        label: 'Mã KCB',
      },
      {
        type: 'select',
        name: 'bacsi',
        label: 'Tên bác sĩ',
        options: nhanvien,
        key: '_id',
        value: 'tennv',
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
      }
    ];
    return <div>

      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách đơn thuốc
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
      <Modal
        visible={this.state.showModal}
        footer={null}
        onCancel={loading ? () => null : this.toggleModal}
        width={900}
        style={{ top: 10 }}
      >
        <Divider orientation="left">
          <div className="text-blue-500 text-lg">Thông tin bệnh nhân</div>
        </Divider>
        <Form size="small" className="form-info">
          <Row gutter={10}>
            <Col xs={24}  lg={8}>
              <Form.Item
                label={<b>Mã bệnh nhân</b>}
                className="label_from_item"
                labelCol={labelColCol}>
                <span>{rowData?.benhnhan_id?._id}</span>
              </Form.Item>
            </Col>
            <Col xs={24}  lg={8}>
              <Form.Item
                label={<b>Tên bệnh nhân</b>}
                className="label_from_item"
                labelCol={labelColCol}>
                <span>{rowData?.benhnhan_id?.hoten}</span>
              </Form.Item>
            </Col>
            <Col xs={24}  lg={8} >
              <Form.Item
                label={<b>Giới tính</b>}
                className="label_from_item"
                labelCol={labelColCol}>
                <span>{rowData?.benhnhan_id?.maphai === 1 ? 'Nam' : 'Nữ'}</span>
              </Form.Item>
            </Col>
            <Col xs={24}  lg={8}>
              <Form.Item
                label={<b>Ngày sinh</b>}
                className="label_from_item"
                labelCol={labelColCol}>
                <span>{rowData?.benhnhan_id?.yearofbirth}</span>
              </Form.Item>
            </Col>
            <Col xs={24}  lg={8}>
              <Form.Item
                label={<b>Số điện thoại</b>}
                className="label_from_item"
                labelCol={labelColCol}>
                <span>{rowData ? rowData?.benhnhan_id?.dienthoai : ''}</span>
              </Form.Item>
            </Col>
            <Col xs={24}  lg={8}>
              <Form.Item
                label={<b>Tài khoản</b>}
                className="label_from_item"
                labelCol={labelColCol}>
                <span>{rowData ? rowData?.benhnhan_id?.taikhoan : ''}</span>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <ChiTietDonThuoc donthuoc={rowData} donthuocct={this.state.donthuocct} chitietdangky={this.state.chitietdangky} />
      </Modal>

      <ModalGhiChu showModalThuoc={this.state.showModalThuoc} iddonthuoc={this.state.iddonthuoc}/>

    </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});


const withConnect = connect(mapStateToProps);
export default compose(withConnect, withNhanVien)(QLDonThuoc);


