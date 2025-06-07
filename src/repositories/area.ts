import axios from 'axios';
import { Area, AreaDTO, AreaModel } from '@/domain/Area';
import { UpdateArea } from '@/querys/area';

export class ImplementationAreaRepository {
    protected readonly baseUrl: string = 'items/areas/';

    async list(filter: string) {
        const response = await axios.get<{ data: AreaDTO[] }>(this.baseUrl+`?${filter}`)

        return {
            ...response,
            data: response.data?.data?.map(item => AreaModel.ToModel(item).area)
        }
    }

    async getById(areaId: string) {
        const response = await axios.get<{ data: AreaDTO }>(this.baseUrl+areaId)

        return {
            ...response,
            data: AreaModel.ToModel(response?.data?.data)
        }
    }

    async create(data: Partial<Area>) {
        return await axios.post(this.baseUrl, AreaModel.ToDTo(data))
    }

    async update(data: UpdateArea) {
        return await axios.patch(this.baseUrl+data.id, AreaModel.ToDTo(data))
    }

    async delete(areaId: string) {
        return await axios.patch(this.baseUrl+areaId, { active: false })
    }

}

export const repository = new ImplementationAreaRepository();