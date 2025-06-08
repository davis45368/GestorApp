import { Appointment } from "@/domain/Appointment"
import { repository } from "@/repositories/appointments"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"

export const listAppointments = (filter: string) => {
    const queryInfo = useQuery({
        queryKey: ['list', 'appointments', filter],
        enabled: true,
        placeholderData: keepPreviousData,
        queryFn: () => {
            return repository.list(filter)
        }
    })

    return {
        ...queryInfo,
        appointments: queryInfo.data?.data
    }
}
export const listAppointmentsFull = (filter: string) => {
    const queryInfo = useQuery({
        queryKey: ['list', 'appointments-full', filter],
        enabled: true,
        placeholderData: keepPreviousData,
        queryFn: () => {
            return repository.listFull(filter)
        }
    })

    return {
        ...queryInfo,
        appointments: queryInfo.data?.data
    }
}

export const getAppointmentById = (appointmentId?: string) => {
        const queryInfo = useQuery({
        queryKey: ['detail', 'appointments', appointmentId],
        enabled: !!appointmentId,
        placeholderData: keepPreviousData,
        queryFn: () => {
            if (!appointmentId) return

            return repository.getById(appointmentId)
        }
    })

    return {
        ...queryInfo,
        appointment: queryInfo.data?.data
    }
}

export const createAppointment = () => {
    const mutation = useMutation({
        mutationFn: (data: Partial<Appointment>) => {
            return repository.create(data)
        }
    })

    return mutation
}
export const updateAppointment = () => {
    const mutation = useMutation({
        mutationFn: (data: Partial<Appointment>) => {
            return repository.update(data)
        }
    })

    return mutation
}