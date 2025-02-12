import React from "react";
import debounce from "lodash/debounce";
import { Col, Row, Form, Input, Button, Typography, notification } from "antd";
import { useCookies } from "react-cookie";

import { requestChangePassword } from "@services/userService";

export default function Security() {
  const [, , removeCookie] = useCookies(["token"]);

  const onSubmitPassword = debounce(async values => {
    const reqData = {
      old_password: values.password,
      new_password: values.newPassword
    };
    const response = await requestChangePassword(reqData);
    if (response) {
      removeCookie("token", { path: "/" });
      notification.success({
        message: "Mật khẩu thay đổi thành công",
        description: "Bạn vui lòng đăng nhập lại để tiếp tục sử dụng"
      });
    }
  }, 500);

  return (
    <>
      <Typography.Title level={4}>Cài đặt bảo mật</Typography.Title>
      <Typography.Text strong>Đổi mật khẩu</Typography.Text>
      <Form size="small" layout="vertical" onFinish={onSubmitPassword}>
        <Row gutter={10}>
          <Col xl={6} xs={24}>
            <Form.Item
              name="password"
              label="Mật khẩu cũ"
              rules={[
                { required: true, whitespace: true, message: "Mật khẩu là bắt buộc nhập" }
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
          <Col xl={6} xs={24}>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, whitespace: true, message: "Mật khẩu là bắt buộc nhập" }
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
          <Col xl={6} xs={24}>
            <Form.Item
              name="confirmPassword"
              label="Nhập lại mật khẩu mới"
              rules={[
                { required: true, whitespace: true, message: "Mật khẩu là bắt buộc nhập" },
                ({ getFieldValue }) => ({
                  validator(rule, confirmPassword) {
                    if (confirmPassword && getFieldValue("newPassword") !== confirmPassword) {
                      return Promise.reject("Mật khẩu mới không trùng khớp");
                    }
                    return Promise.resolve();
                  }
                })
              ]}
              hasFeedback
              dependencies={["newPassword"]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
          <Col className="flex items-end">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thay đổi
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
