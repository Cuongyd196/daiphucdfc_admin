import React from "react";
import moment from "moment";
import debounce from "lodash/debounce";
import { useAsyncMemo } from "use-async-memo";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, Form, Input, Space, Select, Button, Upload, Avatar, DatePicker, Typography, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";

import { getBase64 } from "@utils/imageUtil";
import { getShortname, getAvatarSrc } from "@models/user";

import { updateMyInfo } from "@containers/Layout/HeaderComponent/HeaderProvider/actions";
import { makeGetMyInfo } from "@containers/Layout/HeaderComponent/HeaderProvider/selectors";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";

import { GENDER_OPTIONS, ROLE_OPTIONS, RULE } from "@constants";

export default function Basic() {
  const [form] = Form.useForm();

  const loading = useSelector(makeGetLoading());
  const myInfoResponse = useSelector(makeGetMyInfo());

  const dispatch = useDispatch();

  const [imageFile, setImageFile] = React.useState(null);

  const imageSrc = useAsyncMemo(async () => {
    if (imageFile) {
      return await getBase64(imageFile);
    }
    return "";
  }, [imageFile]);

  React.useEffect(() => {
    setDataProfile(myInfoResponse);
  }, [myInfoResponse]);

  const setDataProfile = dataInfo => {
    const fieldsValue = {
      username: dataInfo.username,
      role: dataInfo.role,
      phoneNumber: dataInfo.phone,
      dateOfBirth: dataInfo.birthday ? moment(dataInfo.birthday) : "",
      fullName: dataInfo.full_name,
      email: dataInfo.email,
      gender: dataInfo.gender
    };
    form.resetFields();
    form.setFieldsValue(fieldsValue);
  };

  const onSaveProfile = debounce(values => {
    const reqData = {
      _id: myInfoResponse._id,
      phone: values.phoneNumber,
      birthday: values.dateOfBirth,
      full_name: values.fullName,
      email: values.email,
      gender: values.gender,
      avatarFile: imageFile
    };
    dispatch(updateMyInfo(reqData));
  }, 500);

  return (
    <>
      <Typography.Title level={4}>Cài đặt cơ bản</Typography.Title>
      <Form size="small" form={form} layout="vertical" onFinish={onSaveProfile}>
        <Row>
          <Col xl={16}>
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={12}>
                <Form.Item name="username" label="Tài khoản">
                  <Input placeholder="Tài khoản" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item name="role" label="Vai trò">
                  <Select placeholder="Chọn Vai trò" dropdownClassName="small" disabled>
                    {ROLE_OPTIONS.map(role => (
                      <Select.Option key={role.value} value={role.value}>
                        {role.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item name="fullName" label="Họ tên" rules={[RULE.REQUIRED]} hasFeedback>
                  <Input placeholder="Họ tên" disabled={loading} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[RULE.REQUIRED]}
                  hasFeedback
                  validateTrigger={["onChange", "onBlur"]}
                >
                  <Select placeholder="Chọn Giới tính" disabled={loading} dropdownClassName="small">
                    {GENDER_OPTIONS.map(gender => (
                      <Select.Option key={gender.value} value={gender.value}>
                        {gender.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[RULE.REQUIRED, RULE.EMAIL]}
                  hasFeedback
                  validateTrigger={["onChange", "onBlur"]}
                >
                  <Input placeholder="Email" disabled={loading} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Điện thoại"
                  rules={[RULE.REQUIRED, RULE.PHONE]}
                  hasFeedback
                  validateTrigger={["onChange", "onBlur"]}
                >
                  <Input placeholder="Điện thoại" disabled={loading} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item name="dateOfBirth" label="Ngày sinh">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    placeholder="Ngày sinh"
                    disabled={loading}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xl={8}>
            <Form.Item className="text-center">
              <Space direction="vertical">
                <Avatar src={imageSrc || getAvatarSrc(myInfoResponse)} size={128} style={{ fontSize: 48 }}>
                  {getShortname(myInfoResponse)}
                </Avatar>
                <Upload
                  accept="image/*"
                  onChange={({ file }) => setImageFile(file)}
                  beforeUpload={file => {
                    const maxSize = 5; // MB
                    const isJpgOrPng = ["image/jpeg", "image/png", "image/gif"].includes(file.type);
                    if (!isJpgOrPng) {
                      message.error("Bạn chỉ có thể tải lên tệp JPG/PNG/GIF!");
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
                  <Button size="small">Thay đổi hình đại diện</Button>
                </Upload>
              </Space>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                Lưu
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
