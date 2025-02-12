import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Spin, Tooltip, Typography, Button, Divider, Table, Modal, Image } from 'antd';
import { URL } from '@url';
import { EyeOutlined, RightCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import ParagraphText from '@components/ParagraphText';
import { getKetQuaCLSById } from '@services/qlbenhnhan/qlbenhnhanService';


const DonThuocChiTiet = ({ khambenh }) => {

  const [showModal, setShowModal] = useState(false)
  const [hinhanh, setHinhAnh] = useState([])


  const xemloaiketqua = (value, row) => {
    if (value && value > 0) {
      return <Tooltip title="Xem kết quả hình ảnh" color="#2db7f5">
        <Button icon={<EyeOutlined />} size='small' type="primary" onClick={async () => {
          let ketquacls = await getKetQuaCLSById(row._id)
          let arr = [ketquacls?.pic1, ketquacls?.pic2];
          arr = arr.filter(item => item);
          setShowModal(!showModal);
          setHinhAnh(arr);
        }} />
      </Tooltip>
    }
    return ""
  }


  if(!khambenh) return null

  return <div className="bg-white p-2 mt-2">
    <Divider orientation="left" plain>
      <Tooltip title="Xem chi tiết"><Link to={URL.QL_DANGKYKHAM_ID.format(khambenh?.benhan_id)} className="text-blue-500 text-base">
        <RightCircleOutlined /> Mã đăng ký: {khambenh?.benhan_id}
      </Link>
      </Tooltip>
    </Divider>

    <Form size="small" autoComplete="off" className="form-info">
      <Row gutter={10}>
        {khambenh?.dichvu ?
          <Col xs={24}>
            <Table size="small" rowKey="_id" bordered dataSource={khambenh?.dichvu} pagination={false}>
              <Table.Column title="STT" dataIndex="_id" width="100px" align="center" render={(value, row, index) => index + 1} />
              <Table.Column title="Ngày" dataIndex="date" width="110px" render={value => moment(value).format('DD/MM/YYYY')} />
              <Table.Column title="Dịch vụ" dataIndex={['dmgiadichvu_id', 'ten']} />
              <Table.Column title="Bác sĩ" dataIndex={['bscdha', 'tennv']} width="71px" align="center"/>
              <Table.Column title="Mô tả" dataIndex="mota" render={value => <ParagraphText content={value}/>}/>
              <Table.Column dataIndex="soluongpic" width="20px" render={(value, row) => xemloaiketqua(value, row)} />
            </Table>
          </Col> : ""
        }
      </Row>
    </Form>

    <Modal
      title="Kết quả chẩn đoán hình ảnh"
      visible={showModal}
      onCancel={() => setShowModal(!showModal)}
      footer={null}
      style={{ top: '10px' }}
      width={800}
      bodyStyle={{display: 'flex', justifyContent: 'space-around'}}
    >
      {
        hinhanh.length === 0 && <div className="text-red-500">Hình ảnh hiển thị trống</div>
      }
      <Image.PreviewGroup>
        {
          hinhanh.map((data, idx) => {
            return <Image width={300} src={`data:image/jpeg;base64,${data}`} key={idx}/>
          })
        }
      </Image.PreviewGroup>
    </Modal>

  </div>
};

export default DonThuocChiTiet;
