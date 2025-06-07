import axios from 'axios';
import { User, UserDTO, UserModel } from '@/domain/User';

export class ImplementationUserRepository {
    protected readonly baseUrl: string = '/users/';

    async list(filter: string) {
        const response = await axios.get<{ data: UserDTO[] }>(this.baseUrl+`?${filter}`)

        return {
            ...response,
            data: response.data?.data?.map(item => UserModel.ToModel(item).user)
        }
    }

    async getById(userId: string) {
        const response = await axios.get<{ data: UserDTO }>(this.baseUrl+userId)

        return {
            ...response,
            data: UserModel.ToModel(response?.data?.data)
        }
    }

    async register(data: Pick<User, "email" | "password" | "firstName" | "lastName">) {
        const { firstName, lastName, ...rest } = data
        const newData = {
            ...rest,
            first_name: firstName,
            last_name: lastName,
        }

        return await axios.post(this.baseUrl+'register', newData)
    }

    async create(data: Partial<User>) {
        return await axios.post(this.baseUrl, UserModel.ToDTo(data))
    }

    async update(data: Partial<User>) {
        return await axios.patch(this.baseUrl+data.id, UserModel.ToDTo(data))
    }

    async delete(userId: string) {
        return await axios.patch(this.baseUrl+userId, { active: false })
    }

}

export const repository = new ImplementationUserRepository();