enum State {
    PENDIENTE = "pendiente",
    AGEMNADA = "agendada",
    COMPLETA = "completa",
    CANCELADA = "cancelada"
}

export interface CitasByState {
    status: State;
    count: number;

}

export interface AreaStatusDTO {
    data: AreaStatus[];
    meta: Meta;
}

export interface AreaStatus {
    area_id: string;
    area: string;
    status: string;
    total: string;
}

export interface Meta {
    total: string;
    limit: number;
    page: number;
    pages: number;
}

export interface EstadoTotalDTO {
    id: string;
    name: string;
    status: 'completa' | 'pendiente' | 'agendada' |  'cancelada' |string; // puedes hacer más estricto si conoces todos los posibles estados
    total: string;
}
// Citas por Especialista
