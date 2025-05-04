import { Badge } from "antd"
import type { AppointmentStatus } from "../../types"

interface StatusBadgeProps {
  status: AppointmentStatus
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: AppointmentStatus) => {
    switch (status) {
      case "pendiente":
        return { status: "warning", text: "Pendiente" }
      case "agendada":
        return { status: "processing", text: "Agendada" }
      case "completa":
        return { status: "success", text: "Completa" }
      case "cancelada":
        return { status: "error", text: "Cancelada" }
      default:
        return { status: "default", text: status }
    }
  }

  const config = getStatusConfig(status)

  return <Badge status={config.status as any} text={config.text} className="appointment-status-badge" />
}

export default StatusBadge
