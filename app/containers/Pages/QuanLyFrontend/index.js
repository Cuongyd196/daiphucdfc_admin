import { Layout, Menu, Tabs } from 'antd';
import React from 'react';
import QuanLyLienHe from 'Pages/QuanLyFrontend/QuanLyLienHe/quanlylienhe';
import CaiDatWebsite from 'Pages/QuanLyFrontend/CaiDatWebsite';

export default function QuanLyFrontend() {
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
      <Tabs.TabPane key="website" tab="Cài đặt website" className="p-4">
        <CaiDatWebsite/>
      </Tabs.TabPane>
      <Tabs.TabPane key="lienhe" tab="Quản lý đăng ký học" className="p-4">
        <QuanLyLienHe/>
      </Tabs.TabPane>

    </Tabs>
  </Layout>
  )
}
