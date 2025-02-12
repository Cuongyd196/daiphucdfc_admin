import React from 'react';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';
import { Col, Row, Form, Input, Button, Typography, message, InputNumber, TimePicker } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { getOne, update } from '@services/thongtinchungService';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';

export default function Basic() {
  const [form] = Form.useForm();

  const loading = useSelector(makeGetLoading());

  React.useEffect(() => {
    const getDataInfo = async () => {
      const apiRequest = await getOne();
      form.setFieldsValue({
        ...apiRequest,
        casangbatdau: moment(apiRequest.casangbatdau, 'HH:mm'),
        casangketthuc: moment(apiRequest.casangketthuc, 'HH:mm'),
        cachieubatdau: moment(apiRequest.cachieubatdau, 'HH:mm'),
        cachieuketthuc: moment(apiRequest.cachieuketthuc, 'HH:mm'),
        ngoaigiobatdau: moment(apiRequest.ngoaigiobatdau, 'HH:mm'),
        ngoaigioketthuc: moment(apiRequest.ngoaigioketthuc, 'HH:mm'),
        casangbatdau_ngayle: apiRequest?.casangbatdau_ngayle ? moment(apiRequest.casangbatdau_ngayle, 'HH:mm') : '',
        casangketthuc_ngayle: apiRequest?.casangketthuc_ngayle ? moment(apiRequest.casangketthuc_ngayle, 'HH:mm') : '',
        cachieubatdau_ngayle: apiRequest?.cachieubatdau_ngayle ? moment(apiRequest.cachieubatdau_ngayle, 'HH:mm') : '',
        cachieuketthuc_ngayle: apiRequest?.cachieuketthuc_ngayle ? moment(apiRequest.cachieuketthuc_ngayle, 'HH:mm') : '',
      });
    };
    getDataInfo();
  }, []);

  const onSave = debounce(async (values) => {
    values.casangbatdau = values.casangbatdau ? values.casangbatdau.format('HH:mm') : '';
    values.casangketthuc = values.casangketthuc ? values.casangketthuc.format('HH:mm') : '';
    values.cachieubatdau = values.cachieubatdau ? values.cachieubatdau.format('HH:mm') : '';
    values.cachieuketthuc = values.cachieuketthuc ? values.cachieuketthuc.format('HH:mm') : '';
    values.ngoaigiobatdau = values.ngoaigiobatdau ? values.ngoaigiobatdau.format('HH:mm') : '';
    values.ngoaigioketthuc = values.ngoaigioketthuc ? values.ngoaigioketthuc.format('HH:mm') : '';
    values.casangbatdau_ngayle = values.casangbatdau_ngayle ? values.casangbatdau_ngayle.format('HH:mm') : '';
    values.casangketthuc_ngayle = values.casangketthuc_ngayle ? values.casangketthuc_ngayle.format('HH:mm') : '';
    values.cachieubatdau_ngayle = values.cachieubatdau_ngayle ? values.cachieubatdau_ngayle.format('HH:mm') : '';
    values.cachieuketthuc_ngayle = values.cachieuketthuc_ngayle ? values.cachieuketthuc_ngayle.format('HH:mm') : '';
    const apiRequest = await update(values._id, values);
    if (apiRequest) {
      message.success('Cập nhật dữ liệu thành công.');
    }
  });

  return (
    <Form size='small' layout='vertical' autoComplete='off' onFinish={onSave} form={form}>
      <Typography.Title level={4} className='underline'>
        Thời gian làm việc
      </Typography.Title>
      <Typography.Title level={5}>Thứ 2 đến thứ 6</Typography.Title>
      <Row gutter={10}>
        <Form.Item name='_id' hidden={true}>
          <Input disabled={true} type='hidden' />
        </Form.Item>
        <Col xl={6}>
          <Form.Item
            name='casangbatdau'
            label='Thời gian bắt đầu ca sáng'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <TimePicker format='HH:mm' disabled={loading} className='w-full' />
          </Form.Item>
        </Col>
        <Col xl={6}>
          <Form.Item
            name='casangketthuc'
            label='Thời gian kết thúc ca sáng'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <TimePicker format='HH:mm' disabled={loading} className='w-full' />
          </Form.Item>
        </Col>
        <Col xl={6}>
          <Form.Item
            name='cachieubatdau'
            label='Thời gian bắt đầu ca chiều'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <TimePicker format='HH:mm' disabled={loading} className='w-full' />
          </Form.Item>
        </Col>
        <Col xl={6}>
          <Form.Item
            name='cachieuketthuc'
            label='Thời gian kết thúc ca chiều'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <TimePicker format='HH:mm' disabled={loading} className='w-full' />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col xl={6}>
          <Form.Item
            name='ngoaigiobatdau'
            label='Thời gian bắt đầu làm ca tối'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <TimePicker format='HH:mm' disabled={loading} className='w-full' />
          </Form.Item>
        </Col>
        <Col xl={6}>
          <Form.Item
            name='ngoaigioketthuc'
            label='Thời gian kết thúc làm ca tối'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <TimePicker format='HH:mm' disabled={loading} className='w-full' />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Title level={5}>Thứ 7, CN, ngày lễ</Typography.Title>
      <Row gutter={10}>
        {/* <Form.Item name='_id' hidden={true}>
          <Input disabled={true} type='hidden' />
        </Form.Item> */}
        <Col xl={6}>
          <Form.Item
            name='casangbatdau_ngayle'
            label='Thời gian bắt đầu ca sáng'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <TimePicker format='HH:mm' disabled={loading} className='w-full' />
          </Form.Item>
        </Col>
        <Col xl={6}>
          <Form.Item
            name='casangketthuc_ngayle'
            label='Thời gian kết thúc ca sáng'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <TimePicker format='HH:mm' disabled={loading} className='w-full' />
          </Form.Item>
        </Col>
        <Col xl={6}>
          <Form.Item
            name='cachieubatdau_ngayle'
            label='Thời gian bắt đầu ca chiều'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <TimePicker format='HH:mm' disabled={loading} className='w-full' />
          </Form.Item>
        </Col>
        <Col xl={6}>
          <Form.Item
            name='cachieuketthuc_ngayle'
            label='Thời gian kết thúc ca chiều'
            hasFeedback
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <TimePicker format='HH:mm' disabled={loading} className='w-full' />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Title level={5}>Cài đặt thời gian đặt lịch</Typography.Title>
      <Row gutter={10}>
        <Col xl={6}>
          <Form.Item
            name='khoangcachlanhen'
            label='Khoảng cách đặt lịch'
            hasFeedback
            rules={[{ required: true, message: 'Không được để trống' }]}
            tooltip='Thời gian cách nhau giữa các lần cho phép bệnh nhân đặt lịch (Phút)'
          >
            <InputNumber placeholder='Số phút' disabled={loading} />
          </Form.Item>
        </Col>
        <Col xl={6}>
          <Form.Item
            name='yeucaudattruoc'
            label='Yêu cầu đặt trước'
            hasFeedback
            rules={[{ required: true, message: 'Không được để trống' }]}
            tooltip='Thời gian tối thiểu yêu cầu bệnh nhân đặt lịch trước so với thời điểm đặt lịch (Giờ)'
          >
            <InputNumber placeholder='Số giờ' disabled={loading} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Form.Item>
            <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={loading}>
              Lưu thông tin
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
