import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { getOne, update } from '@services/thongtinchungService';
import { Button, Col, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ThongBaoApp() {
  const [form] = Form.useForm();
  const [idThongTinChung, setIdThongTinChung] = useState('');
  const loading = useSelector(makeGetLoading());
  const onSave = async (value) => {
    let data = await update(idThongTinChung, value);
    if (data && data._id) message.success('Cập nhật thông báo thành công');
  };

  useEffect(() => {
    const getInfo = async () => {
      let thongtinchung = await getOne();
      if (thongtinchung && thongtinchung._id) {
        setIdThongTinChung(thongtinchung._id);
        form.setFieldsValue({
          thongbaouongthuoc: thongtinchung?.thongbaouongthuoc,
          thongbaohenkham: thongtinchung?.thongbaohenkham,
        });
      }
    };

    getInfo();
  }, []);

  return (
    <div>
      <Form size='small' layout='vertical' autoComplete='off' onFinish={onSave} form={form}>
        <Col xl={16}>
          <Form.Item
            name='thongbaouongthuoc'
            label='Thông báo nhắc uống thuốc'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                message: 'Không được để trống',
              },
            ]}
            tooltip={
              <>
                Sử dụng <b>$bacsi</b> để hiện thị tên bác sĩ trong thông báo
              </>
            }
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xl={16}>
          <Form.Item
            name='thongbaohenkham'
            label='Thông báo nhắc hẹn khám'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                message: 'Không được để trống',
              },
            ]}
            tooltip={
              <>
                Sử dụng <b>$ngay</b> để hiện thị ngày, <b>$phong</b> để hiện thị tên phòng khám trong thông
                báo
              </>
            }
          >
            <Input />
          </Form.Item>
        </Col>

        <Form.Item>
          <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={loading}>
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
