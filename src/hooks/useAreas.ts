import useAreaStore from "@/context/areaContext"
import { useEffect } from "react"

export const useAreas = () => {
    const { isError, isLoading, resetStore, getAreas, areas } = useAreaStore(state => state)

    useEffect(() => { getAreas() }, [])

    return {
        areas,
        isError,
        isLoading,
        resetStore,
    }
}