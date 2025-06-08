import { AxiosError } from 'axios';

export const handleErrorMutation = (error: unknown, message: string = '') => {
    if (!error) return message;

    const axiosError = error as AxiosError;

    if (axiosError?.response?.status == 405) return 'Problemas internos del servidor';
    
    const getMessageError = () => {
        if (!axiosError?.response?.data) return message;

        const errorData = axiosError.response.data as { errors: { message: string, extensions: { code: string } }[] }
    
        if (errorData.errors?.[0]?.extensions?.code == "INVALID_CREDENTIALS") {
            return 'Usuario o contraseña incorrectos'
        }

        if (errorData && typeof errorData === 'object') {
            if ('message' in errorData) return errorData.message as string;
        }
    
        return typeof errorData === 'string' ? errorData : message;
    };

    return getMessageError();
};