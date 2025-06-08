import { MedicalRecord } from "@/domain/MedicalRecord"
import { repository } from "@/repositories/medicalRecord"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"

export const listMedicalRecords = (filter: string) => {
    const queryInfo = useQuery({
        queryKey: ['list', 'medicalrecords', filter],
        enabled: true,
        placeholderData: keepPreviousData,
        queryFn: () => {
            return repository.list(filter)
        }
    })

    return {
        ...queryInfo,
        medicalrecords: queryInfo.data?.data
    }
}

export const createMedicalRecord = () => {
    const mutation = useMutation({
        mutationFn: (data: Partial<MedicalRecord>) => {
            return repository.create(data)
        }
    })

    return mutation
}
