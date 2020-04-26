import React, { useCallback, useEffect, useState } from 'react'
import { Switch, Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { usePlaidLink } from 'react-plaid-link'
import { Button, Layout, Menu } from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import Dashboard from './screens/Dashboard'
import './App.css'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

const App = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    getAllTransactions().then(data => {
      const { accounts, transactions } = data.transactions
      setAccounts(accounts)
      setTransactions(transactions)
    })
  }, [])

  const getAllTransactions = async () => {
    // const accessToken = await getAccessToken(token)
    const accessToken = 'access-sandbox-863f6ead-5aac-45bd-a5be-d609778479e9'
    const res = await fetch('http://localhost:8000/transactions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    })

    if (200 !== res.status) {
      console.error('Error getting transactions')
    }

    return await res.json()
  }

  const getAccessToken = async token => {
    const res = await fetch('http://localhost:8000/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token: token }),
    })

    if (200 !== res.status) {
      console.error('Error getting access token')
    }

    const json = await res.json()
    return json.access_token
  }

  const renderAccounts = () => {
    return (
      <SubMenu
        key="sub1"
        title={
          <span>
            <UserOutlined />
            <span>Accounts</span>
          </span>
        }
      >
        {Array.isArray(accounts) && accounts.length > 0 ? (
          accounts.map(account => <Menu.Item>{account.name}: {currency.format(account.balances.current)}</Menu.Item>)
        ) : null}
      </SubMenu>
    )
  }

  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  const onSuccess = useCallback(async (token, metadata) => {
    const data = await getAllTransactions(token)
    const { accounts, transactions } = data.transactions

    setAccounts(accounts)
    setTransactions(transactions)
  }, [])

  const config = {
    clientName: 'More Money',
    env: 'sandbox',
    product: ['auth', 'transactions'],
    publicKey: 'aa41d2677d293ac2352aee21491d61',
    onSuccess,
  }

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  }

  const { open, ready, error } = usePlaidLink(config)

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <h1 className="logo">More Money</h1>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <PieChartOutlined />
              <span>Dashboard</span>
            </Menu.Item>
            {renderAccounts()}
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
          <Content style={{ margin: '0 16px' }}>
            <Switch>
              <Route exact path="/" component={Dashboard} />
            </Switch>
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
    </Router>
  )
}
export default App
