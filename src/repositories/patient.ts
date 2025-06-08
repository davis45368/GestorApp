import axios from 'axios';
import { Patient, PatientDTO, PatientModel } from '@/domain/Patient';

export class ImplementationPatientRepository {
    protected readonly baseUrl: string = 'items/patients/';

    async list(filter: string) {
        const response = await axios.get<{ data: PatientDTO[] }>(this.baseUrl+`?${filter}`)

        return {
            ...response,
            data: response.data?.data?.map(item => PatientModel.ToModel(item).patient)
        }
    }
    
    async getById(patientId: string) {
        const response = await axios.get<{ data: PatientDTO }>(this.baseUrl+patientId)

        return {
            ...response,
            data: PatientModel.ToModel(response?.data?.data)
        }
    }

    async create(data: Partial<Patient>) {
        return await axios.post<{ data: Partial<PatientDTO> }>(this.baseUrl, PatientModel.ToDTo(data))
    }

    async update(data: Partial<Patient>) {
        return await axios.patch<{ data: Partial<PatientDTO> }>(this.baseUrl+data.id, PatientModel.ToDTo(data))
    }
}

export const repository = new ImplementationPatientRepository();