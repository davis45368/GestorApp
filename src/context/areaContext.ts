import { Area } from "@/domain/Area";
import { repository } from "@/repositories/area";
import { create } from "@/utils/storeCreate";

interface State {
	areas: Area[],
	isLoading: boolean,
	isError: boolean,
	getAreas: () => void
	resetStore: () => void
}

const initialState: Pick<State, 'isError' | 'isLoading' | 'areas'> = {
	isError: false,
	isLoading: false,
	areas: [],
}

const useAreaContext = create<State>()(
	(set, get) => ({
		...initialState,
		getAreas: async () => {
			if (get().isLoading) return;

			set({ isLoading: true })

			const response = await repository.list('')
			
			if (response.status != 200) {
				set({ isLoading: false, isError: true })
			}

			set({ isLoading: false, areas: response.data,  })
		},
		resetStore: () => {
			set(initialState)
		}
	})
)

export default useAreaContext