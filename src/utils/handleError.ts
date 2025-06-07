import { AxiosError } from 'axios';

export const handleErrorMutation = (error: unknown, message: string = '') => {
    if (!error) return message;

    const axiosError = error as AxiosError;

    if (axiosError?.response?.status == 405) return 'Problemas internos del servidor';
    
    const getMessageError = () => {
        if (!axiosError?.response?.data) return message;

        const dataError = axiosError?.response?.data;
    
        if (dataError && typeof dataError === 'object') {
            if ('message' in dataError) return dataError.message as string;
        }
    
        return typeof dataError === 'string' ? dataError : message;
    };

    return getMessageError();
};