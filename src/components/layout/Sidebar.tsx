import React from 'react'
import { Link } from 'react-router-dom'
import { DashboardOutlined, SendOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'

const { Sider } = Layout
const { SubMenu } = Menu

export const Sidebar = (props: { collapsed: boolean }) => {
  return (
    <Sider className="side-bar" trigger={null} collapsible collapsed={props.collapsed}>
      <div className="logo-wrapper">
        <img src="src/assets/images/svg-icons/cms-logo.svg" alt="logo" />
      </div>
      <Menu className="menu-area" defaultSelectedKeys={['dashboard']} mode="inline" theme="light">
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <SubMenu key="article" icon={<SendOutlined />} title="Article">
          <Menu.Item key="articles">
            <Link to="/articles">Articles</Link>
          </Menu.Item>
          <Menu.Item key="article-analysis">
            <Link to="/article-analysis">Article Analysis</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  )
}
