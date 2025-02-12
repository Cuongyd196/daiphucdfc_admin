import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Col, Form, Spin, Tooltip, Timeline, Button } from 'antd';
import { makeGetLoading } from 'containers/App/AppProvider/selectors';
import { URL } from '@url';
import { getLinkSuKham } from '@services/qlbenhnhan/qlbenhnhanService';
import './Lichsukham.scss';
import { RightCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const Lichsukham = ({ mabn }) => {
  const [histories, setHistories] = React.useState([]);
  let loaded = false
  useEffect(() => {
    fetchData();
  }, [mabn]);

  const fetchData = async () => {
    let historyRes = await getLinkSuKham(mabn);
    if (historyRes) {
      setHistories(historyRes);
    }
    loaded = true
  };

  return <Timeline mode="left" style={{paddingTop: '10px'}} className="mt-2 timeline-history">
    {histories.length === 0 && loaded && <div className="text-red-500">Không có lịch sử khám</div>}
    {histories.map(detail => {
      return <Timeline.Item
        key={detail._id}
        label={<Tooltip title="Xem chi tiết"><Link to={URL.QL_DANGKYKHAM_ID.format(detail._id)} className="text-blue-500">
          <RightCircleOutlined /> {moment(detail.ngaydk).format('DD/MM/YYYY')}
        </Link>
        </Tooltip>}>
        <Row>
          <Col xs={24} lg={12}>
            <Form.Item label={<b>Mã đăng ký</b>}><span>{detail._id}</span></Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item label={<b>Phòng khám</b>}><span>{detail.dmphong_id?.fullname}</span></Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item label={<b>Số thứ tự đăng ký</b>}><span>{detail.number}</span></Form.Item>
          </Col>
          {/*<Col xs={24} lg={12}>*/}
          {/*  <Form.Item label={<b>Bác sĩ</b>}><span>{detail.benhan_id?.bsdt?.tennv}</span></Form.Item>*/}
          {/*</Col>*/}
          {/*<Col xs={24} lg={12}>*/}
          {/*  <Form.Item label={<b>Chẩn đoán</b>}><span>{detail.benhan_id?.chandoan}</span></Form.Item>*/}
          {/*</Col>*/}
        </Row>
      </Timeline.Item>;
    })}
  </Timeline>;
};

export default Lichsukham;
