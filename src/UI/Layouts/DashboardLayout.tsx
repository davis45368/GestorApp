"use client"

import { useEffect } from "react"
import { Layout } from "antd"
import { Outlet, useNavigate } from "react-router-dom"
import { useUserStore } from "../../context/userContext"
import { PATHS } from "../../paths"
import Header from "../Components/Header"
import Sidebar from "../Components/Sidebar"

const { Content } = Layout

const DashboardLayout = () => {
  const { user } = useUserStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirigir según el rol
    if (user) {
      if (user.role === "paciente") {
        navigate(PATHS.APPOINTMENTS)
      }
    }
  }, [user, navigate])

  return (
    <Layout style={{ maxHeight: "100vh", overflowY: 'hidden' }}>
      <Header />
      <Layout>
        <Sidebar />
        <Layout className="custom-scrollbar">
          <Content className="site-layout-background" style={{ padding: 24 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout
