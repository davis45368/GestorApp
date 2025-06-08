import { Patient } from "@/domain/Patient";
import { repository } from "@/repositories/patient";
import { create } from "@/utils/storeCreate";

interface State {
    patients: Patient[],
    isLoading: boolean,
    isError: boolean,
    getPatients: () => void
    resetStore: () => void
}

const initialState: Pick<State, 'isError' | 'isLoading' | 'patients'> = {
    isError: false,
    isLoading: false,
    patients: [],
}

const usePatientContext = create<State>()(
    (set, get) => ({
        ...initialState,
        getPatients: async () => {
            if (get().isLoading) return;

            set({ isLoading: true })

            const response = await repository.list('')
            
            if (response.status != 200) {
                set({ isLoading: false, isError: true })
            }

            set({ isLoading: false, patients: response.data,  })
        },
        resetStore: () => {
            set(initialState)
        }
    })
)

export default usePatientContext