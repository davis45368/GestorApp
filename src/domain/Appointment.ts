import { Base, BaseDto } from "./Base"
import { Area, AreaDTO } from "./Area"
import { Specialist, SpecialistDTO } from "./Specialist"
import { AppointmentStatus } from "@/types/const"

export interface AppointmentDTO extends BaseDto {
    id: string
    patient_id: string
    specialist_id: string
    area_id: string | null
    brand_id: string
    status: AppointmentStatus
    date: string
}

export interface AppointmentDTOFull extends Omit<AppointmentDTO, 'specialist_id' | 'area_id'> {
    specialint_id: Partial<SpecialistDTO>
    area_id: Partial<AreaDTO>
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

export interface AppointmentFull extends Omit<Appointment, 'areaId' | 'specialistId'> {
    specialintId: Partial<Specialist>
    areaId: Partial<Area>
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
            active: dto.active,
            date: dto.date,
            id: dto.id,
            status: dto.status,
            brandId: dto.brand_id,
            patientId: dto.patient_id,
            areaId: dto.area_id,
            specialistId: dto.specialist_id,
            dateCreated: dto.date_created,
            dateUpdated: dto.date_updated, 
        }

        return new AppointmentModel(Appointment)
    }

    static ToDomainFull(dtoFull: AppointmentDTOFull): AppointmentFull {
        
        return {
            active: dtoFull.active,
            date: dtoFull.date,
            id: dtoFull.id,
            status: dtoFull.status,
            brandId: dtoFull.brand_id,
            patientId: dtoFull.patient_id,
            areaId: { id: dtoFull.area_id?.id, name: dtoFull.area_id?.name },
            specialintId: { id: dtoFull.specialint_id?.id, name: dtoFull.specialint_id?.name },
            dateCreated: dtoFull.date_created,
            dateUpdated: dtoFull.date_updated, 
        }
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