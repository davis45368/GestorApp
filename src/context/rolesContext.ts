import { RoleModel } from "@/domain/Role";
import { repository } from "@/repositories/roles";
import { create } from "@/utils/storeCreate";
import { persist } from "zustand/middleware";

interface State {
    roles: RoleModel[],
    userRole?: RoleModel,
    isLoading: boolean,
    isError: boolean,
    getRoles: (userId?: string) => void
    resetStore: () => void
}

const initialState: Pick<State, 'roles' | 'userRole' | 'isLoading' > = {
    isLoading: false,
    roles: [],
    userRole: undefined
};

const avaliableRoles = ['admin', 'recepcionista', 'especialista']

const useRolesStore = create<State>()(
    persist(
        (set, get) => ({
            ...initialState,
            isError: false,
            getRoles: async (userId?: string) => {
                if (get().isLoading) return;
                set({ isLoading: true })
                const response = await repository.list()
        
                if (response.status != 200) {
                    set({ isLoading: false, isError: true })
                }
        
                set({ isLoading: false, roles: response.data?.filter(item => avaliableRoles.includes(item.role.name.toLowerCase())), userRole: response.data.find(item => item.role.users.includes(userId ?? '')) })
            },
            resetStore: () => {
                set(initialState)
            }
        }),
        {
            name: 'roles'
        }
    ),
)

export default useRolesStore;