export interface UserDTO {
    id: string
    first_name: string
    last_name: string
    email: string
    active: boolean
    brand_id: string
    role: string
    patient_id: string | null
}

export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    password?: string
    active: boolean
    role: string
    brandId: string
    patientId: string | null
}

export class UserModel {
    userId: string
    user: User

    constructor(user:User) {
        this.userId=user.id,
        this.user = user
    }

    static ToModel(dto: UserDTO) {
        const user: User = {
            ...dto,
            brandId: dto.brand_id,
            firstName: dto.first_name,
            lastName: dto.last_name,
            patientId: dto.patient_id,
        }

        return new UserModel(user)
    }

    static ToDTo(user: Partial<User>): Partial<UserDTO> {
        return {
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            brand_id: user.brandId,
            role: user.role,
            patient_id: user.patientId ?? null,
            ...(user?.password ? { password: user.password } : {}),
            ...(user.id ? { id: user.id } : {})
        }
    }
}