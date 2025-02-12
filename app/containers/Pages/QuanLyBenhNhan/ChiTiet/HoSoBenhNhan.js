import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import Lichsukham from './HoSoBenhNhan/Lichsukham';
import DonThuoc from './HoSoBenhNhan/DonThuoc';
import LichHenKham from './HoSoBenhNhan/HenKham';
import CanLamSang from './HoSoBenhNhan/CanLamSang';

const HoSoBenhNhan = ({mabn}) => {
  return <Tabs tabPosition="left" defaultActiveKey="4" type="card" size="small">
    <TabPane tab="Lịch sử khám" key="41">
      <Lichsukham mabn={mabn}/>
    </TabPane>
    <TabPane tab="Đơn thuốc" key="42">
      <DonThuoc mabn={mabn}/>
    </TabPane>
    <TabPane tab="Lịch hẹn" key="43">
      <LichHenKham mabn={mabn}/>
    </TabPane>
    <TabPane tab="Kết quả cận lâm sàng" key="34">
      <CanLamSang mabn={mabn}/>
    </TabPane>
  </Tabs>
};

export default HoSoBenhNhan;
