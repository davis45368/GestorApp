import { AppointmentStatus } from "@/types/const"
import { Tag } from "antd"
import { TagProps } from "antd/lib"

interface StatusBadgeProps {
	status: AppointmentStatus
}

const StatusTag = ({ status }: StatusBadgeProps) => {
	const newStatus = status?.toLocaleLowerCase()

	const statusConfig: { [key: string]: { color: TagProps["color"], text: string } } = {
		[AppointmentStatus.pending as string]: {
			color: 'gold',
			text: 'Pendiente'
		},
		[AppointmentStatus.scheduled]: {
			color: 'blue',
			text: 'Agendada'
		},
		[AppointmentStatus.completed]: {
			color: 'green',
			text: 'Completada'
		},
		[AppointmentStatus.canceled]: {
			color: 'red',
			text: 'Cancelada'
		},
	}

	const config = statusConfig[newStatus]
	
	return <Tag color={config?.color}>{config?.text}</Tag> 
}

export default StatusTag
