import { Brand } from "@/domain/Brand";
import { repository } from "@/repositories/brand";
import { create } from "@/utils/storeCreate";

interface State {
    brands: Brand[],
    isLoading: boolean,
    isError: boolean,
    getBrands: () => void
    resetStore: () => void
}

const initialState: Pick<State, 'isError' | 'isLoading' | 'brands'> = {
    isError: false,
    isLoading: false,
    brands: [],
}

const useBrandContext = create<State>()(
    (set, get) => ({
        ...initialState,
        getBrands: async () => {
            if (get().isLoading) return;

            set({ isLoading: true })

            const response = await repository.list('')
            
            if (response.status != 200) {
                set({ isLoading: false, isError: true })
            }

            set({ isLoading: false, brands: response.data,  })
        },
        resetStore: () => {
            set(initialState)
        }
    })
)

export default useBrandContext