import React from 'react';
import { Input, Form, Row, Col, Button, Modal, message, Radio, Select, Upload, Divider, Tag, Image } from 'antd';
import {
  SaveOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  MessageOutlined
} from '@ant-design/icons';
import Box from '@containers/Box';
import { connect } from "react-redux";
import { compose } from 'redux';
import { createStructuredSelector } from "reselect";
import { getById, updateById } from "@services/danhmucchung/hoidap/hoidapService";
import { getAll } from "@services/danhmucchung/hoidap/danhmuchoidapService";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { dateFormatter, dateFormatYMD, timeFormatter } from '@commons/dateFormat';
import { getBase64 } from "@utils/imageUtil";
import { RULE } from "@constants";
import { convertUrlToListFile, getfileDetail } from '@commons/functionCommons';
import { uploadImages } from '@services/uploadServices';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import { API } from '@api';
import { getAll as getAllNhanVien } from '@services/danhmucchung/nhanvienService';
import HoiDapMessageModal from '../Message/index';

const layoutCol = { "xs": 24, "sm": 12, "md": 12, "lg": 12, "xl": 4, "xxl": 4 };
const layoutCol1 = { "xs": 24, "sm": 12, "md": 12, "lg": 12, "xl": 20, "xxl": 20 };

class ChiTietHoiDap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      danhmuc: [],
      _id: props.match.params.id,
      previewVisible: false,
      hinhanh: [],
      trangthai: 1,
      fileList: [],
      dsNhanVien: [],
      showModalMessage: false,
    };
    this.formRef = React.createRef();
    this.url = 'hoidap'
  }

  async componentDidMount() {
    let [dataRes, dmhoidap, dsNhanVien] = await Promise.all([getById(this.state._id), getAll(1, 0, '&trangthai=true'), getAllNhanVien(1, 0, '&bacsikham=true')]);
    if(dataRes && dmhoidap){
      let fileList = convertUrlToListFile(dataRes.hinhanh_traloi);
      this.setState({dsNhanVien: dsNhanVien.docs || [], dmhoidap: dmhoidap.docs, fileList, trangthai: dataRes.trangthai, hinhanh:  dataRes.hinhanh || [], dataRes: dataRes});
      this.formRef.current.setFieldsValue({
        ...dataRes,
        mabn: dataRes?.mabn?._id,
        tenbn: dataRes?.mabn?.hoten,
        maphai: dataRes?.mabn?.maphai?.tenphai,
        ngaysinh: dateFormatter(dataRes?.mabn?.ngaysinh),
        dienthoai: dataRes?.mabn?.dienthoai,
        email: dataRes?.mabn?.email,
        created_at: timeFormatter(dataRes?.created_at),
        ngaytraloi: timeFormatter(dataRes?.ngaytraloi),
        madm: dataRes?.madm?._id,
        full_name: dataRes?.nguoitraloi_id?.full_name,
        tendm: dataRes?.madm?.tendm,
        traloi: dataRes?.traloi,
        lydotuchoi: dataRes?.lydotuchoi,
        bacsi_id: dataRes?.bacsi_id?._id,
        tennv: dataRes?.bacsi_id?.tennv,
      })
    }
  }

  handleSaveData = async values => {
    try {
      let data = {
        trangthai: values.trangthai,
        bacsi_id: values.bacsi_id,

        madm: values.madm,
        ngaytraloi: new Date()
      }
      if(this.state.trangthai === 2){
        data.traloi = values.traloi
        let [originFileNm, fileUpload] = getfileDetail(this.state.fileList);
        if(fileUpload.length){
          let files = await uploadImages(fileUpload);
          if (files && files.length) {
            originFileNm = [...originFileNm, ...files]
          }
        }
        data.hinhanh_traloi = originFileNm
      }else if(this.state.trangthai === 3){
        data.lydotuchoi = values.lydotuchoi
      } else if(this.state.trangthai === 4) {
        data.trangthai = 4;
      }

      let { _id } = this.state;

      const apiResponse = await updateById(_id, data);
      if (apiResponse) {
        this.state.trangthai === 4
          ? message.success('Đã bỏ qua câu hỏi')
          : message.success('Trả lời thành công');
        this.formRef.current.setFieldsValue({
          ngaytraloi: timeFormatter(apiResponse?.ngaytraloi),
          full_name: apiResponse?.nguoitraloi_id?.full_name
        })
        let fileList = convertUrlToListFile(apiResponse.hinhanh_traloi);
        this.setState({fileList})
      }
    } catch (e) {
      console.log(e);
    }
  };


  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    try {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.setState({
        previewVisible: true,
        previewImage: file.preview ? file.preview : file.url,
      });
    } catch (e) {
      console.log(e);
    }
  }

  onValuesChange = async (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('trangthai')) {
      this.setState({ trangthai: changedValues.trangthai })
      this.formRef.current.validateFields();
    }
  }

  moreQuestions = () => {
    this.setState({ showModalMessage: true });
  }

  modalCancel = () => {
    this.setState({ showModalMessage: false });
  }

  render() {
    const { loading, myPermission } = this.props;
    const { _id, trangthai, previewVisible, previewImage, hinhanh, fileList, showModalMessage, dataRes } = this.state;

    return (
      <Box title='Chi tiết câu hỏi' boxActions={
        myPermission?.[this.url]?.sua &&
        <Button size='small' type="primary" icon={<SaveOutlined />} htmlType="submit" form="formSub">Trả lời câu hỏi</Button>
      }>
        <Form size='small' className='form-info' ref={this.formRef} layout='vertical' id="formSub"
              name="formSub" onFinish={this.handleSaveData} onValuesChange={this.onValuesChange}>
          <Divider orientation="left">Thông tin câu hỏi</Divider>
          <Row gutter={5}>
            <Col {...layoutCol}>
              <Form.Item label="Mã bệnh nhân" name="mabn">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...layoutCol}>
              <Form.Item label="Tên bệnh nhân" name="tenbn">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...layoutCol}>
              <Form.Item label="Giới tính" name="maphai">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...layoutCol}>
              <Form.Item label="Ngày sinh" name="ngaysinh">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...layoutCol}>
              <Form.Item label="Số điện thoại" name="dienthoai">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...layoutCol}>
              <Form.Item label="Email" name="email">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...layoutCol}>
              <Form.Item label="Ngày hỏi" name="created_at">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...layoutCol}>
              <Form.Item label="Hỏi bác sĩ" name="bacsi_id">
                {/*<Input disabled />*/}
                <Select placeholder='Chọn giáo viên' disabled={loading} dropdownClassName='small' disabled={this.state.trangthai !== 1}>
                  {this.state.dsNhanVien.map(data => {
                    return <Select.Option key={data._id} value={data._id}>{data.tennv}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col {...layoutCol1}>
              <Form.Item label='Nội dung câu hỏi' name="cauhoi">
                <Input.TextArea disabled autoSize={ {minRows: 2, maxRows: 6} }/>
              </Form.Item>
            </Col>
          </Row>

          {hinhanh.length ? <Row gutter={10}>
            <Col xs={24} lg={24} xl={24}>
              <Image.PreviewGroup>
                {
                  hinhanh.map(data => {
                    return <Image width={100} src={API.FILES.format(data)} key={data}/>
                  })
                }
              </Image.PreviewGroup>
            </Col>
          </Row> : ""}

          <Divider orientation="left">Thông tin trả lời</Divider>
          <Row gutter={5}>
            <Col sm={24}>
              <Form.Item name="trangthai" label="Trạng thái xử lý :" style={{display: 'flex', flexDirection: 'row'}}
                         labelCol={{sm: 4, xxl: 2}}>
                <Radio.Group compact>
                  <Radio value={1}><Tag icon={<ExclamationCircleOutlined  />} color="warning" className="font-medium">Đang chờ</Tag></Radio>
                  <Radio value={2}><Tag icon={<CheckCircleOutlined />} color="success" className="font-medium">Đã trả lời</Tag></Radio>
                  <Radio value={3}><Tag icon={<CloseCircleOutlined  />} color="error" className="font-medium">Từ chối trả lời</Tag></Radio>
                  <Radio value={4}><Tag icon={<CloseCircleOutlined  />} color="magenta" className="font-medium">Bỏ qua</Tag></Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            {
              ( trangthai === 3 || trangthai === 2 ) &&
              <>
                <Col {...layoutCol}>
                  <Form.Item label="Danh mục" name="madm" validateTrigger={['onChange', 'onBlur']}
                             rules={trangthai === 2 ? [RULE.REQUIRED] : []}>
                    <Select placeholder='Chọn danh mục câu hỏi' disabled={loading} dropdownClassName='small'>
                      {this.state.dmhoidap?.map((data, i) => {
                        return <Select.Option key={i} value={data._id}>
                          {data.tendm}
                        </Select.Option>;
                      })}
                    </Select>
                  </Form.Item>
                </Col>

                <Col {...layoutCol}>
                  <Form.Item label="Ngày trả lời" name="ngaytraloi">
                    <Input disabled />
                  </Form.Item>
                </Col>


                <Col {...layoutCol}>
                  <Form.Item label="Người trả lời" name="full_name">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </>
            }

            {
              trangthai === 3 &&
              <Col sm={24}>
                <Form.Item
                  label='Lý do từ chối'
                  name="lydotuchoi"
                  rules={[RULE.REQUIRED]}
                  labelCol={{ 'xs': 24, 'lg': 24, 'md': 24, 'xl': 3 }}
                >
                  <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} disabled={loading} />
                </Form.Item>
              </Col>
            }

            {trangthai === 2 ? <>
              <Col sm={24}>
                <Form.Item label='Nội dung trả lời' name="traloi" rules={[RULE.REQUIRED]}>
                  <Input.TextArea autoSize={{ minRows: 4 }} disabled={loading} />
                </Form.Item>
              </Col>

              <Col sm={24}>
                <Form.Item
                  label='Hình ảnh trả lời' name="hinhanh_traloi">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    accept="image/*"
                    onPreview={this.handlePreview}
                    onChange={({ fileList }) => this.setState({ fileList })}
                    showUploadList={{
                      showPreviewIcon: true,
                      showDownloadIcon: true,
                      showRemoveIcon: true,
                      downloadIcon: (file) => <a download href={'#'}><DownloadOutlined /></a>
                    }}
                    beforeUpload={file => {
                      const maxSize = 25; // MB
                      const isJpgOrPng = ["image/jpeg", "image/png", "image/gif"];
                      if (!isJpgOrPng) {
                        message.error("Bạn chỉ có thể tải lên tệp JPG/PNG/GIF!");
                        return false;
                      }
                      const isSizeValid = file.size / 1024 / 1024 < maxSize;
                      if (!isSizeValid) {
                        message.error(`Kích thước ảnh phải nhỏ hơn ${maxSize}MB!`);
                        return false;
                      }
                      return false;
                    }}
                  >  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    footer={null}
                    title={null}
                    onCancel={this.handleCancel}
                  >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Form.Item>
              </Col>
            </> : ""}
          </Row>
          {trangthai === 2
            ?  <Button onClick={this.moreQuestions} type="text" icon={<MessageOutlined />}>Trả lời thêm</Button>
            : null
          } 
          <Row gutter={10} className="justify-end">
            {
              myPermission?.[this.url]?.sua && <Button size='small' type="primary" icon={<SaveOutlined />} htmlType="submit">Trả lời câu hỏi</Button>
            }

          </Row>
        </Form>

        <HoiDapMessageModal
          hoidap_id={_id}
          hoidap_data={dataRes}
          loading={loading}
          visible={showModalMessage}
          onCancel={this.modalCancel}
        />
      </Box>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission()
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(ChiTietHoiDap);

