import usePatientContext from "@/context/usePatients"
import { useEffect } from "react"

export const usePpatients = () => {
    const { isError, isLoading, resetStore, getPatients, patients } = usePatientContext(state => state)

    useEffect(() => { getPatients() }, [])

    return {
        patients,
        isError,
        isLoading,
        resetStore,
    }
}