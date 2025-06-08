import { Option } from ".";

export enum AppointmentStatus {
    pending='pendiente',
    scheduled='agendada',
    completed='completa',
    canceled='cancelada'
}

export const AppointmentStatusPending: Option = { label: 'Pendiente', value: AppointmentStatus.pending };
export const AppointmentStatusScheduled: Option = { label: 'Agendada', value: AppointmentStatus.scheduled };
export const AppointmentStatusCompleted: Option = { label: 'Completada', value: AppointmentStatus.completed };
export const AppointmentStatusCanceled: Option = { label: 'Cancelada', value: AppointmentStatus.canceled };

export const AppointmentStatusOptions: Option[] = [
    AppointmentStatusPending,
    AppointmentStatusScheduled,
    AppointmentStatusCompleted,
    AppointmentStatusCanceled
]