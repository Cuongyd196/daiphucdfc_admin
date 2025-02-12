import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Col, Form, Spin, Tooltip, Timeline, Button } from 'antd';
import { makeGetLoading } from 'containers/App/AppProvider/selectors';
import { URL } from '@url';
import { getLichHenKham } from '@services/qlbenhnhan/qlbenhnhanService';
import './Lichsukham.scss';
import { RightCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const LichHenKham = ({ mabn }) => {
  const [histories, setHistories] = React.useState([]);
  let loaded = false
  useEffect(() => {
    fetchData();
  }, [mabn]);

  const fetchData = async () => {
    let historyRes = await getLichHenKham(mabn);
    if (historyRes) {
      setHistories(historyRes);
    }
    loaded = true
  };

  return <Timeline mode="left" className="mt-2 timeline-history">
    {histories.length === 0 && loaded && <div className="text-red-500">Không có lịch hẹn khám</div>}
    {histories.map(detail => {
      return <Timeline.Item
        key={detail._id}
        label={<Tooltip title="Xem chi tiết"><Link to={URL.QL_DANGKYKHAM_ID.format(detail?.benhan_id?._id)} className="text-blue-500">
          <RightCircleOutlined /> Ngày hẹn: {moment(detail.ngayhen).format('DD/MM/YYYY')}
        </Link>
        </Tooltip>}>
        <Row>
          <Col xs={24} lg={8}>
            <Form.Item label={<b>Mã đăng ký</b>}><span>{detail?.benhan_id?._id}</span></Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item label={<b>Bác sĩ</b>}><span>{detail?.benhan_id?.bsdt?.tennv}</span></Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item label={<b>Ngày khám</b>}><span>{moment(detail.ngayud).format('DD/MM/YYYY')}</span></Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label={<b>Chẩn đoán</b>}><span>{detail?.benhan_id?.chandoan}</span></Form.Item>
          </Col>
        </Row>
      </Timeline.Item>;
    })}
  </Timeline>;
};

export default LichHenKham;
