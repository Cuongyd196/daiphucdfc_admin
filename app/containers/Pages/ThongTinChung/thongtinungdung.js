import React from "react";
import { useSelector } from "react-redux";
import { Col, Row, Form, Button, Typography, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";

import CkEditor from "@components/CkEditor";
import QuillEditor from "@components/QuillEditor";

import { getOne, update } from "@services/thongtinungdungServices";

import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

export default function Basic() {
  const [form] = Form.useForm();

  const loading = useSelector(makeGetLoading());
  const myPermission = useSelector(makeGetPermission());
  const url = 'thong-tin-chung';

  React.useEffect(() => {
    const getDataInfo = async () => {
      const apiRequest = await getOne();
      const fieldsValue = {
        noidung: apiRequest.noidung,
      };
      form.setFieldsValue(fieldsValue);
    }
    getDataInfo();
  }, []);

  const onSave = (async values => {
    const reqData = {
      noidung: values.noidung,
    }
    const apiRequest = await update(reqData);
    if (apiRequest) {
      message.success("Cập nhật dữ liệu thành công.");
    }
  })

  return (
    <Col xs={24}>
      <Typography.Title level={4}>Thông tin về ứng dụng</Typography.Title>
      <Form size="small" layout="vertical" autoComplete='off' onFinish={onSave} form={form}>
        <Row>
          <Col xs={24}>
            <Form.Item
              name="noidung"
              rules={[{ required: true, message: "Nội dung bắt buộc nhập" }]}
              validateTrigger={["onBlur", "onChange"]}
            >
              <QuillEditor />
            </Form.Item>
          </Col>
          {
            myPermission[url].sua && <Col xs={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Col>
          }

        </Row>
      </Form>
    </Col>
  );
}
