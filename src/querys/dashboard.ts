import { repository } from "@/repositories/dashboard"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const appointmentsByState = (user_id: string, rol:string ) => {

    const queryInfo = useQuery({
        queryKey: ['citas', 'dashboard',user_id],
        enabled: true,
        placeholderData: keepPreviousData,
        queryFn: () => {
            return repository.appointmentsByState(user_id, rol);
        }
    })

    return {
        ...queryInfo,
        users: queryInfo.data?.data
    }
}

export const appointmentsByArea = () => {

    const queryInfo = useQuery({
        queryKey: ['citas', 'dashboard', 'areas',],
        enabled: true,
        placeholderData: keepPreviousData,
        queryFn: () => {
            return repository.appointmentsByArea();
        }
    })

    return {
        ...queryInfo,
        users: queryInfo.data?.data
    }
}

export const appointmentsBySpecialist = () => {

    const queryInfo = useQuery({
        queryKey: ['citas', 'dashboard', 'specialists',],
        enabled: true,
        placeholderData: keepPreviousData,
        queryFn: () => {
            return repository.appointmentsBySpecialist();
        }
    })

    return {
        ...queryInfo,
        users: queryInfo.data?.data
    }
}