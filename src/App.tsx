import React from 'react'
import { MyLayout } from '@/components/layout/Index'
import { ConfigProvider } from 'antd'
import { themeConfig } from '@/assets/styles/themes'

ConfigProvider.config({
  theme: themeConfig,
})

export const App = () => {
  return (
    <ConfigProvider>
      <MyLayout />
    </ConfigProvider>
  )
}
