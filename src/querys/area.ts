import { Area } from "@/domain/Area"
import { repository } from "@/repositories/area"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"

export interface UpdateArea extends Partial<Area> {
    specialListIdsUpdate?: {
        create: [],
        update: {area_id: string, id: string}[],
        delete: string[]
    }
}
export const listAreas = (filter: string) => {
    const queryInfo = useQuery({
        queryKey: ['list', 'areas', filter],
        enabled: true,
        placeholderData: keepPreviousData,
        queryFn: () => {
            return repository.list(filter)
        }
    })

    return {
        ...queryInfo,
        areas: queryInfo.data?.data
    }
}

export const getAreaById = (areaId?: string) => {
        const queryInfo = useQuery({
        queryKey: ['detail', 'areas', areaId],
        enabled: !!areaId,
        placeholderData: keepPreviousData,
        queryFn: () => {
            if (!areaId) return

            return repository.getById(areaId)
        }
    })

    return {
        ...queryInfo,
        area: queryInfo.data?.data
    }
}

export const createArea = () => {
    const mutation = useMutation({
        mutationFn: (data: Partial<Area>) => {
            return repository.create(data)
        }
    })

    return mutation
}
export const updateArea = () => {
    const mutation = useMutation({
        mutationFn: (data: UpdateArea) => {
            return repository.update(data)
        }
    })

    return mutation
}

export const deleteArea = () => {
    const mutation = useMutation({
        mutationFn: (areaId: string) => {
            return repository.delete(areaId)
        }
    })

    return mutation
}