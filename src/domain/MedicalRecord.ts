import { Base, BaseDto } from "./Base"

export interface MedicalRecordDTO extends BaseDto {
    id: string
    patient_id: string
    speciallist_id: string
    appointment_id: string
    diagnostic: string
    notes: string
    date: string
    brand_id: string
}

export interface MedicalRecord extends Base {
    id: string
    patientId: string
    speciallistId: string
    appointmentId: string
    diagnostic: string
    notes: string
    date: string
    brandId: string
}

export class MedicalRecordModel {
    medicalRecordId: string
    medicalRecord: MedicalRecord

    constructor(medicalRecord:MedicalRecord) {
        this.medicalRecordId=medicalRecord.id,
        this.medicalRecord = medicalRecord
    }

    static ToModel(dto: MedicalRecordDTO) {
        const medicalRecord: MedicalRecord = {
            ...dto,
            brandId: dto.brand_id,
            diagnostic: dto.diagnostic,
            appointmentId: dto.appointment_id,
            patientId: dto.patient_id,
            speciallistId: dto.speciallist_id,
            date: dto.date,
            notes: dto.notes,
            createdAt: dto.created_at,
            updateAt: dto.update_at,
        }

        return new MedicalRecordModel(medicalRecord)
    }

    static ToDTo(medicalRecord: Partial<MedicalRecord>): Partial<MedicalRecordDTO> {
        return {
            brand_id: medicalRecord.brandId,
            appointment_id: medicalRecord.appointmentId,
            date: medicalRecord.date,
            diagnostic: medicalRecord.diagnostic,
            notes: medicalRecord.notes,
            patient_id: medicalRecord.patientId,
            speciallist_id: medicalRecord.speciallistId,
            ...(medicalRecord.id ? { id: medicalRecord.id } : {})
        }
    }
}