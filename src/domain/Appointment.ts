import { AppointmentStatus } from "@/types"
import { Base, BaseDto } from "./Base"

export interface AppointmentDTO extends BaseDto {
    id: string
    patient_id: string
    specialist_id: string
    area_id: string | null
    brand_id: string
    status: AppointmentStatus
    date: string
}

export interface Appointment extends Base {
    id: string
    patientId: string
    specialistId: string
    areaId: string | null
    brandId: string
    status: AppointmentStatus
    date: string
}

export class AppointmentModel {
    appointmentId: string
    appointment: Appointment

    constructor(appointment:Appointment) {
        this.appointmentId=appointment.id,
        this.appointment = appointment
    }

    static ToModel(dto: AppointmentDTO) {
        const Appointment: Appointment = {
            ...dto,
            brandId: dto.brand_id,
            patientId: dto.patient_id,
            areaId: dto.area_id,
            specialistId: dto.specialist_id,
            createdAt: dto.created_at,
            updateAt: dto.update_at, 
        }

        return new AppointmentModel(Appointment)
    }

    static ToDTo(appointment: Partial<Appointment>): Partial<AppointmentDTO> {
        return {
            brand_id: appointment.brandId,
            patient_id: appointment.patientId,
            area_id: appointment.areaId,
            date: appointment.date,
            specialist_id: appointment.specialistId,
            status: appointment.status,
            ...(appointment.id ? { id: appointment.id } : {})
        }
    }
}