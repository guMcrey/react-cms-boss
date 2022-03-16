import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'

const { Content } = Layout

export const Main = () => {
  return (
    <>
      <Content className="content-area">
        <Outlet />
      </Content>
    </>
  )
}
