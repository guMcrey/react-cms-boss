import React, { useState } from 'react'
import styled from 'styled-components'
import { Sidebar } from './components/layout/Sidebar';
import { Nav } from './components/layout/Nav';
import { Main } from './components/layout/Main';

import { Layout } from 'antd'
import { Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  SendOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu;

function App() {
  const [ collapsed, setCollapsed ] = useState(true)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <AppWrapper>
    <Layout className="layout-wrapper">
      <Sider className="side-bar" trigger={null} collapsible collapsed={collapsed}>
        <Sidebar></Sidebar>
        <Menu
          className="menu-area"
          defaultSelectedKeys={['1']}
          mode="inline"
          theme="light"
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
              Dashboard
          </Menu.Item>
          <SubMenu key="sub1" icon={<SendOutlined />} title="Articles">
              <Menu.Item key="5">step 1</Menu.Item>
              <Menu.Item key="6">step 2</Menu.Item>
          </SubMenu>
        </Menu>
    </Sider>
       <Layout className="layout-wrapper-container">
          <Header className="header-area">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggleCollapsed,
            })}
             <Nav></Nav>
           </Header>
           <Content className="content-area">
             <Main></Main>
           </Content>
         </Layout>
       </Layout>
     </AppWrapper>
  )
}

export default App

const AppWrapper = styled.div`
  background-color: #fff;
  .layout-wrapper {
    min-height: 100vh;
  }
  .side-bar {
    background-color: #fff;
    border-radius: 25px 0 0 25px;
    padding: 10px 0;
  }
  .header-area {
    background-color: #fff;
    border-left: 1px solid #F4F4F4;
    border-radius: 0 25px 0 0;
    margin: 10px 10px 0 0;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content-area {
    margin: 0 10px 10px 0;
    background-color: #F4F4F4;
    border-radius: 0 0 25px 0;
    padding: 20px;
  }
  .layout-wrapper-container {
    background-color: #fff;
    border-radius: 0 25px 25px 0;
  }
  .menu-area {
    margin-top: 8px;
  }
`