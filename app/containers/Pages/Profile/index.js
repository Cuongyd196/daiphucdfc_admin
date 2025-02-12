import React from "react";
import { Menu, Tabs, Layout } from "antd";

import saga from "@containers/Layout/HeaderComponent/HeaderProvider/saga";
import reducer from "@containers/Layout/HeaderComponent/HeaderProvider/reducer";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import Basic from "./Basic";
import Security from "./Security";

export default function Profile() {
  useInjectReducer({ key: "HeaderComponent", reducer });
  useInjectSaga({ key: "HeaderComponent", saga });

  
  return (
    <Layout className="py-2 bg-white">
      <Tabs
        tabPosition="left"
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
        <Tabs.TabPane key="basic" tab="Cài đặt cơ bản" className="pr-4">
          <Basic />
        </Tabs.TabPane>
        <Tabs.TabPane key="security" tab="Cài đặt bảo mật" className="pr-4">
          <Security />
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
}
