import useBrandContext from "@/context/useBrand"
import { useEffect } from "react"

export const useBrands = () => {
    const { isError, isLoading, resetStore, getBrands, brands } = useBrandContext(state => state)

    useEffect(() => { getBrands() }, [])

    return {
        brands,
        isError,
        isLoading,
        resetStore,
    }
}