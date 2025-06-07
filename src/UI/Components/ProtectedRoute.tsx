import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { PATHS } from "../../paths"
import useUserDataStore from "@/context/userDataContext"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useUserDataStore(state => state)

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
