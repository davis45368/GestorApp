import { Base, BaseDto } from "./Base"

export interface SpecialistDTO extends BaseDto {
    id: string
    name: string
    doctor_code: string
    user_id: string | null
    brand_id: string
}

export interface Specialist extends Base {
    id: string
    name: string
    doctorCode: string
    userId: string | null
    brandId: string
}

export class SpecialistModel {
    specialistId: string
    specialist: Specialist

    constructor(specialist:Specialist) {
        this.specialistId=specialist.id,
        this.specialist = specialist
    }

    static ToModel(dto: SpecialistDTO) {
        const specialist: Specialist = {
            ...dto,
            brandId: dto.brand_id,
            doctorCode: dto.doctor_code,
            userId: dto.user_id,
            createdAt: dto.created_at,
            updateAt: dto.update_at, 
        }

        return new SpecialistModel(specialist)
    }

    static ToDTo(specialist: Partial<Specialist>): Partial<SpecialistDTO> {
        return {
            brand_id: specialist.brandId,
            doctor_code: specialist.doctorCode,
            name: specialist.name,
            user_id: specialist.userId,
            ...(specialist.id ? { id: specialist.id } : {})
        }
    }
}