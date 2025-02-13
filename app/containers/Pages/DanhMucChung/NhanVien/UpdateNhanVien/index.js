import React, { Component } from 'react';
import {
  Button,
  Card,
  Col,
  message,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  Upload,
  Skeleton,
} from 'antd';
import { DownloadOutlined, SaveOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { RULE } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import QuillEditor from '@components/QuillEditor';
import Avatar from 'antd/es/avatar/avatar';
import { withPhai } from '@reduxApp/Phai/connect';
import { getBase64 } from '@utils/imageUtil';
import { uploadImage } from '@services/uploadServices';
import { API } from '@api';
import { getById, updateById } from '@services/danhmucchung/nhanvienService';
import TextArea from 'antd/es/input/TextArea';

function CustomSkeleton(props) {
  const { children, isShowSkeleton, ...rest } = props;
  if (isShowSkeleton) return <Skeleton.Input active size="small"/>;
  return React.cloneElement(children, rest);
}

class UpdateNhanVien extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mota: '',
      setImageFile: '',
      getImageFile: '',
    };
    this.formRef = React.createRef();
    this.url = 'dmnhanvien';
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const dataResponse = await getById(id);
    if (dataResponse) {
      this.setState({ getImageFile: dataResponse.hinhanh ? API.FILES.format(dataResponse.hinhanh) : '' });
      this.formRef.current.setFieldsValue({ ...dataResponse, maphai: dataResponse.maphai?._id });
    }
  };

  onFinish = async value => {
    const { id } = this.props.match.params;
    const { setImageFile } = this.state;
    let hinhanh = '';
    if (setImageFile) {
      hinhanh = await uploadImage(setImageFile);
      value.hinhanh = hinhanh;
    } else delete (value.hinhanh);
    const apiResponse = await updateById(id, value);
    if (apiResponse) {
      message.success('Cập nhật dữ liệu thành công');
    }
  };

  handleEditorChange = (value) => {
    this.setState({ mota: value });
  };

  onSetImage = async (file) => {
    this.setState({
      setImageFile: file,
      getImageFile: await getBase64(file),
    });
  };

  render() {
    const { myPermission, phai } = this.props;
    const { getImageFile } = this.state;
    const labelCol = { 'xs': 24, 'sm': 12, 'md': 12, 'lg': 12, 'xl': 8, 'xxl': 8 };

    return <Card
      title={<span><UnorderedListOutlined className="icon-card-header"/> &nbsp; Cập nhật thông tin giáo viên</span>}
      size="small" md="24" bordered
      extra={myPermission?.[this.url]?.sua &&
      <Button type="primary" size="small" htmlType="submit" icon={<SaveOutlined/>}
              form="form">
        Lưu dữ liệu
      </Button>}>
      <Form ref={this.formRef} layout="vertical" size="small" autoComplete="off" onFinish={this.onFinish} name="form">
        <Row gutter={24}>
          <Col xs={24} xl={18}>
            <Row gutter={10}>
              <Col xs={24} xl={6}>
                <Form.Item label="Họ tên" name="tennv" labelCol={labelCol}
                           validateTrigger={['onChange', 'onBlur']}
                           rules={[{ required: true, message: 'Họ tên không được để trống' }]}>
                  <Input placeholder="Nhập họ tên"/>
                </Form.Item>
              </Col>

              <Col xs={24} xl={4}>
                <Form.Item label="Giới tính" name="maphai"
                           validateTrigger={['onChange', 'onBlur']}>
                  <CustomSkeleton isShowSkeleton={false}>
                    <Select placeholder="Chọn giới tính" dropdownClassName="small">
                      {phai.map((gender, i) => {
                        return <Select.Option key={i} value={gender._id}>
                          {gender.tenphai}
                        </Select.Option>;
                      })}
                    </Select>
                  </CustomSkeleton>
                </Form.Item>
              </Col>

              <Col xs={24} xl={6}>
                <Form.Item label="Số điện thoại"
                           name="dienthoai"
                           hasFeedback
                           rules={[RULE.PHONE]}>
                  <Input/>
                </Form.Item>
              </Col>



              <Col xs={24} xl={8}>
                <Form.Item label="Email"
                           name="email"
                           labelCol={labelCol}
                           hasFeedback
                           rules={[RULE.EMAIL]}>
                  <Input placeholder="Nhập email"/>
                </Form.Item>
              </Col>

            </Row>

            <Row gutter={10}>
                          <Col xs={24} xl={6}>
                            <Form.Item label="Trình độ" name="trinhdo" labelCol={labelCol}
                                       validateTrigger={['onChange', 'onBlur']}
                                       rules={[{ required: true, message: 'Trình độ không được để trống' }]}>
                              <Input placeholder="Nhập Trình độ"/>
                            </Form.Item>
                          </Col>
            
                          <Col xs={24} xl={6}>
                            <Form.Item label="Chuyên ngành đào tạo"
                                       name="chuyennganh"
                                       hasFeedback
                                       rules={[RULE.REQUIRED]}>
                              <Input  placeholder="Nhập chuyên ngành"/>
                            </Form.Item>
                          </Col>
            
                          <Col xs={24} xl={6}>
                            <Form.Item label="Đơn vị"
                                       name="donvi"
                                       labelCol={labelCol}
                                       hasFeedback
                                       rules={[RULE.REQUIRED]}>
                              <Input placeholder="Nhập đơn vị"/>
                            </Form.Item>
                          </Col>
                          <Col xs={24} xl={6}>
                            <Form.Item label="Ghi chú"
                                       name="ghichu"
                                       labelCol={labelCol}
                                       hasFeedback
                                       >
                              <Input placeholder="Nhập ghi chú"/>
                            </Form.Item>
                          </Col>
            
                        </Row>
            <Row gutter={10}>
              {/* <Col xs={24} xl={10}>
                <Form.Item label="Nơi sinh" name="noisinh">
                  <TextArea placeholder="Nhập nơi sinh"/>
                </Form.Item>
              </Col> */}

              <Col xs={24} xl={6}>
                <Form.Item label="Thứ tự hiển thị" name="thutuhienthi" hasFeedback rules={[RULE.NUMBER_FLOAT]}>
                  <InputNumber placeholder="Thứ tự hiển thị"/>
                </Form.Item>
              </Col>

            </Row>
          </Col>
          <Col xs={24} xl={6}>
            <Form.Item className="text-center" name="hinhanh">
              <Space direction="vertical">
                <Avatar shape="square"
                        src={getImageFile}
                        size={120}/>
                <Upload
                  accept="image/*"
                  onChange={({ file }) => this.onSetImage(file)}
                  beforeUpload={file => {
                    const maxSize = 5; // MB
                    const isJpgOrPng = ['image/jpeg', 'image/png', 'image/gif'];
                    if (!isJpgOrPng) {
                      message.error('Bạn chỉ có thể tải lên tệp JPG/PNG/GIF!');
                      return false;
                    }
                    const isSizeValid = file.size / 1024 / 1024 < maxSize;
                    if (!isSizeValid) {
                      message.error(`Kích thước ảnh phải nhỏ hơn ${maxSize}MB!`);
                      return false;
                    }
                    // Upload file manually after
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button size="small" type="primary" shape="round" icon={<DownloadOutlined/>}>Thay ảnh đại
                    diện</Button>
                </Upload>
              </Space>
            </Form.Item>
          </Col>
          <Col xs={24} xl={18}>
            <Row gutter={10}>

            </Row>
          </Col>


          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item label="Giới thiệu" name="gioithieu" hasFeedback>
              <QuillEditor onChange={this.handleEditorChange} value={this.state.mota}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>;
  }
}

const mapStateToProps = createStructuredSelector({
  myPermission: makeGetPermission(),
});
const withConnect = connect(mapStateToProps);

export default compose(withConnect, withPhai)(UpdateNhanVien);
