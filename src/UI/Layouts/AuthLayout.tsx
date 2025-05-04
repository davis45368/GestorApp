import { Layout } from "antd"
import { Outlet, Navigate } from "react-router-dom"
import { useUserStore } from "../../context/userContext"
import { PATHS } from "../../paths"

const { Content } = Layout

const AuthLayout = () => {
  const { user } = useUserStore()

  // Si ya hay un usuario autenticado, redirigir al dashboard o a citas
  if (user) {
    if (user.role === "paciente") {
      return <Navigate to={PATHS.APPOINTMENTS} replace />
    } else {
      return <Navigate to={PATHS.DASHBOARD} replace />
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5" }}>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default AuthLayout
