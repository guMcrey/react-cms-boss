import React from 'react'
import { Layout } from 'antd'

const { Content } = Layout

export const Main = () => {
  return (
    <Content className="content-area">
      <div className="wrapper-title">Hello Hakuna,</div>
      <div>This is what we've got for you today.</div>
    </Content>
  )
}
