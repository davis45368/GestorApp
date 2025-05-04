import { Card, Layout } from "antd"
import { Outlet } from "react-router-dom"
import Sidebar from "../Components/Sidebar"
import AppHeader from "../Components/Header"

const { Content } = Layout

const CustomLayout = () => {

  return (
    <Layout style={{ height: "100vh", overflowY: 'hidden' }}>
        <AppHeader />
        <Layout>
            <Sidebar />
            <Layout className="custom-scrollbar">
                <Content className="site-layout-background" style={{ padding: 20 }}>
                    <Card>
                        <Outlet />
                    </Card>
                </Content>
            </Layout>
        </Layout>
    </Layout>
  )
}

export default CustomLayout