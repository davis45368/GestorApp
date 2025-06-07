export interface LoginJwtDTO {
	access_token: string,
	refresh_token: string,
	expires: number
}

export type LoginData = {
	email: string,
	password: string,
};

export interface LoginJwt {
	accessToken: string,
	refreshToken: string,
	expires: number
}

export class LoginJwtModel {
	jwt: LoginJwt;

	constructor(jwt: LoginJwt) {
		this.jwt = jwt;
	}

	static ToDomain(DTO: LoginJwtDTO): LoginJwt {
		return {
			accessToken: DTO.access_token,
			refreshToken: DTO.refresh_token,
			expires: DTO.expires,
		};
	}
}