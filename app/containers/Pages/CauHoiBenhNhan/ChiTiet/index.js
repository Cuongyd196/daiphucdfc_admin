import React, { Component, Fragment } from 'react';
import { Input, Form, Row, Tooltip, Skeleton, Button, Modal, message, Radio, Select, Upload} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  HistoryOutlined,
  SaveOutlined
} from "@ant-design/icons";
import Box from '@containers/Box';
import { connect } from "react-redux";
import { compose } from 'redux';
import { createStructuredSelector } from "reselect";
import CustomSkeleton from '@containers/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, RULE } from "@constants";

import { getById, updateById } from "@services/cauhoi/cauhoibenhnhanService";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { dateFormatter , dateFormatYMD} from '@commons/dateFormat';
import { isBuffer } from "lodash";
import '../cauhoibenhnhan.scss';
import { withPhong } from "@reduxApp/Phong/connect";
import { getAllPhongById } from '@services/danhmucphong/khoakhamService';
import phongSaga from '@reduxApp/Phong/saga';


function CustomSkeletonSL(props) {
  const {children, isShowSkeleton, ...rest} = props;
  if(isShowSkeleton) return <Skeleton.Input active size='small'/>
  return React.cloneElement(children, rest)
}

class CauHoiBenhNhan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      phong: [],
      _id: props.match.params.id,
      trangthai: 1,
      cauhoi: '',
      showModal: false,
      previewVisible: false,
      previewImage: '',
      hinh_anh: [{url: "https://s3.ap.cloud-object-storage.appdomain.cloud/his-app-aibolit/emo_1609923048385.jpg"},
       {url: "https://s3.ap.cloud-object-storage.appdomain.cloud/his-app-aibolit/emo_1609923048385.jpg"},
       {url: "https://s3.ap.cloud-object-storage.appdomain.cloud/his-app-aibolit/emo_1609923048385.jpg"}]
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.getDataFilter();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter();
    }
  }

  async getDataFilter() {
    const apiResponse = await getById(this.state._id);
    if (apiResponse) {
      const dataRes = apiResponse;
      this.setState({
        dataRes,
        trangthai: dataRes?.trangthai,
        previewImage: dataRes?.hinhanh,
      });
    }
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: "" });
    this.formRef.current.resetFields();
  };

  async edit(data) {
    await this.setState({ showModal: true, _id: data._id, cauhoi: data.cauhoi, trangthai: data.trangthai });
    data?.maphong?._id ? this.getPhong(data) : ""
    this.formRef.current.setFieldsValue({...data, traloi: '', makk: data?.makk?._id, maphong: data?.maphong?._id});
  }

  onChange = e => {
    this.setState({
      trangthai: e.target.value,
    });
  };

  raidoGroup(){
    return <>
      <Radio.Group labelCol={{ span: 24 }} value={this.state.trangthai} onChange={this.onChange} >
        <Radio value={1}>
          Đang chờ
        </Radio>
        <Radio value={2}>
          Đã trả lời
        </Radio>
        <Radio value={3}>
          Từ chối
        </Radio>
      </Radio.Group>
    </>
  }

  handleSaveData = async data => {
    const { _id } = this.state;
    data.trangthai = this.state.trangthai;
    if(data.traloi){
      let traloi = data.traloi
      if (!traloi.trim()) {
        this.formRef.current.setFieldsValue({ traloi: traloi.trim() });
        this.formRef.current.validateFields();
        return;
      }
    }
    if(data.lydotuchoi){
      let lydotuchoi = data.lydotuchoi
      if (!lydotuchoi.trim()) {
        this.formRef.current.setFieldsValue({ lydotuchoi: lydotuchoi.trim() });
        this.formRef.current.validateFields();
        return;
      }
    }
    data.trangthai = this.state.trangthai;
    data.ngaytraloi = dateFormatYMD(Date.now());
    const apiResponse = await updateById(_id, data);
    if (apiResponse) {
      this.getDataFilter();
      this.setState({showModal: false})
      message.success("Chỉnh sửa dữ liệu thành công");
    }
  };

  async getPhong(data) {
    const phong = await getAllPhongById(data?.makk?._id);
    if (phong) {
      this.setState({phong});
    }
  }


  onFieldsChange = async (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('makk')) {
      this.formRef.current.setFieldsValue({ maphong: ''});
      const phong = await getAllPhongById(changedValues['makk']);
      console.log(phong);
      if (phong) {
        this.setState({phong});
      }
    }
  }

  formatTrangThai(value){
    if(value === 1){
      return "Đang chờ"
    }
    if(value === 2){
      return "Đã trả lời"
    }
    if(value === 3){
      return "Bị từ chối"
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = () => {
    this.setState({
      previewVisible: true,
    });
  };

  render() {
    const { loading, khoa } = this.props;
    const { dataRes, _id, trangthai, cauhoi, previewVisible, previewImage, hinh_anh, phong } = this.state;
    const layoutCol = { 'xs': 24, 'sm': 24, 'md': 12, 'lg': 12, 'xl': 8, 'xxl': 6 };
    const layoutColKSK = { 'xs': 24, 'sm': 24, 'md': 10, 'lg': 10 };
    const layoutItem = {
      labelCol: { span: 10 },
    };
    
    return (
      <div>
        <Box title='Thông tin đơn thuốc bệnh nhân'  boxActions={<Button size='small' icon={<EditOutlined />} onClick={() => this.edit(dataRes)}>Chỉnh sửa câu hỏi</Button>}>
          <Form size='small' className='form-info'>
            <Row gutter={10}>
              <CustomSkeleton label='Mã bệnh nhân' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem}>
                <label>{dataRes?.mabn?._id}</label>
              </CustomSkeleton>
              <CustomSkeleton label='Tên bệnh nhân' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem}>
                <label>{dataRes?.mabn?.hoten}</label>
              </CustomSkeleton>
              <CustomSkeleton label='Giới tính' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem}>
                <label>{dataRes?.mabn?.maphai?.tenphai}</label>
              </CustomSkeleton>
              <CustomSkeleton label='Ngày sinh' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem}>
                <label>{dateFormatter(dataRes?.mabn?.ngaysinh)}</label>
              </CustomSkeleton>
              <CustomSkeleton label='Số điện thoại' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem}>
                <label>{dataRes?.mabn?.dienthoai}</label>
              </CustomSkeleton>
            </Row>
          </Form>
        </Box>
        <Form size='small' className='formChiTietBN'>
          <Row gutter={10}>
            <CustomSkeleton label='Trạng thái cấu hỏi' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem}>
              <label>{this.formatTrangThai(dataRes?.trangthai)}</label>
            </CustomSkeleton>
            <CustomSkeleton label='Ngày hỏi' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem}>
              <label>{dateFormatter(dataRes?.created_at)}</label>
            </CustomSkeleton>
            <CustomSkeleton label='Ngày trả lời' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem}>
              <label>{dateFormatter(dataRes?.ngaytraloi)}</label>
            </CustomSkeleton>
            <CustomSkeleton label='Câu hỏi thuộc khoa' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem}>
              <label>{dataRes?.makk?.tenkk}</label>
            </CustomSkeleton>
            <CustomSkeleton label='Câu hỏi thuộc phong' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem}>
              <label>{dataRes?.maphong?.tenphong}</label>
            </CustomSkeleton>
            <CustomSkeleton label='Bác sỹ trả lời' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem}>
              <label>{dataRes?.nguoitraloi_id?.full_name}</label>
            </CustomSkeleton>
          </Row>
          <Row>
            <CustomSkeleton label='Câu hỏi bệnh nhân' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem} >
            </CustomSkeleton>
            <CustomSkeleton layoutCol={{span: 23}} layoutItem={{labelCol: { span: 6 }}} className="txt_label">
              <label>{dataRes?.cauhoi}</label>
            </CustomSkeleton>
          </Row>
          <Row>
            <CustomSkeleton label='Hình ảnh câu hỏi' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem} >
             </CustomSkeleton>
            <CustomSkeleton layoutCol={{span: 23}} layoutItem={{labelCol: { span: 6 }}} className="txt_label">
            <Upload
              listType="picture-card"
              fileList={hinh_anh}
              onPreview={this.handlePreview}
              showUploadList={{showRemoveIcon: false}}
            >
            </Upload>
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.handleCancel}
            >
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            </CustomSkeleton>
          </Row>
          <Row>
            <CustomSkeleton label='Câu trả lời' labelStrong isShowSkeleton={loading}
                              itemClassName='m-0' layoutCol={layoutCol} layoutItem={layoutItem} >
            </CustomSkeleton>
            <CustomSkeleton layoutCol={{span: 23}} layoutItem={{labelCol: { span: 6 }}} className="txt_label">
            <label>{dataRes?.traloi}</label>
            </CustomSkeleton>
          </Row>
        </Form>
        <Modal
          className="modal_CauHoiBN"
          title="Chỉnh sửa câu trả lời"
          visible={this.state.showModal}
          onCancel={loading ? () => null : this.toggleModal}
          footer={[
            <Button
              key={1}
              size="small"
              onClick={this.toggleModal}
              disabled={loading}
              type="danger"
              icon={<CloseOutlined />}
            >
              Huỷ
            </Button>,
            <Button
              key={2}
              size="small"
              type="primary"
              htmlType="submit"
              form="formModal"
              loading={loading}
              icon={<SaveOutlined />}
            >
              Lưu
            </Button>
          ]}
        >
          <Form
            ref={this.formRef}
            id="formModal"
            name="formModal"
            autoComplete="off"
            onFinish={this.handleSaveData}
            labelAlign="right"
            onValuesChange={this.onFieldsChange}
          >
            <Form.Item label="Trạng thái câu hỏi : " name="trangthai" labelCol={{ span: 7 }} className="radio" >
              {this.raidoGroup()}
            </Form.Item>
            <Form.Item className="cauhoi"  labelCol={{ span: 7 }} >
              Câu hỏi của bệnh nhân:
              <br/>
              <span>
                {cauhoi}
              </span>
            </Form.Item>
            {trangthai === 2 ? <> 
              <Form.Item label="Thời gian trả lời " labelCol={{ span: 7 }} name="thoigiantraloi">
                {dateFormatter(Date.now())}
              </Form.Item>
            </> : ""}
            {trangthai !== 3 && trangthai !== 1 ? <> 
              <Form.Item label="Câu hỏi Khoa" name="makk"
                labelCol={{ span: 7 }} 
                validateTrigger={['onChange', 'onBlur']}>
                <CustomSkeletonSL isShowSkeleton={false}>
                  <Select placeholder='Chọn khoa của câu hỏi' disabled={loading} dropdownClassName='small' showSearch
                  filterOption={(input, option) => {
                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}}>
                    {khoa.map(data => {
                    return <Select.Option key={data._id} value={data._id}>
                        {data.tenkk}
                    </Select.Option>;
                    })}
                </Select>
                </CustomSkeletonSL>
              </Form.Item>
              <Form.Item label="Câu hỏi thuộc phòng" name="maphong"
                labelCol={{ span: 7 }} 
                validateTrigger={['onChange', 'onBlur']}>
                <CustomSkeletonSL isShowSkeleton={false}>
                  <Select placeholder='Chọn phòng của câu hỏi' disabled={loading} dropdownClassName='small'>
                    {phong.map((gender, i) => {
                      return <Select.Option key={i} value={gender._id}>
                        {gender.tenphong}
                        </Select.Option>;
                    })}
                  </Select>
                </CustomSkeletonSL>
              </Form.Item>
              <Form.Item
                label="Câu trả lời"
                rules={[RULE.REQUIRED]}
                name="traloi"
                labelCol={{ span: 7 }}>
                <Input.TextArea placeholder="Nhập câu trả lời" disabled={loading} />
              </Form.Item>
            </> : ""}
            {trangthai === 3 ? <>
              <Form.Item
                label="Lý do từ chối"
                rules={[RULE.REQUIRED]}
                name="lydotuchoi"
                labelCol={{ span: 6 }}>
                <Input.TextArea placeholder="Nhập lý do từ chối" disabled={loading} />
              </Form.Item>
            </>: ""}
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading()
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect, withPhong)(CauHoiBenhNhan);

