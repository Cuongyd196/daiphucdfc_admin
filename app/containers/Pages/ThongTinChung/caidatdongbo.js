import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Row, Col, Form, Typography, Button, message } from 'antd';
import PropTypes from 'prop-types';
import { SaveOutlined } from '@ant-design/icons';
import { update } from '@services/thongtinchungService';
import { useSelector } from 'react-redux';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';

const CaiDatDongBo = (props) => {
  const loading = useSelector(makeGetLoading());
  const [dongbotudong, setdongbotudong] = useState(false);
  const formRefDongBo = useRef(null);

  useEffect(() => {
    const { dongbo_tudong, dongbo_hoten, dongbo_dienthoai, dongbo_ngaysinh, dongbo_socmnd } = props.data;
    if (props.data) {
      setdongbotudong(dongbo_tudong ? dongbo_tudong : false);
      formRefDongBo?.current.setFieldsValue({
        dongbo_hoten: dongbo_hoten,
        dongbo_dienthoai: dongbo_dienthoai,
        dongbo_ngaysinh: dongbo_ngaysinh,
        dongbo_socmnd: dongbo_socmnd,
      });
    }
  }, [props.data]);

  const handleSaveData = async (value) => {
    const dataReq = {
      dongbo_tudong: dongbotudong ? dongbotudong : false,
      dongbo_hoten: value.dongbo_hoten ? value.dongbo_hoten : false,
      dongbo_dienthoai: value.dongbo_dienthoai ? value.dongbo_dienthoai : false,
      dongbo_ngaysinh: value.dongbo_ngaysinh ? value.dongbo_ngaysinh : false,
      dongbo_socmnd: value.dongbo_socmnd ? value.dongbo_socmnd : false,
    };
    if (props.idThongTinChung) {
      const updateRes = await update(props.idThongTinChung, dataReq);
      console.log('updateRes', updateRes);
      message.success('Cập nhật cài đặt đồng bộ thành công');
    }
  };

  const colSpan = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 12,
  };

  return (
    <>
      <Row justify={'center'}>
        <Col flex='auto'>
          <Typography.Title level={5} className='underline'>
            {props.index}. Cài đặt đồng bộ bệnh nhân tự động
          </Typography.Title>
        </Col>
      </Row>

      <Form
        ref={formRefDongBo}
        id='formDongBo'
        name='formDongBo'
        autoComplete='off'
        onFinish={handleSaveData}
        labelAlign='right'
        size='small'
      >
        <Checkbox checked={dongbotudong} onChange={(e) => setdongbotudong(!dongbotudong)}>
          <Typography.Text strong>Đồng bộ tự động</Typography.Text>
        </Checkbox>

        <Row style={{ marginTop: 5 }}>
          <Col {...colSpan}>
            <Form.Item name='dongbo_hoten' labelCol={{ span: 8 }} valuePropName='checked'>
              <Checkbox disabled={!dongbotudong}>Họ tên</Checkbox>
            </Form.Item>
          </Col>

          <Col {...colSpan}>
            <Form.Item name='dongbo_dienthoai' labelCol={{ span: 8 }} valuePropName='checked'>
              <Checkbox disabled={!dongbotudong}>SĐT</Checkbox>
            </Form.Item>
          </Col>

          <Col {...colSpan}>
            <Form.Item name='dongbo_ngaysinh' labelCol={{ span: 8 }} valuePropName='checked'>
              <Checkbox disabled={!dongbotudong}>Ngày sinh</Checkbox>
            </Form.Item>
          </Col>

          <Col {...colSpan}>
            <Form.Item name='dongbo_socmnd' labelCol={{ span: 8 }} valuePropName='checked'>
              <Checkbox disabled={!dongbotudong}>Số CMND/CCCD</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Button
        icon={<SaveOutlined />}
        type='primary small'
        htmlType='submit'
        form='formDongBo'
        style={{ marginBottom: 10 }}
        loading={loading}
        size='small'
      >
        Lưu
      </Button>
    </>
  );
};
export default CaiDatDongBo;

CaiDatDongBo.propTypes = {
  idThongTinChung: PropTypes.string,
  index: PropTypes.number,
  data: PropTypes.object,
};
