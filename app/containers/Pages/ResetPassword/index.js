import React from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { StringParam, useQueryParam } from "use-query-params";
import { Link, useHistory } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

import LOGO from "@assets/images/logos/logo.svg";

import { URL } from "@url";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { requestResetPassword } from "@services/userService";

import "@containers/Pages/Login/Login.scss";
import { BackwardOutlined } from '@ant-design/icons';

export default function ResetPassword() {
  const loading = useSelector(makeGetLoading());
  let history = useHistory();
  const [token] = useQueryParam("token", StringParam);

  const resetPassword = async value => {
    const data = {
      password: value.password
    };
    const response = await requestResetPassword(token, data);
    if (response && response.success) {
      message.success("Thay đổi mật khẩu thành công, vui lòng đăng nhập với mật khẩu mới này");
      history.push('/');
    }

  };

  return (
    <div style={{ height: "100vh" }}>
      <div id="login" className="login-form">
        <div className="logo">
          <img alt="logo" src={LOGO} />
          <span>Đại phúc DFC</span>
        </div>
        <Form layout="vertical" onFinish={resetPassword}>
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[{ required: true, whitespace: true, message: "Mật khẩu là bắt buộc nhập" }]}
            hasFeedback
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Nhập lại mật khẩu mới"
            rules={[
              { required: true, whitespace: true, message: "Mật khẩu là bắt buộc nhập" },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu không trùng khớp");
                }
              })
            ]}
            hasFeedback
            dependencies={["password"]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đồng ý
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: 10 }}>
          <Link to={URL.HOMEPAGE}>
            <Button type="link" icon={<BackwardOutlined />}>Trở về đăng nhập</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
