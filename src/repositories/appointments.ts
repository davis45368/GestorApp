import axios from 'axios';
import { Appointment, AppointmentDTO, AppointmentDTOFull, AppointmentModel } from '@/domain/Appointment';

export class ImplementationAppointmentRepository {
    protected readonly baseUrl: string = 'items/appointments/';

    async list(filter: string) {
        const response = await axios.get<{ data: AppointmentDTO[] }>(this.baseUrl+`?${filter}`)

        return {
            ...response,
            data: response.data?.data?.map(item => AppointmentModel.ToModel(item).appointment)
        }
    }
    async listFull(filter: string) {
        try {
            const response = await axios.get<{ data: AppointmentDTOFull[] }>(this.baseUrl+`?${filter}`)
            return {
                ...response,
                data: response.data?.data?.map(item => AppointmentModel.ToDomainFull(item))
            }
        } catch (err) {
            console.error(err)
        }
    }

    async getById(appointmentId: string) {
        const response = await axios.get<{ data: AppointmentDTO }>(this.baseUrl+appointmentId)

        return {
            ...response,
            data: AppointmentModel.ToModel(response?.data?.data)
        }
    }

    async create(data: Partial<Appointment>) {
        return await axios.post(this.baseUrl, AppointmentModel.ToDTo(data))
    }

    async update(data: Partial<Appointment>) {
        return await axios.patch(this.baseUrl+data.id, AppointmentModel.ToDTo(data))
    }
}

export const repository = new ImplementationAppointmentRepository();