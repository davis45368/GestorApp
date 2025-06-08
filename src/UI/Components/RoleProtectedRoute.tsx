import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useUserStore } from "../../context/userContext"
import { PATHS } from "../../paths"
import type { Role } from "../../types"
import useUserJWTStore from "@/context/UserDataJWTStore"
import useUserDataStore from "@/context/userDataContext"
import useRolesStore from "@/context/rolesContext"

interface RoleProtectedRouteProps {
	children: ReactNode
	allowedRoles: Role[]
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
	const { userRole } = useRolesStore(state => state)
	const { isExpiredAccessToken, refreshAccessToken, jwt } = useUserJWTStore(state => state)

	if (!userRole || !jwt.refreshToken) {
		return <Navigate to={PATHS.LOGIN} replace />
	}

	if (isExpiredAccessToken()) {
		void refreshAccessToken()
	}

	if (!allowedRoles.includes(userRole.role.name.toLocaleLowerCase() as Role)) {
		// Redirigir según el rol
		if (userRole.role.name.includes("paciente")) {
			return <Navigate to={PATHS.MYINFORMATION} replace />
		} else {
			return <Navigate to={PATHS.DASHBOARD} replace />
		}
	}

	return <>{children}</>
}

export default RoleProtectedRoute
