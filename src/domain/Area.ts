import { Base, BaseDto } from "./Base"

export interface AreaDTO extends BaseDto {
    id: string
    name: string
    brand_id: string
    specialists_ids: string[]
}

export interface Area extends Base {
    id: string
    brandId: string
    name: string
    specialistsIds : string[]
}

export class AreaModel {
    areaId: string
    area: Area

    constructor(area:Area) {
        this.areaId=area.id,
        this.area = area
    }

    static ToModel(dto: AreaDTO) {
        const area: Area = {
            ...dto,
            brandId: dto.brand_id,
            specialistsIds: dto.specialists_ids,
            createdAt: dto.created_at,
            updateAt: dto.update_at,
        }

        return new AreaModel(area)
    }

    static ToDTo(area: Partial<Area>): Partial<AreaDTO> {
        return {
            brand_id: area.brandId,
            specialists_ids: area.specialistsIds,
            name: area.name,
            ...(area.id ? { id: area.id } : {})
        }
    }
}