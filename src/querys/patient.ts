
import { Patient } from "@/domain/Patient"
import { repository } from "@/repositories/patient"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"

export const listPatients = (filter: string) => {
    const queryInfo = useQuery({
        queryKey: ['list', 'patients', filter],
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

export const getPatientById = (patientId?: string | null) => {
        const queryInfo = useQuery({
        queryKey: ['detail', 'patients', patientId],
        enabled: !!patientId,
        placeholderData: keepPreviousData,
        queryFn: () => {
            if (!patientId) return

            return repository.getById(patientId)
        }
    })

    return {
        ...queryInfo,
        patient: queryInfo.data?.data
    }
}

export const createPatient = () => {
    const mutation = useMutation({
        mutationFn: (data: Partial<Patient>) => {
            return repository.create(data)
        }
    })

    return mutation
}
export const updatePatient = () => {
    const mutation = useMutation({
        mutationFn: (data: Partial<Patient>) => {
            return repository.update(data)
        }
    })

    return mutation
}