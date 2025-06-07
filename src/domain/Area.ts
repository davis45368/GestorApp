import { UpdateArea } from "@/querys/area"
import { Base, BaseDto } from "./Base"

export interface AreaDTO extends BaseDto {
    id: string
    name: string
    brand_id: string
    specialists_ids: string[]
}
export interface AreaUpdateDTO extends BaseDto {
    id: string
    name: string
    brand_id: string
    specialists_ids: {
        create: [],
        update: {area_id: string, id: string}[],
        delete: string[]
    }
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
            id: dto.id,
            active: dto.active,
            name: dto.name,
            brandId: dto.brand_id,
            specialistsIds: dto.specialists_ids,
            dateCreated: dto.date_created,
            dateUpdated: dto.date_updated,
        }

        return new AreaModel(area)
    }

    static ToDTo(area: UpdateArea): Partial<AreaUpdateDTO> {
        return {
            brand_id: area.brandId,
            name: area.name,
            ...(area.specialListIdsUpdate ? { specialists_ids: area.specialListIdsUpdate } : {}),
            ...(area.id ? { id: area.id } : {})
        }
    }
}