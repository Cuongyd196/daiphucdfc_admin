import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Spin, Tooltip, Timeline, Button, Divider, Table } from 'antd';
import { URL } from '@url';
import { RightCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import ModalGhiChu from 'Pages/QuanLyBenhNhan/ChiTietSuDungThuoc/ModalGhiChu';

const DonThuocChiTiet = ({ donthuoc, donthuocct, chitietdangky }) => {

  const [showModal, setShowModal] = useState(false)

  if(!donthuoc) return null

  const labelColCol = { xs: 12, lg: 10 };

  return <div className="bg-white p-2 mt-2">
    <Divider orientation="left" plain>
      <Tooltip title="Xem chi tiết"><Link to={URL.QL_DANGKYKHAM_ID.format(donthuoc?._id)} className="text-red-500">
        <RightCircleOutlined /> <b>Mã đơn thuốc: {donthuoc?._id}</b>
      </Link>
      </Tooltip>
    </Divider>

    <Form size="small" autoComplete="off" className="form-info">
      <Row gutter={10}>
        <Col xs={24} lg={8}>
          <Form.Item
            label={<b>Bác sĩ</b>}
            labelCol={labelColCol}>
            <span>{donthuoc?.bacsi?.tennv}</span>
          </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
          <Form.Item
            label={<b>Ngày kê đơn</b>}
            labelCol={labelColCol}>
            <span>{moment(donthuoc?.ngay).format('DD/MM/YYYY')}</span>
          </Form.Item>
        </Col>

        {chitietdangky && chitietdangky[0] ? (
            <Col xs={24}>
              <Form.Item label={<b>Chẩn đoán sơ bộ</b>} labelCol={{ xs: 4 }}>
                <span className='whitespace-pre-wrap'>{chitietdangky[0]?.chandoansobo}</span>
              </Form.Item>
            </Col>
          ) : null}

        {chitietdangky && chitietdangky[0] ? (
            <Col xs={24}>
              <Form.Item
                label={<b>Chẩn đoán</b>}
                labelCol={{xs: 4}}>
                <span className="whitespace-pre-wrap">{chitietdangky[0]?.chandoan}</span>
              </Form.Item>
            </Col>
          ) : null}

        <Col xs={24}>
          <Form.Item
            label={<b>Ghi chú</b>}
            labelCol={{xs: 4}}>
            <span className="whitespace-pre-wrap">{donthuoc?.ghichu}</span>
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Button type="link" onClick={() => setShowModal(!showModal)}>
            Xem tình hình sử dụng thuốc
          </Button>
        </Col>
        <Col xs={24}>
          <Table size="small" rowKey="_id" bordered dataSource={donthuocct} pagination={false}>
            <Table.Column title="Mã BD" dataIndex="dmthuocvattu_id" render={value => value?._id}
                          align="center" />
            <Table.Column title="Tên BD" dataIndex="dmthuocvattu_id" render={value => value?.ten} />
            {/*<Table.Column title="Sáng" dataIndex="sang" />*/}
            {/*<Table.Column title="Trưa" dataIndex="trua" />*/}
            {/*<Table.Column title="Chiều" dataIndex="chieu" />*/}
            {/*<Table.Column title="Tối" dataIndex="toi" />*/}
            <Table.Column title="Số lượng" dataIndex="soluong" />
            <Table.Column title="Ghi chú" dataIndex="ghichu" />

          </Table>
        </Col>
      </Row>
    </Form>
    <ModalGhiChu showModalThuoc={showModal} iddonthuoc={donthuoc._id}/>
  </div>
};

export default DonThuocChiTiet;
