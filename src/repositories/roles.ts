import axios from 'axios';
import { RoleDTO, RoleModel } from '@/domain/Role';

export class ImplementationRoleRepository {
    protected readonly baseUrl: string = '/roles/';

    async list() {
        const response = await axios.get<{ data: RoleDTO[] }>(this.baseUrl)

        return {
            ...response,
            data: response.data?.data?.map(item => RoleModel.ToModel(item))
        }
    }
}

export const repository = new ImplementationRoleRepository();