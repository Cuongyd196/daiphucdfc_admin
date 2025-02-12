import React from "react";
import { useSelector } from "react-redux";
import { Form, Input, Button, message } from "antd";

import LOGO from "@assets/images/logos/logo.svg";
import {BackwardOutlined} from '@ant-design/icons';
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { requestForgetPassword } from "@services/userService";

import "@containers/Pages/Login/Login.scss";
import { Link } from 'react-router-dom';
import { URL } from '@url';

export default function ForgetPassword() {
  const loading = useSelector(makeGetLoading());

  const forgetPassword = async value => {
    const data = {
      email: value.email
    };
    const response = await requestForgetPassword(data);
    if (response.success) {
      message.success("Thư lấy lại mật khẩu đã được gửi vào địa chỉ email của bạn");
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <div id="login" className="login-form">
        <div className="logo">
          <img alt="logo" src={LOGO} />
          <span>Phòng khám Tùng Anh</span>
        </div>
        <Form layout="vertical" onFinish={forgetPassword}>
          <Form.Item
            name="email"
            label="Tài khoản email"
            rules={[
              {
                type: "email",
                message: "Không đúng định dạng email"
              },
              {
                required: true,
                message: "Không được để trống"
              }
            ]}
            hasFeedback
          >
            <Input placeholder="Tài khoản email" disabled={loading} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đồng ý
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: 10 }}>
          <Link to={URL.HOMEPAGE}>
            <Button type="link" icon={<BackwardOutlined />}>Quay lại</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
