import axios from 'axios';
import { Specialist, SpecialistDTO, SpecialistModel } from '@/domain/Specialist';

export class ImplementationSpecialistRepository {
    protected readonly baseUrl: string = 'items/specialists/';

    async list(filter: string) {
        const response = await axios.get<{ data: SpecialistDTO[] }>(this.baseUrl+`?${filter}`)

        return {
            ...response,
            data: response.data?.data?.map(item => SpecialistModel.ToModel(item).specialist)
        }
    }

    async getById(specialistId: string) {
        const response = await axios.get<{ data: SpecialistDTO }>(this.baseUrl+specialistId)

        return {
            ...response,
            data: SpecialistModel.ToModel(response?.data?.data)
        }
    }

    async create(data: Partial<Specialist>) {
        return await axios.post(this.baseUrl, SpecialistModel.ToDTo(data))
    }

    async update(data: Partial<Specialist>) {
        return await axios.patch(this.baseUrl+data.id, SpecialistModel.ToDTo(data))
    }

    async delete(specialistId: string) {
        return await axios.patch(this.baseUrl+specialistId, { active: false })
    }

}

export const repository = new ImplementationSpecialistRepository();