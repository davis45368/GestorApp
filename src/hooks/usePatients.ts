import usePatientContext from "@/context/usePatients"
import { useEffect } from "react"

export const usePatients = () => {
    const { isError, isLoading, resetStore, getPatients, patients } = usePatientContext(state => state)

    useEffect(() => { getPatients() }, [])

    return {
        patients,
        isError,
        isLoading,
        resetStore,
    }
}