import { DashboardOutlined, SendOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React from 'react'
const { Sider } = Layout
const { SubMenu } = Menu

export const Sidebar = (props: { collapsed: boolean }) => {
  return (
    <Sider className="side-bar" trigger={null} collapsible collapsed={props.collapsed}>
      <div className="logo-wrapper">
        <img src="src/assets/images/svg-icons/cms-logo.svg" alt="logo" />
      </div>
      <Menu className="menu-area" defaultSelectedKeys={['1']} mode="inline" theme="light">
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          Dashboard
        </Menu.Item>
        <SubMenu key="sub1" icon={<SendOutlined />} title="Articles">
          <Menu.Item key="5">step 1</Menu.Item>
          <Menu.Item key="6">step 2</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  )
}
