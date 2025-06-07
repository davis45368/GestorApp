import useRolesStore from "@/context/rolesContext"
import { useEffect } from "react"

export const useRoles = (userId?: string) => {
    const { getRoles, isError, isLoading, resetStore, roles, userRole } = useRolesStore(state => state)

    useEffect(() => {
        getRoles(userId)
    }, [userId])

    return {
        roles,
        isError,
        isLoading,
        userRole,
        resetStore,
    }
}