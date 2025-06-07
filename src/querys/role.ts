import { repository } from "@/repositories/roles"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const listRoles = () => {
    const queryInfo = useQuery({
        queryKey: ['list', 'roles'],
        enabled: true,
        placeholderData: keepPreviousData,
        queryFn: () => {
            return repository.list()
        }
    })

    return {
        ...queryInfo,
        roles: queryInfo.data?.data
    }
}