import { User } from "@/domain/User"
import { repository } from "@/repositories/user"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"

export const listUsers = (filter: string) => {
    const queryInfo = useQuery({
        queryKey: ['list', 'users', filter],
        enabled: true,
        placeholderData: keepPreviousData,
        queryFn: () => {
            return repository.list(filter)
        }
    })

    return {
        ...queryInfo,
        users: queryInfo.data?.data
    }
}

export const getUserById = (userId?: string) => {
        const queryInfo = useQuery({
        queryKey: ['list', 'users', userId],
        enabled: !!userId,
        placeholderData: keepPreviousData,
        queryFn: () => {
            if (!userId) return

            return repository.getById(userId)
        }
    })

    return {
        ...queryInfo,
        user: queryInfo.data?.data
    }
}

export const registerUser = () => {
    const mutation = useMutation({
        mutationFn: (data: Pick<User, "email" | "password" | "firstName" | "lastName">) => {
            return repository.register(data)
        }
    })

    return mutation
}
export const createUser = () => {
    const mutation = useMutation({
        mutationFn: (data: Partial<User>) => {
            return repository.create(data)
        }
    })

    return mutation
}
export const updateUser = () => {
    const mutation = useMutation({
        mutationFn: (data: Partial<User>) => {
            return repository.update(data)
        }
    })

    return mutation
}

export const deleteUser = () => {
    const mutation = useMutation({
        mutationFn: (userId: string) => {
            return repository.delete(userId)
        }
    })

    return mutation
}