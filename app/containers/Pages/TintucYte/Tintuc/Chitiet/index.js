import React from 'react';
import { Input, Button, Form, message, Row, Col, Select, Checkbox, Upload, Modal, Table } from 'antd';
import { UploadOutlined, SaveOutlined, BellOutlined } from '@ant-design/icons';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { URL } from '@url';

import Box from '@containers/Box';
import CkEditor from '@components/CkEditor';
import QuillEditor from '@components/QuillEditor';

import { uploadImages } from '@services/uploadServices';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';

import { add, getById, updateById } from '@services/tintucyte/tintucService';
import { getAll as getDanhmucTintuc } from '@services/tintucyte/danhmuctintucService';
import { add as addThongBao, getAll as getAllThongBao } from '@services/thongbaochung/thongbaochungService';
import { dateFormatter } from '@commons/dateFormat';
import { API } from '@api';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

class Tintuc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.match.params.id,
      danhmucTintuc: [],
      avatarUpload: [],
      id: null,
      dataRef: [],
    };
    this.formRef = React.createRef();
    this.url = 'tintuc'
  }

  async componentDidMount() {
    const danhmucRes = await getDanhmucTintuc(0, 0);
    if (danhmucRes && danhmucRes.docs) {
      this.setState({ danhmucTintuc: danhmucRes.docs, id: this.state._id });
    }

    if (this.state._id) {
      const tintucRes = await getById(this.state._id);
      if (tintucRes) {
        const formValues = {
          ...tintucRes,
          danhmuc_id: tintucRes.danhmuc_id?._id,
        };
        if (tintucRes.avatar) this.setState({ avatarUpload: [{ url: API.FILES.format(tintucRes.avatar) }] });
        this.formRef.current.setFieldsValue(formValues);
      }
    }
  }

  toggleModal = async (value) => {
    const { showModal } = this.state;
    if (showModal) {
      this.setState({
        showModal: !showModal
      });
    } else {
      const apiResponse = await getAllThongBao(`link_push_id=${value}`);
      if (apiResponse) {
        this.setState({
          showModal: !showModal,
          dataRef: apiResponse.docs,
        });
      }
    }
  };

  addThongBao = async (value) => {
    const data = {
      loaithongbao: 'TinTuc',
      link_push_id: value,
    };
    const apiResponse = await addThongBao(data);
    if (apiResponse) {
      message.success('Đẩy thông báo thành công');
      this.setState({
        dataRef: [apiResponse, ...this.state.dataRef],
      });
    }
  };

  convetTime(date) {
    const time = new Date(date).toString();
    return time.split(' ')[4];
  }

  onFinish = async values => {
    if (this.state.avatarUpload[0]?.originFileObj) {
      const fileUpload = this.state.avatarUpload.map(data => data.originFileObj);
      const files = await uploadImages(fileUpload);
      if (files?.length) {
        values.avatar = files[0];
      }
    }else{
      delete values.avatar
    }

    if (this.state._id) {
      const tintucRes = await updateById(this.state._id, values);
      if (tintucRes) {
        message.success("Cập nhật dữ liệu thành công");
        if (tintucRes.avatar) this.setState({ avatarUpload: [{ url: API.FILES.format(tintucRes.avatar) }] });
      }
    } else {
      const tintucRes = await add(values);
      if (tintucRes) {
        message.success("Thêm dữ liệu thành công");
        this.props.history.push(URL.TINTUC_ID.format(tintucRes._id));
      }
    }
  };

  render() {
    const { loading, myPermission } = this.props;
    const { id, dataRef } = this.state;
    const layoutCol = { 'xl': 8, 'md': 24, 'lg': 24, 'xs': 24, 'sm': 24 };
    return (
      <Form id="form" ref={this.formRef} size="small" layout="vertical" autoComplete="off" onFinish={this.onFinish}>
        <Box
          title="Tin tức"
          boxActions={
            myPermission?.[this.url].sua &&
            <Button key="submit" htmlType="submit" form="form" icon={<SaveOutlined />} size="small" type="primary">
              Lưu dữ liệu
            </Button>
          }
        >
          <Row gutter={24}>
            {!id ? <>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  name="danhmuc_id"
                  label="Danh mục tin tức"
                  labelCol={layoutCol}
                  rules={[{ required: true, message: 'Danh mục tin tức là bắt buộc' }]}
                  validateTrigger={['onBlur', 'onChange']}
                >
                  <Select
                    placeholder="Chọn danh mục tin tức"
                    disabled={this.props.loading}
                    dropdownClassName="small"
                    filterOption={(input, option) => {
                      return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }}
                  >
                    {this.state.danhmucTintuc?.map(data => (
                      <Select.Option key={data._id} value={data._id}>
                        {data.ten}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Form.Item name="trangchu" label="Hiển thị trang chủ" valuePropName="checked">
                  <Checkbox disabled={this.props.loading} />
                </Form.Item>
              </Col>
              {/* <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Form.Item name="guithongbao" label="Gửi thông báo" valuePropName="checked">
                  <Checkbox disabled={this.props.loading} />
                </Form.Item>
              </Col> */}
            </> : <>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item
                    name="danhmuc_id"
                    label="Danh mục tin tức"
                    labelCol={layoutCol}
                    rules={[{ required: true, message: 'Danh mục tin tức là bắt buộc' }]}
                    validateTrigger={['onBlur', 'onChange']}
                  >
                    <Select
                      placeholder="Chọn danh mục tin tức"
                      disabled={this.props.loading}
                      dropdownClassName="small"
                      filterOption={(input, option) => {
                        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                      }}
                    >
                      {this.state.danhmucTintuc?.map(data => (
                        <Select.Option key={data._id} value={data._id}>
                          {data.ten}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Form.Item name="trangchu" label="Hiển thị trang chủ" valuePropName="checked">
                    <Checkbox disabled={this.props.loading} />
                  </Form.Item>
                </Col>
                {/* <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Form.Item
                    label=" ">
                    <Button icon={<BellOutlined />} size="small" type="primary" onClick={() => this.toggleModal(id)}>
                      Kiểm tra thông báo
                  </Button>
                  </Form.Item>
                </Col> */}
              </>}
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                name="tieude"
                label="Tiêu đề"
                labelCol={layoutCol}
                rules={[{ required: true, message: "Tiêu đề là bắt buộc nhập" }]}
                validateTrigger={["onBlur", "onChange"]}
              >
                <Input.TextArea
                  placeholder="Nhập tiêu đề"
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  disabled={this.props.loading}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item name="tieudephu" labelCol={layoutCol} label="Tiêu đề phụ">
                <Input.TextArea
                  placeholder="Nhập tiêu đề phụ"
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  disabled={this.props.loading}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item name="mota" labelCol={layoutCol} label="Mô tả">
                <Input.TextArea
                  placeholder="Nhập mô tả"
                  autoSize={{ minRows: 5.1, maxRows: 5.1 }}
                  disabled={this.props.loading}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                name="avatar"
                labelCol={layoutCol}
                label="Hình ảnh đại diện"
                rules={[{ required: true, message: "Hình ảnh đại diện là bắt buộc" }]}
              >
                <div>
                  <Upload
                    action={false}
                    accept="image/*"
                    listType="picture-card"
                    fileList={this.state.avatarUpload}
                    onChange={({ file, fileList }) => {
                      if (file.status === "removed") {
                        this.setState({ avatarUpload: [] });
                        this.formRef.current.setFieldsValue({ avatar: "" });
                      } else {
                        this.setState({ avatarUpload: [fileList.pop()] });
                      }
                    }}
                    beforeUpload={() => false}
                    showUploadList={{
                      showPreviewIcon: false,
                      showRemoveIcon: true
                    }}
                    disabled={this.props.loading}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </div>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="noidung"
                label="Nội dung"
                rules={[{ required: true, message: "Nội dung bắt buộc nhập" }]}
                validateTrigger={["onBlur", "onChange"]}
              >
                <QuillEditor />
              </Form.Item>
            </Col>
          </Row>
        </Box>
        {/* <Modal
          title='Quản lý thông báo'
          visible={this.state.showModal}
          closable
          onCancel={loading ? () => null : this.toggleModal}
          footer={null}
          style={{ top: 10 }}
        >
          <Form
            id="formModal"
            name="formModal"
            autoComplete="off"
            labelAlign="right"
          >
            <Row gutter={10}>
              <Col xs={18}>
                <Form.Item
                  label="Danh sách thông báo đã đẩy"
                >
                </Form.Item>
              </Col>
              <Col xs={6}>
                <Form.Item>
                  <Button icon={<BellOutlined />} size="small" type="primary" onClick={() => this.addThongBao(id)}>
                    Đẩy thông báo
                  </Button>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Table size="small" rowKey="_id" bordered dataSource={dataRef} pagination={false}>
                  <Table.Column title="Ngày" dataIndex="created_at" width="30px"
                    render={value => dateFormatter(value)} />
                  <Table.Column title="Giờ" dataIndex="created_at" width="30px"
                    render={value => this.convetTime(value)} />
                  <Table.Column title="Người gửi thông báo" dataIndex="user_id" render={value => value?.full_name} />
                </Table>
              </Col>
            </Row>
          </Form>
        </Modal> */}
      </Form>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission()
});

export default connect(mapStateToProps)(Tintuc);
