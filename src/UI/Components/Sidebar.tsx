"use client"

import { Layout, Menu, theme } from "antd"
import {
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  PartitionOutlined,
} from "@ant-design/icons"
import { Link, useLocation } from "react-router-dom"
import { useUserStore } from "../../context/userContext"
import { PATHS } from "../../paths"
import { useMemo } from "react"

const { Sider } = Layout

const Sidebar = () => {
  const { user } = useUserStore()
  const location = useLocation()

  const { token: { colorBgContainer, colorBorder } } = theme.useToken();

  // Determinar qué elementos del menú mostrar según el rol
  const menuItems = useMemo(() => {
    const items = []

    // Dashboard (recepcionistas, especialistas, admin)
    if (user && ["admin", "recepcionista", "especialista"].includes(user.role)) {
      items.push({
        key: PATHS.DASHBOARD,
        icon: <DashboardOutlined />,
        label: <Link to={PATHS.DASHBOARD}>Dashboard</Link>,
      })
    }

    if (user && user.role != 'admin') {
      items.push({
        key: PATHS.APPOINTMENTS,
        icon: <CalendarOutlined />,
        label: <Link to={PATHS.APPOINTMENTS}>Citas</Link>,
      })
    }

    // Usuarios (solo admin)
    if (user && user.role === "admin") {
      items.push({
        key: PATHS.USERS,
        icon: <UserOutlined />,
        label: <Link to={PATHS.USERS}>Usuarios</Link>,
      })
    }

    // Áreas (solo admin)
    if (user && user.role === "admin") {
      items.push({
        key: PATHS.AREAS,
        icon: <PartitionOutlined />,
        label: <Link to={PATHS.AREAS}>Áreas</Link>,
      })
    }

    // Especialistas (solo admin)
    if (user && user.role === "admin") {
      items.push({
        key: PATHS.SPECIALISTS,
        icon: <TeamOutlined />,
        label: <Link to={PATHS.SPECIALISTS}>Especialistas</Link>,
      })
    }

    return items
  }, [user])

  return (
    <Sider
      width={250} 
      className="site-layout-background"
      style={{
        background: colorBgContainer,
        borderRight: '2px solid' + colorBorder,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: "100%", borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  )
}

export default Sidebar
