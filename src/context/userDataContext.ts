import { User } from "@/domain/User";
import { create } from "@/utils/storeCreate";
import { persist } from "zustand/middleware";

interface State {
    user?: User,
    setUser: (user:User) => void
    resetStore: () => void
}

const initialState: Omit<State, 'resetStore' | 'setUser' > = {
    user: undefined
}

const useUserDataStore = create<State>()(
    persist(
        (set) => ({
            ...initialState,
            setUser(user) {
                set({ user: user })
            },
            resetStore: () => {
                set(initialState)
            }
        }),
        {
            name: 'user-data'
        }
    ),
)

export default useUserDataStore;