import React from 'react'
import { Menu, Dropdown, Layout } from 'antd'
import {
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'

const { Header } = Layout
const menu = (
  <div>
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <a href="#">Profile</a>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <a href="#">Settings</a>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <a href="#">Logout</a>
      </Menu.Item>
    </Menu>
  </div>
)

export const Nav = (props: { collapsed: boolean; toggleCollapsed: () => void }) => {
  return (
    <Header className="header-area">
      {props.collapsed && <MenuUnfoldOutlined onClick={props.toggleCollapsed} />}
      {!props.collapsed && <MenuFoldOutlined onClick={props.toggleCollapsed} />}
      <Dropdown overlay={menu} placement="bottom" arrow>
        <div className="user-info">
          <div className="user-avatar"></div>
          <div className="user-name">
            Hakuna <DownOutlined />
          </div>
        </div>
      </Dropdown>
    </Header>
  )
}
