import axios from 'axios';
import { ChangePasswordRecovery, LoginData, LoginJwtDTO, LoginJwtModel, VerifyEmailChangePassword, VerifyEmailUserData } from '@/domain/Login';

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

    async verifyEmailUser(data: VerifyEmailUserData) {
    try {
        const response = await axios.get('/users/register/verify-email?token=' + data.token, {
            maxRedirects: 5, // Permitir que siga las redirecciones automáticamente
            validateStatus: (status) => status >= 200 && status < 400, // Acepta 2xx y 3xx como válidos
        });
        
        return {
            ok: true,
            message: 'Email verificado exitosamente',
            status: response.status
        };
        
    } catch (error: any) {
        // Si hay error, la verificación falló
        if (error.response) {
            // Error del servidor (4xx, 5xx)
            return {
                ok: false,
                message: 'Token inválido o expirado',
                status: error.response.status,
                error: error.response.data
            };
        } else {
            // Error de red o conexión
            return {
                ok: false,
                message: 'Error de conexión',
                error: error.message
            };
        }
    }
}

    async verifyEmailChangePassword(data: VerifyEmailChangePassword) {
        const response = await axios.post(this.baseUrl+'password/request' , data);
        return {
            ...response,
        };
    }

    async changePasswordReset(data: ChangePasswordRecovery) {
        const response = await axios.post(this.baseUrl+'password/reset' , data);
        return {
            ...response,
        };
    }
}

export const repository = new ImplementationLoginJwtRepository();