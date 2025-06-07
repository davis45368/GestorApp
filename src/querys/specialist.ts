import { Specialist } from "@/domain/Specialist"
import { repository } from "@/repositories/specialist"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"

export const listSpecialists = (filter: string) => {
    const queryInfo = useQuery({
        queryKey: ['list', 'specialists', filter],
        enabled: !!filter,
        placeholderData: keepPreviousData,
        queryFn: () => {
            return repository.list(filter)
        }
    })

    return {
        ...queryInfo,
        specialists: queryInfo.data?.data
    }
}

export const getSpecialistById = (specialistId?: string) => {
        const queryInfo = useQuery({
        queryKey: ['list', 'specialists', specialistId],
        enabled: !!specialistId,
        placeholderData: keepPreviousData,
        queryFn: () => {
            if (!specialistId) return

            return repository.getById(specialistId)
        }
    })

    return {
        ...queryInfo,
        specialist: queryInfo.data?.data
    }
}

export const createSpecialist = () => {
    const mutation = useMutation({
        mutationFn: (data: Partial<Specialist>) => {
            return repository.create(data)
        }
    })

    return mutation
}
export const updateSpecialist = () => {
    const mutation = useMutation({
        mutationFn: (data: Partial<Specialist>) => {
            return repository.update(data)
        }
    })

    return mutation
}

export const deleteSpecialist = () => {
    const mutation = useMutation({
        mutationFn: (specialistId: string) => {
            return repository.delete(specialistId)
        }
    })

    return mutation
}