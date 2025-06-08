import axios from 'axios';
import { MedicalRecord, MedicalRecordDTO, MedicalRecordModel } from '@/domain/MedicalRecord';
export class ImplementationMedicalRecordRepository {
    protected readonly baseUrl: string = 'items/medicalrecords/';

    async list(filter: string) {
        const response = await axios.get<{ data: MedicalRecordDTO[] }>(this.baseUrl+`?${filter}&fields=*,speciallist_id.id,speciallist_id.name`)

        return {
            ...response,
            data: response.data?.data?.map(item => MedicalRecordModel.ToModel(item).medicalRecord)
        }
    }

    async create(data: Partial<MedicalRecord>) {
        return await axios.post(this.baseUrl, MedicalRecordModel.ToDTo(data))
    }

}

export const repository = new ImplementationMedicalRecordRepository();