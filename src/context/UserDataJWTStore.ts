import { LoginJwt } from '@/domain/Login';
import { repository } from '@/repositories/auth';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { create } from "@/utils/storeCreate";
import { persist } from 'zustand/middleware';

interface JwTPayLoad {
	id: string,
	role: string,
	app_access: boolean,
	admin_access: boolean,
	iat: number,
  	exp: number,
}

interface State {
	jwt: LoginJwt,
	userId: string,
	expiredDate?: dayjs.Dayjs,
	setJwt: (jwt: LoginJwt) => void,
	isExpiredAccessToken: () => boolean,
	refreshAccessToken: () => void,
	resetStore: () => void
}

const initialState: Pick<State, 'jwt' | 'expiredDate' | 'userId' > = {
	jwt: {
		accessToken: '',
		refreshToken: '',
		expires: 0,
	},
	expiredDate: undefined,
	userId: '',
};

const useUserJWTStore = create<State>()(persist(
	(set, get) => ({
		...initialState,
		setJwt(jwt) {
			try {
				const tokenData = jwtDecode<JwTPayLoad>(jwt.accessToken);
				const userId = tokenData?.id ?? '';
				const expiredDate = tokenData?.exp ? dayjs.unix(tokenData.exp) : undefined;

				set({ jwt, userId, expiredDate });
			} catch(error) {
				console.error(error)
			}
		},
		isExpiredAccessToken: () => {
			if (!get().expiredDate) return true;

			const expiredDate = dayjs(get().expiredDate);
            
			return expiredDate.isBefore(dayjs());
		},
		refreshAccessToken: async () => {
			const response = await repository.refreshToken(get().jwt.refreshToken)

			if (response.status != 200) {
				set({ ...initialState }) 
				return
			}

			void get().setJwt(response.data)
		},
		resetStore() {
			set({ ...initialState });
		},
	}), {
		name: 'user-jwt',
	},
));
export default useUserJWTStore;
