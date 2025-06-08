import { Base, BaseDto } from "./Base"

export interface MedicalRecordDTO extends BaseDto {
    id: string
    patient_id: string
    speciallist_id: string | { id: string, name: string }
    appointment_id: string
    diagnostic: string
    notes: string
    brand_id: string
}

export interface MedicalRecord extends Base {
    id: string
    patientId: string
    speciallistId: string | { id: string, name: string }
    appointmentId: string
    diagnostic: string
    notes: string
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
            notes: dto.notes,
            dateCreated: dto.date_created,
            dateUpdated: dto.date_updated,
        }

        return new MedicalRecordModel(medicalRecord)
    }

    static ToDTo(medicalRecord: Partial<MedicalRecord>): Partial<MedicalRecordDTO> {
        return {
            brand_id: medicalRecord.brandId,
            appointment_id: medicalRecord.appointmentId,
            diagnostic: medicalRecord.diagnostic,
            notes: medicalRecord.notes,
            patient_id: medicalRecord.patientId,
            speciallist_id: medicalRecord.speciallistId?.toString(),
            ...(medicalRecord.id ? { id: medicalRecord.id } : {})
        }
    }
}