import React from 'react';
import moment from 'moment';
import {
  Input,
  Form,
  Row,
  Col,
  Button,
  message,
  Radio,
  Divider,
  Tag,
  Select,
  DatePicker,
  Upload,
  Modal,
  Table,
} from 'antd';
import {
  CheckCircleOutlined, ClearOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined, FileSearchOutlined,
  SaveOutlined, UploadOutlined,
} from '@ant-design/icons';
import Box from '@containers/Box';
import { connect } from "react-redux";
import { compose } from 'redux';
import { createStructuredSelector } from "reselect";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { dateFormatter, timeFormatter } from '@commons/dateFormat';
import { PAGINATION_CONFIG, RULE } from '@constants';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import { withPhong } from '@reduxApp/PhongKham/connect';
import { withNhanVien } from '@reduxApp/NhanVien/connect';
import { getAll } from '@services/qlbenhnhan/qldangkykhamService';
import locale from 'antd/es/date-picker/locale/vi_VN';
import produce from "immer";
const layoutCol = { "xs": 24, "sm": 12, "md": 12, "lg": 12, "xl": 4, "xxl": 4 };
const layoutCol1 = { "xs": 24, "sm": 12, "md": 12, "lg": 12, "xl": 16, "xxl": 16 };
const layoutFilter = {
  labelAlign: "left",
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class BenhNhanModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      limit: 50,
      totalDocs: 0,
      dsdangky: [],
      objectFilterModal: {},
      dangkyInfo: null,
      makcb: []
    };
    this.formRefModal = React.createRef()
    this.columnsModal = [
      {
        title: 'STT',
        width: 50,
        render: (cell, row, index) => (index + 1),
        align: 'center',
      },
      {
        title: 'Tên bệnh nhân',
        render: (val) => {
          return <>
            <div>{val?.benhnhan_id?.hoten}</div>
            <div>-Mã BN: {val?.benhnhan_id?._id}</div>

          </>;
        },
      },
      {
        title: 'Thông tin ngày khám',
        dataIndex: 'maKCB',
        render: (value, rowData) => {
          return <>
            <div>-Mã KCB: {rowData._id}</div>
            <div>-Ngày: {timeFormatter(rowData?.ngaydk)}</div>
          </>;
        },
      },
      {
        title: 'Thông tin phòng',
        render: (value, rowData) => {
          return <>
            <div>-Phòng khám: {rowData?.dmphong_id?.fullname}</div>
          </>;
        },
      },
      {
        title: 'Thông tin bệnh nhân',
        render: (value) => {
          return <>
            <div>-ĐT: {value?.benhnhan_id?.dienthoai}</div>
            <div>-Ngày sinh: {dateFormatter(value?.benhnhan_id?.ngaysinh)}</div>
          </>;
        },
      },
    ];

  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.showModal !== prevProps.showModal && this.props.showModal){
      let {taikhoanhis, dangkybn, mabn, makcb} = this.props;
      if(makcb) this.setState({makcb: [makcb]})
      let {page, limit} = this.state
      // nếu là tài khoản bệnh nhân và đăng ký cho chính mình.
      if(taikhoanhis && dangkybn){
        // lấy danh sách đăng ký của bệnh nhân đó thôi.
        this.getDsDangKy(page, limit, {benhnhan_id: mabn})
      }else{
        this.getDsDangKy(page, limit, {})
      }
    }
  }

  getDsDangKy = async (page, limit, objectFilterModal) => {

    let queryStr = '';
    queryStr += `${objectFilterModal._id ? '&_id={0}'.format(objectFilterModal._id) : ''}`;
    queryStr += `${objectFilterModal.benhnhan_id ? '&benhnhan_id={0}'.format(objectFilterModal.benhnhan_id) : ''}`;
    queryStr += `${objectFilterModal.hoten ? '&hoten[like]={0}'.format(objectFilterModal.hoten) : ''}`;
    queryStr += `${objectFilterModal.from_date ? '&ngaydk[from]={0}'.format(objectFilterModal.from_date) : ''}`;
    queryStr += `${objectFilterModal.to_date ? '&ngaydk[to]={0}'.format(objectFilterModal.to_date) : ''}`;
    queryStr += `${objectFilterModal.maphong ? '&maphong={0}'.format(objectFilterModal.maphong) : ''}`;
    queryStr += `${objectFilterModal.manv ? '&manv={0}'.format(objectFilterModal.manv) : ''}`;

    const apiResponse = await getAll(page, limit, queryStr);
    if(apiResponse){
      this.setState({
        dsdangky: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        limit: apiResponse.limit,
        page: apiResponse.page
      })
    }
  }

  clearFilter = async () => {
    const fields = this.formRefModal.current.getFieldsValue();
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = [];
        } else {
          fields[item] = undefined;
        }
      }
    }
    this.formRefModal.current.setFieldsValue(fields);
  }

  onFinishFilter = async () => {
    const fields = this.formRefModal.current.getFieldsValue();
    const objectFilterModal = produce(fields, draft => {
      draft._id = draft._id
      draft.benhnhan_id = draft.benhnhan_id
      draft.from_date = draft.from_date
      draft.to_date = draft.to_date
      draft.hoten = draft.hoten
      draft.maphong = draft.maphong
      draft.manv = draft.manv
    });
    this.getDsDangKy(1, 50, objectFilterModal)
  }

  onChangeTableModal = (page) => {
    let {objectFilterModal} = this.state
    this.formRefModal.current.setFieldsValue(objectFilterModal);
    this.getDsDangKy(page.current, page.pageSize, objectFilterModal)
  };


  render() {
    const { loading, phong, nhanvien  } = this.props;
    const {page, limit, totalDocs} = this.state;
    
    return <Modal
      title='Chọn mã khám chữa bệnh'
      width={1000}
      style={{ top: 10 }} visible={this.props.showModal}
      onCancel={() => this.props.getInfoKCB()}
      footer={[
        <Button size='small' key={1} disabled={loading} onClick={() => this.props.getInfoKCB()}>Đóng</Button>,
        <Button size='small' key={2} type="primary" htmlType="button" form="formRefModal"
                icon={<i className='fa fa-check mr-1'/>} disabled={loading}
                onClick={() => {
                  if(this.state.makcb &&  this.state.makcb.length){
                    this.props.getInfoKCB(this.state.makcb[0], this.state.dangkyInfo[0].benhnhan_id)
                  }else{
                    this.props.getInfoKCB()
                  }
                }}>
          Xác nhận
        </Button>
      ]}>

      {
        !(this.props.taikhoanhis && this.props.dangkybn) &&
        <Form ref={this.formRefModal} id="formRefModal" className='form-no-feedback' name='formRefModal'
              autoComplete='off' size='small'
              onFinish={this.onFinishFilter.bind(this)}>
          <Divider orientation="left" plain>
            <span>Điều kiện lọc</span>
          </Divider>
          <Row gutter={10}>
            <Col xs={24} md={12} xl={6}>
              <Form.Item label="Mã đăng ký" name="_id" {...layoutFilter}>
                <Input placeholder='Mã đăng ký' disabled={loading}/>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Form.Item label="Mã bệnh nhân" name="benhnhan_id" {...layoutFilter}>
                <Input placeholder='Mã đăng ký' disabled={loading}/>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} xl={6}>
              <Form.Item label="Họ tên" name="hoten" {...layoutFilter}>
                <Input placeholder='Họ tên' disabled={loading}/>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} xl={6}>
              <Form.Item label="Từ ngày" name="from_date" {...layoutFilter}>
                <DatePicker format={"DD/MM/YYYY"} locale={locale} className="w-full" placeholder="Từ ngày"/>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} xl={6}>
              <Form.Item label="Đến ngày" name="to_date" {...layoutFilter}>
                <DatePicker format={"DD/MM/YYYY"} locale={locale} className="w-full" placeholder="Đến ngày"/>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} xl={6}>
              <Form.Item label="Phòng khám" name="maphong" {...layoutFilter}>
                <Select placeholder='Chọn phòng khám' disabled={loading} dropdownClassName='small'>
                  {phong.map(data => {
                    return <Select.Option key={data._id} value={data._id}>{data.tenphong}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} xl={6}>
              <Form.Item label="giáo viên" name="manv" {...layoutFilter}>
                <Select placeholder='Chọn giáo viên' disabled={loading} dropdownClassName='small'>
                  {nhanvien.map(data => {
                    return <Select.Option key={data._id} value={data._id}>{data.tennv}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} className='ml-auto'>
              <Button htmlType='submit' size='small' type='primary' className='pull-right'
                      loading={loading} icon={<i className="fa fa-filter mr-1"/>}>
                Lọc
              </Button>
              <Button htmlType='button' size='small' className='pull-right mr-2' danger
                      icon={<ClearOutlined/>} onClick={this.clearFilter.bind(this)}>
                Xoá bộ lọc
              </Button>
            </Col>
          </Row>
        </Form>
      }


      <Divider orientation="left" plain>
        <span>Danh sách các dịch vụ</span>
      </Divider>
      <Table
        columns={this.columnsModal} dataSource={this.state.dsdangky}
        bordered
        size="small"
        scroll={{ y: 'calc(100vh - 28em)' }}
        rowKey="_id"
        loading={loading}
        fixed={true}
        onChange={this.onChangeTableModal}
        pagination={{
          ...PAGINATION_CONFIG,
          size: 'small',
          pageSizeOptions: [50, 100, 200, 500], showSizeChanger: true, defaultpageSize: 50,
          current: page,
          pageSize: limit,
          total: totalDocs,
        }}
        rowSelection={{
          selectedRowKeys: this.state.makcb,
          onChange: (makcb, dangkyInfo) => this.setState({makcb, dangkyInfo}),
          preserveSelectedRowKeys: true,
          type: 'radio',
        }}
      />
    </Modal>
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission()
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect, withPhong, withNhanVien)(BenhNhanModal);

