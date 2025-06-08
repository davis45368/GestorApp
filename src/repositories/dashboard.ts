import axios from 'axios';
import { AreaStatus, CitasByState, EstadoTotalDTO } from '@/domain/dashboard';

export class ImplementationDashboardRepository {
    protected readonly baseUrl: string = '/';

    async appointmentsByState(user_id: string, rol:string) {
        let response;
        if (rol === 'paciente') {
            response = await axios.get<{ data: CitasByState[] }>(this.baseUrl + `items/appointments?filter[patient_id][_eq]=${user_id}&filter[active][_eq]=true&groupBy[]=status&aggregate[count]=*`)
        }else {
            response = await axios.get<{ data: CitasByState[] }>(this.baseUrl + `items/appointments?filter[specialint_id][user_id][_eq]=${user_id}&filter[active][_eq]=true&groupBy[]=status&aggregate[count]=*`)
        }

        return {
            ...response,
            data: response.data.data.map((item) => ({
                status: item.status,
                count: Number(item.count || 0)
            })) as CitasByState[]
        }
    }

    async appointmentsByArea() {
        const response = await axios.get<{ data: AreaStatus[] }>(this.baseUrl + `sql-custom/appointments-group-status-by-areas`)

        return {
            ...response,
            data: response.data.data.map((item) => ({
                area_id: item.area_id,
                area: item.area,
                status: item.status,
                total: item.total
            })) as AreaStatus[]
        }
    }

    async appointmentsBySpecialist() {
        const response = await axios.get<{ data: EstadoTotalDTO[] }>(this.baseUrl + `sql-custom/appointments-group-status-by-specialists`)

        return {
            ...response,
            data: response.data.data.map((item) => ({
                id: item.id,
                name: item.name,
                status: item.status,
                total: item.total
            })) as EstadoTotalDTO[]
        }
    }


}

export const repository = new ImplementationDashboardRepository()