import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { App, Spin } from 'antd';
import useUserJWTStore from './context/UserDataJWTStore';
import useLoading from './hooks/useLoading';
import { PATHS } from './paths';

const urlApi = import.meta.env.VITE_URL_API;

export const RequestInterceptor = () => {
	const { accessToken } = useUserJWTStore(state => state.jwt);
	const { isLoading, startLoading, stopLoading } = useLoading();

	useEffect(() => {
		const requestInterceptor = axios.interceptors.request.use(
			(config) => {
				startLoading();

				config.baseURL = urlApi;
				
				if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json';
				if (accessToken) {
					config.headers.Authorization = `bearer ${accessToken}`;
					if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json';

				}
				stopLoading();
				return config;
			},
			(error) => {
				stopLoading();
				return Promise.reject(error);
			},
		);

		return () => {
			axios.interceptors.request.eject(requestInterceptor);
		};
	}, [accessToken]);

	if (isLoading) {
		return <Spin percent={'auto'} fullscreen tip="Cargando" />;
	}
	
	return null;
};

export const ResponseInterceptor = () => {
	const { isExpiredAccessToken, refreshAccessToken, jwt } = useUserJWTStore(state => state)

	const { message } = App.useApp()

	useEffect(() => {
		const responseInterceptor = axios.interceptors.response.use(
			(response) => {
				return response;
			},
			(error: AxiosError) => {
				if (!error.response || error.status == 502) {
					void message.open({
						type: 'error',
						content: 'No se puede establecer conexión con el servidor',
						key: '502',
					});
				} else {
					const code = error.response.status;
					const errorData = error.response.data as { errors: { message: string, extensions: { code: string } }[] }

					if (code == 401) {
						if (errorData.errors?.[0]?.extensions?.code == "TOKEN_EXPIRED") {
							window.location.href = PATHS.LOGIN
							return
						}
						if (isExpiredAccessToken() && jwt.refreshToken) {
							refreshAccessToken()
						}
					}
				}

				return Promise.reject(error);
			}
		)

		return () => {
			axios.interceptors.response.eject(responseInterceptor)
		}
	}, [message])

	return null;
}