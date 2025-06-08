import useSpecialistStore from "@/context/specialistContext"
import { useEffect } from "react"

export const useSpecialists = (brandId?: string) => {
	const { isError, isLoading, resetStore, getSpecialists, specialist } = useSpecialistStore(state => state)

	useEffect(() => { getSpecialists(brandId) }, [])

	return {
		specialist,
		isError,
		isLoading,
		resetStore,
	}
}