import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useUserStore } from "../../context/userContext"
import { PATHS } from "../../paths"
import type { Role } from "../../types"

interface RoleProtectedRouteProps {
  children: ReactNode
  allowedRoles: Role[]
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const { user } = useUserStore()

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirigir según el rol
    if (user.role === "paciente") {
      return <Navigate to={PATHS.APPOINTMENTS} replace />
    } else {
      return <Navigate to={PATHS.DASHBOARD} replace />
    }
  }

  return <>{children}</>
}

export default RoleProtectedRoute
