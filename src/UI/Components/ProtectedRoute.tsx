import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useUserStore } from "../../context/userContext"
import { PATHS } from "../../paths"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useUserStore()

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
