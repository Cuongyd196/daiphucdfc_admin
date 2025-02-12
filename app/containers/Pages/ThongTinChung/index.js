import React from 'react';
import { Menu, Tabs, Layout } from 'antd';

import Basic from './Basic';
import ThongTinUngDung from './thongtinungdung';
import QuanlyThoiGian from './quanlythoigian';
import './thongtinchung.scss';
import ThongBaoApp from './thongbaoapp';
import BangGiaDichVu from './BangGiaDichVu';

export default function Profile(props) {

  return (
    <Layout>
      <Tabs
        tabPosition="left"
        className="bg-white"
        renderTabBar={({ panes, activeKey, onTabClick }) => (
          <Menu
            mode="inline"
            style={{ width: 250 }}
            onSelect={({ key, domEvent }) => onTabClick(key, domEvent)}
            defaultSelectedKeys={[activeKey]}
          >
            {panes.map(({ key, props: { tab } }) => (
              <Menu.Item key={key}>{tab}</Menu.Item>
            ))}
          </Menu>
        )}
      >
        <Tabs.TabPane key="basic" tab="Cài đặt ứng dụng" className="p-4">
          <Basic/>
        </Tabs.TabPane>
        <Tabs.TabPane key="security" tab="Thông tin giới thiệu" className="p-4">
          <ThongTinUngDung/>
        </Tabs.TabPane>
        {/* <Tabs.TabPane key="timeword" tab="Thời gian làm việc" className="p-4">
          <QuanlyThoiGian/>
        </Tabs.TabPane>

        <Tabs.TabPane key="thongbaoapp" tab="Thông báo App" className="p-4">
          <ThongBaoApp />
        </Tabs.TabPane>
        <Tabs.TabPane key="banggiadichvu" tab="Bảng giá dịch vụ" className="p-4">
          <BangGiaDichVu location={props.location} history={props.history} />
        </Tabs.TabPane> */}
      </Tabs>
    </Layout>
  );
}
