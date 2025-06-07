import { Base, BaseDto } from "./Base"

export interface BrandDTO extends BaseDto {
    id: string
    name: string
}

export interface Brand extends Base {
    id: string
    name: string
}

export class BrandModel {
    brandId: string
    brand: Brand

    constructor(brand:Brand) {
        this.brandId=brand.id,
        this.brand = brand
    }

    static ToModel(dto: BrandDTO) {
        const brand: Brand = {
            ...dto,
            createdAt: dto.created_at,
            updateAt: dto.update_at,
        }

        return new BrandModel(brand)
    }

    static ToDTo(brand: Partial<Brand>): Partial<BrandDTO> {
        return {
            name: brand.name,
            ...(brand.id ? { id: brand.id } : {})
        }
    }
}