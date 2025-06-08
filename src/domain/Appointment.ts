import { Base, BaseDto } from "./Base"
import { Area, AreaDTO } from "./Area"
import { Specialist, SpecialistDTO } from "./Specialist"
import { AppointmentStatus } from "@/types/const"
import { FileDTO, Files as CustomFile, FileModel } from "./File"
import dayjs, { Dayjs } from "dayjs"

export interface AppointmentDTO extends BaseDto {
    id: string
    patient_id: string
    specialint_id: string
    area_id: string | null
    brand_id: string
    status: AppointmentStatus
    date: string
    files_ids: FileDTO[]
    reason: string
}

export interface AppointmentDTOFull extends Omit<AppointmentDTO, 'specialint_id' | 'area_id'> {
    specialint_id: Partial<SpecialistDTO>
    area_id: Partial<AreaDTO>
}

export interface Appointment extends Base {
    id: string
    patientId: string
    specialintId: string
    areaId: string | null
    brandId: string
    status: AppointmentStatus
    date?: Dayjs
    filesIds: CustomFile[]
    reason: string
}

export interface AppointmentFull extends Omit<Appointment, 'areaId' | 'specialintId' | 'date'> {
    specialintId: Partial<Specialist>
    areaId: Partial<Area>
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
            active: dto.active,
            date: dto.date ? dayjs(dto.date) : undefined,
            id: dto.id,
            status: dto.status,
            brandId: dto.brand_id,
            patientId: dto.patient_id,
            areaId: dto.area_id,
            specialintId: dto.specialint_id,
            dateCreated: dto.date_created,
            dateUpdated: dto.date_updated,
            reason: dto.reason, 
            filesIds: dto.files_ids.map(item => FileModel.ToModel(item).file)
        }

        return new AppointmentModel(Appointment)
    }

    static ToDomainFull(dtoFull: AppointmentDTOFull): AppointmentFull {
        
        return {
            active: dtoFull.active,
            id: dtoFull.id,
            status: dtoFull.status,
            brandId: dtoFull.brand_id,
            reason: dtoFull.reason,
            date: dtoFull.date,
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
            date: appointment.date?.format('YYYY-MM-DD HH:mm'),
            specialint_id: appointment.specialintId,
            status: appointment.status,
            reason: appointment.reason,
            ...(appointment.id ? { id: appointment.id } : {})
        }
    }
}