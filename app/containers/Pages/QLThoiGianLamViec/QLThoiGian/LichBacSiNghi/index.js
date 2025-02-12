import React, { useEffect, useRef, useState } from 'react';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined, SaveOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
import { dateFormatter } from '@commons/dateFormat';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import Box from '@containers/Box';
import { addLichBacSiNghi, deleteLichBacSiNghi, getAllLichBacSiNghi, getLichLamViec, updateLichBacSiNghi } from '@services/qlthoigianlamviec/lichbacsinghiService';
import { Button, Card, Col, Form, message, Modal, Popconfirm, Row, Spin, Table, Tooltip } from 'antd';
import Select from 'antd/es/select';
import moment, { isMoment } from 'moment';
import { useSelector } from 'react-redux';
import produce from 'immer';

const LichBacSiNghi = (props) => {
  const loading = useSelector(makeGetLoading());
  const [lichnghi, setLichnghi] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState('');
  const [listDate, setListDate] = useState([]);
  const [lichlamviec, setLichLamViec] = useState([]);
  const [ngay, setNgay] = useState('');
  const [bacsiId, setBacsiId] = useState();
  const [thoigiannghi, setThoiGianNghi] = useState([]);
  const formLichNghiRef = useRef(null);
  const nhanviens = props.nhanviens;
  const ngaybatdau = props.ngaybatdau;
  const ngayketthuc = props.ngayketthuc;

  const fecthLichBacSiNghi = async () => {
    let query = `?ngaybatdau=${ngaybatdau.toISOString()}&ngayketthuc=${ngayketthuc.toISOString()}`;
    const lichnghi = await getAllLichBacSiNghi(query);
    if (lichnghi) setLichnghi(lichnghi.docs ? lichnghi.docs : []);
  };

  const fecthThoiGianLamViec = async () => {
    let query = `bacsi_id=${bacsiId}&ngay=${ngay}`;
    const data = await getLichLamViec(query);
    if (data) setLichLamViec(data?.lichlamviecArr ? data.lichlamviecArr : []);
  };

  useEffect(() => {
    if (isMoment(ngaybatdau) && isMoment(ngayketthuc)) fecthLichBacSiNghi();
  }, [ngaybatdau, ngayketthuc]);

  useEffect(() => {
    if (isMoment(ngaybatdau) && isMoment(ngayketthuc)) setListDate(getDateRange(ngaybatdau, ngayketthuc));
  }, [ngaybatdau, ngayketthuc]);

  useEffect(() => {
    if (bacsiId && ngay) {
      fecthThoiGianLamViec();
      formLichNghiRef?.current.setFieldsValue({
        thoigiannghi: [],
      });
    }
  }, [bacsiId, ngay]);

  const formatActionCell = (value) => {
    return (
      <>
        <Tooltip placement='left' title='Cập nhật ' color='#2db7f5'>
          <Button
            icon={<EditOutlined />}
            size='small'
            type='primary'
            className='mr-1'
            onClick={() => edit(value)}
          />
        </Tooltip>
        <Popconfirm
          key={value._id}
          title='Bạn chắc chắn muốn xoá?'
          onConfirm={() => handleDelete(value)}
          okText='Xoá'
          cancelText='Huỷ'
          okButtonProps={{ type: 'danger' }}
        >
          <Tooltip placement='right' title='Xóa' color='#f50'>
            <Button icon={<DeleteOutlined />} type='danger' size='small' className='mr-1' />
          </Tooltip>
        </Popconfirm>
      </>
    );
  };

  const columns = [
    {
      title: 'STT',
      render: (value, row, index) => index + 1,
      align: 'center',
    },
    {
      title: 'Ngày',
      dataIndex: 'ngay',
      render: (value) => dateFormatter(value),
      align: 'center',
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'bacsi_id',
      render: (value) => value?.tennv,
      align: 'center',
    },
    {
      title: 'Thời gian nghỉ ',
      dataIndex: 'thoigiannghi',
      render: (value) =>
        value.map((data, index) => (index === value.length - 1 ? `${data}` : `${data}, `)),
      align: 'center',
    },
    {
      title: '',
      align: 'center',
      width: 90,
      render: (value) => formatActionCell(value),
    },
  ];

  const edit = async (value) => {
    setId(value._id);
    setBacsiId(value.bacsi_id._id);
    setNgay(value.ngay);
    setThoiGianNghi(value.thoigiannghi);
    await setShowModal(true);
    await formLichNghiRef?.current.setFieldsValue({
      bacsi_id: value.bacsi_id._id,
      ngay: moment(value.ngay).format('YYYY-MM-DD'),
      thoigiannghi: value.thoigiannghi,
    });
  };

  const toggleModal = () => {
    if (showModal) {
      formLichNghiRef?.current.resetFields();
      setId('');
      setBacsiId(null);
      setNgay('');
      setThoiGianNghi([]);
    }
    setShowModal(!showModal);
  };

  const handleSaveData = async (value) => {
    if (id) {
      // update
      let date = moment(value.ngay, 'YYYY-MM-DD').toDate();
      value.ngay = date;
      let data = await updateLichBacSiNghi(id, value);
      if(data){
        const lichnghiNext = produce(lichnghi, draft => {
          const index = draft.findIndex((e) => e._id === id);
          draft[index] = data;
        })
        setLichnghi(lichnghiNext);
        toggleModal();
        message.success('Cập nhật lịch nghỉ thành công');
      }
    } else {
      // add
      let date = moment(value.ngay, 'YYYY-MM-DD').toDate();
      value.ngay = date;
      if (!value.thoigiannghi) {
        message.error('Bác sĩ không có lịch làm việc');
        return;
      }
      let data = await addLichBacSiNghi(value);
      if (data) {
        setLichnghi([data, ...lichnghi]);
        toggleModal();
        message.success('Thêm mới lịch nghỉ thành công');
      }
    }
  };

  const handleDelete = async (value) => {
    const data = await deleteLichBacSiNghi(value._id);
    if (data) {
      let lichnghiTmp = lichnghi.filter((e) => e._id !== data._id);
      setLichnghi(lichnghiTmp);
      message.success('Đã xóa lịch nghỉ');
    } 
  };

  const getDateRange = (startDate, endDate) => {
    let arrDate = [];
    let currentDate = moment(startDate).format('YYYY-MM-DD');
    endDate = moment(endDate).format('YYYY-MM-DD');
    while (currentDate <= endDate) {
      arrDate.push(currentDate);
      currentDate = moment(currentDate)
        .add(1, 'd')
        .format('YYYY-MM-DD');
    }
    return arrDate;
  };

  return (
    <div>
      <Box
        title='Lịch bác sĩ nghỉ'
        boxActions={
          <Button
            type='primary'
            onClick={toggleModal}
            className='pull-right'
            size='small'
            icon={<ScheduleOutlined />}
          >
            Thêm lịch nghỉ
          </Button>
        }
      >
        <Card size='small' md='24' bordered>
          <Table
            loading={loading}
            bordered
            columns={columns}
            dataSource={lichnghi}
            size='small'
            rowKey='_id'
            pagination={false}
          />
        </Card>
      </Box>

      <Modal
        title={id ? 'Chỉnh sửa lịch bác sĩ nghỉ' : 'Thêm mới lịch bác sĩ nghỉ'}
        visible={showModal}
        onCancel={loading ? () => null : toggleModal}
        footer={[
          <Button
            key={1}
            size='small'
            onClick={toggleModal}
            disabled={loading}
            type='danger'
            icon={<CloseOutlined />}
          >
            Huỷ
          </Button>,
          <Button
            key={2}
            size='small'
            type='primary'
            htmlType='submit'
            form='formModal'
            loading={loading}
            icon={<SaveOutlined />}
          >
            {id ? 'Cập nhật' : 'Lưu'}
          </Button>,
        ]}
      >
        <Form
          ref={formLichNghiRef}
          onFinish={handleSaveData}
          id='formModal'
          name='formModal'
          autoComplete='off'
          labelAlign='right'
        >
          <Form.Item
            name='ngay'
            label='Ngày nghỉ'
            labelCol={{ span: 7 }}
            hasFeedback
            rules={[{ required: true, message: 'Ngày nghỉ là bắt buộc' }]}
            validateTrigger={['onBlur', 'onChange']}
          >
            <Select
              placeholder='Danh sách ngày'
              disabled={loading}
              dropdownClassName='small'
              onChange={(value) => {
                let dateMoment = moment(value, 'YYYY-MM-DD').toDate();
                dateMoment = moment(dateMoment).toISOString();
                setNgay(dateMoment);
              }}
            >
              {listDate?.map((data) => (
                <Select.Option key={data} value={moment(data).format('YYYY-MM-DD')}>
                  {moment(data).format('DD-MM-YYYY')}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name='bacsi_id'
            label='Bác sĩ'
            labelCol={{ span: 7 }}
            hasFeedback
            rules={[{ required: true, message: 'Bác sĩ là bắt buộc' }]}
            validateTrigger={['onBlur', 'onChange']}
          >
            <Select
              placeholder='Danh sách bác sĩ'
              disabled={loading}
              dropdownClassName='small'
              onChange={(value) => setBacsiId(value)}
            >
              {nhanviens?.map((data) => (
                <Select.Option key={data._id} value={data._id}>
                  {data.tennv}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {bacsiId && ngay ? (
            lichlamviec.length > 0 ? (
              <Form.Item
                name='thoigiannghi'
                label='Thời gian nghỉ'
                labelCol={{ span: 7 }}
                hasFeedback
                rules={[{ required: true, message: 'Thời gian nghỉ là bắt buộc' }]}
                validateTrigger={['onBlur', 'onChange']}
              >
                <Select
                  mode='multiple'
                  disabled={loading}
                  dropdownClassName='small'
                  onChange={(value) => setThoiGianNghi(value)}
                >
                  {lichlamviec?.map((data) => (
                    <Select.Option key={data} value={data}>
                      {data}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : loading ? (
              <Spin style={{ margin: 'auto' }} size='small' />
            ) : (
              <Row>
                <Col span={7} />
                <Col>Bác sĩ không có lịch làm việc</Col>
              </Row>
            )
          ) : null}
        </Form>
      </Modal>
    </div>
  );
};

export default LichBacSiNghi;
