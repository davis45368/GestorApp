import axios from 'axios';
import { LoginData, LoginJwtDTO, LoginJwtModel } from '@/domain/Login';

export class ImplementationLoginJwtRepository {
    protected readonly baseUrl: string = '/auth/';

    async login(dataLogin: LoginData) {
        const response = await axios.post<{ data: LoginJwtDTO}>(this.baseUrl+'login', dataLogin);

        return {
            ...response,
            data: LoginJwtModel.ToDomain(response?.data?.data),
        };
    }

    async refreshToken(refreshToken: string) {
        const response = await axios.post<LoginJwtDTO>(this.baseUrl+'refresh', { refresh_token: refreshToken });

        return {
            ...response,
            data: LoginJwtModel.ToDomain(response?.data),
        };
    }
}

export const repository = new ImplementationLoginJwtRepository();