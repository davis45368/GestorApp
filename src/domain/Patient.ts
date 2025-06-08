import { Base, BaseDto } from "./Base"
import dayjs, { Dayjs } from "dayjs"

export interface PatientDTO extends BaseDto {
    id: string,
    phone_primary: string,
    phone_secondary: string,
    eps: string,
    date_of_birth: string,
    gender: string,
    address: string,
    emergency_contact: string,
    insurance_provider: string,
    insurance_number: string,
    appointments_ids: string[]
    folder_id?: string,
}

export interface Patient extends Base {
    id: string,
    phonePrimary: string,
    phoneSecondary: string,
    eps: string,
    dateOfBirth: Dayjs,
    gender: string,
    address: string,
    emergencyContact: string,
    insuranceProvider: string,
    insuranceNumber: string,
    appointmentsIds: string[]
    folder_id?: string
}

export class PatientModel {
    patientId: string
    patient: Patient

    constructor(patient:Patient) {
        this.patientId=patient.id,
        this.patient = patient
    }

    static ToModel(dto: PatientDTO) {
        const patient: Patient = {
            ...dto,

            folder_id: dto.folder_id,
            phonePrimary: dto.phone_primary,
            phoneSecondary: dto.phone_secondary,
            appointmentsIds: dto.appointments_ids,
            dateOfBirth: dayjs(dto.date_of_birth),
            emergencyContact: dto.emergency_contact,
            insuranceNumber: dto.insurance_number,
            insuranceProvider: dto.insurance_provider,
            dateCreated: dto.date_created,
            dateUpdated: dto.date_updated,
        }

        return new PatientModel(patient)
    }

    static ToDTo(patient: Partial<Patient>): Partial<PatientDTO> {
        return {
            address: patient.address,
            date_of_birth: patient.dateOfBirth?.format('YYYY-MM-DD'),
            phone_primary: patient.phonePrimary,
            phone_secondary: patient.phoneSecondary,
            emergency_contact: patient.emergencyContact,
            eps: patient.eps,
            gender: patient.gender,
            insurance_number: patient.insuranceNumber,
            insurance_provider: patient.insuranceProvider,
            ...(patient.id ? { id: patient.id } : {})
        }
    }
}