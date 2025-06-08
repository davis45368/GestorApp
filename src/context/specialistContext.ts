import { Specialist } from "@/domain/Specialist";
import { repository } from "@/repositories/specialist";
import { create } from "@/utils/storeCreate";

interface State {
	specialist: Specialist[],
	isLoading: boolean,
	isError: boolean,
	getSpecialists: (brandId?: string) => void,
	resetStore: () => void
}

const initialState: Pick<State, 'isError' | 'isLoading' | 'specialist'> = {
	isError: false,
	isLoading: false,
	specialist: [],
}

const useSpecialistStore = create<State>()(
	(set, get) => ({
		...initialState,
		getSpecialists: async (brandId?: string) => {

			if (get().isLoading) return;

			set({ isLoading: true })
			const response = await repository.list(`filter[_and][0][active][_eq]=true${brandId ? '&filter[_and][1][brand_id][_eq]='+brandId : ''}`)
	
			if (response.status != 200) {
				set({ isLoading: false, isError: true })
			}
	
			set({ isLoading: false, specialist: response.data })
		},
		resetStore: () => {
			set(initialState)
		}
	})
)

export default useSpecialistStore;