import { useState } from 'react'
import './App.css'
import { Layout } from 'antd'
import 'antd/dist/antd.css';

const { Header, Footer, Sider, Content } = Layout

function App() {
  const [count, setCount] = useState(0)

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider>Sider</Sider>
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  )
}

export default App
