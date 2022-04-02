import React, { useState } from 'react'
import styled from 'styled-components'
import { Sidebar } from '@/components/layout/Sidebar'
import { Nav } from '@/components/layout/Nav'
import { Main } from '@/components/layout/Main'
import { Layout } from 'antd'

export const MyLayout = () => {
  const [collapsed, setCollapsed] = useState(true)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <LayoutWrapper>
      <Layout className="layout-wrapper">
        <Sidebar collapsed={collapsed}></Sidebar>
        <Layout className="layout-wrapper-container">
          <Nav collapsed={collapsed} toggleCollapsed={toggleCollapsed}></Nav>
          <Main></Main>
        </Layout>
      </Layout>
    </LayoutWrapper>
  )
}

const LayoutWrapper = styled.div`
  background-color: #fff;
  .layout-wrapper {
    min-height: 100vh;
  }
  /* sidebar */
  .side-bar {
    background-color: #fff;
    border-radius: 25px 0 0 25px;
    padding: 10px 0;
  }
  .menu-area {
    margin-top: 8px;
  }
  .logo-wrapper {
    margin: 5px auto;
    width: 47px;
    height: 47px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  /* nav */
  .header-area {
    background-color: #fff;
    border-left: 1px solid #f4f4f4;
    border-radius: 0 25px 0 0;
    margin: 10px 10px 0 0;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .user-info {
    display: flex;
    align-items: center;
  }
  .user-avatar {
    width: 42px;
    height: 42px;
    border-radius: 100%;
    background-color: #f1f1f1;
  }
  .user-name {
    font-size: 14px;
    font-weight: 500;
    margin-left: 10px;
  }
  /* content */
  .content-area {
    margin: 0 10px 10px 0;
    background-color: #f4f4f4;
    border-radius: 0 0 25px 0;
    padding: 10px;
  }
  .layout-wrapper-container {
    background-color: #fff;
    border-radius: 0 25px 25px 0;
  }
  .wrapper-title {
    font-size: 22px;
    font-weight: bold;
  }
`
