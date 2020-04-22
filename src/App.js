import React, { useState, useCallback } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { Layout, Menu, Button } from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import './App.css'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

const App = () => {
  const [collapsed, setCollapsed] = useState(false)

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  }

  const onSuccess = useCallback(async (token, metadata) => {
    const tokenData = await fetch('http://localhost:8000/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token: token }),
    })

    const tokenJSON = await tokenData.json()
    const accessToken = tokenJSON.access_token

    const transactionData = await fetch('http://localhost:8000/transactions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    })

    const transactionJSON = await transactionData.json()
    console.log(`Transactions: ${JSON.stringify(transactionJSON)}`)
  }, [])

  const config = {
    clientName: 'More Money',
    env: 'sandbox',
    product: ['auth', 'transactions'],
    publicKey: 'aa41d2677d293ac2352aee21491d61',
    onSuccess,
    // ...
  }

  const { open, ready, error } = usePlaidLink(config)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            <PieChartOutlined />
            <span>Home</span>
          </Menu.Item>
          <Menu.Item key="2">
            <DesktopOutlined />
            <span>Budget</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <UserOutlined />
                <span>Transactions</span>
              </span>
            }
          >
            <Menu.Item key="3">View Transactions</Menu.Item>
            <Menu.Item key="4">Add Transaction</Menu.Item>
            <Menu.Item key="5">Delete Transaction</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <TeamOutlined />
                <span>Budget</span>
              </span>
            }
          >
            <Menu.Item key="6">To Be Budgeted</Menu.Item>
            <Menu.Item key="8">Expenses</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Button type="primary" onClick={() => open()} disabled={!ready}>
              Connect a bank account
            </Button>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          More Money ©2020 Created by Stephen Sun
        </Footer>
      </Layout>
    </Layout>
  )
}
export default App
