import axios from 'axios';
import { BrandDTO, BrandModel } from '@/domain/Brand';

export class ImplementationBrandRepository {
    protected readonly baseUrl: string = 'items/brands/';

    async list(filter: string) {
        const response = await axios.get<{ data: BrandDTO[] }>(this.baseUrl+`?${filter}`)

        return {
            ...response,
            data: response.data?.data?.map(item => BrandModel.ToModel(item).brand)
        }
    }
}

export const repository = new ImplementationBrandRepository();