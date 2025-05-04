"use client"

import { useEffect, useState } from "react"
import { Row, Col, Card, Statistic, Typography, Divider } from "antd"
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"
import { useAppointmentStore } from "../../../context/appointmentContext"
import { useAreaStore } from "../../../context/areaContext"
import { useSpecialistStore } from "../../../context/specialistContext"
import { useBrandStore } from "../../../context/brandContext"

const { Title } = Typography

const DashboardView = () => {
  const { getAppointments } = useAppointmentStore()
  const { getAreas } = useAreaStore()
  const { getSpecialists } = useSpecialistStore()
  const { currentBrand } = useBrandStore()
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    pendientes: 0,
    agendadas: 0,
    completas: 0,
    canceladas: 0,
  })
  const [areaStats, setAreaStats] = useState<any[]>([])
  const [specialistStats, setSpecialistStats] = useState<any[]>([])

  useEffect(() => {
    if (currentBrand) {
      // Obtener las citas
      const appointments = getAppointments()

      // Calcular estadísticas de citas
      const stats = {
        total: appointments.length,
        pendientes: appointments.filter((a) => a.estado === "pendiente").length,
        agendadas: appointments.filter((a) => a.estado === "agendada").length,
        completas: appointments.filter((a) => a.estado === "completa").length,
        canceladas: appointments.filter((a) => a.estado === "cancelada").length,
      }

      setAppointmentStats(stats)

      // Calcular estadísticas por área
      const areas = getAreas()
      const areaStatsData = areas.map((area) => {
        const areaAppointments = appointments.filter((a) => a.areaId === area.id)
        return {
          id: area.id,
          nombre: area.nombre,
          total: areaAppointments.length,
          pendientes: areaAppointments.filter((a) => a.estado === "pendiente").length,
          agendadas: areaAppointments.filter((a) => a.estado === "agendada").length,
          completas: areaAppointments.filter((a) => a.estado === "completa").length,
          canceladas: areaAppointments.filter((a) => a.estado === "cancelada").length,
        }
      })

      setAreaStats(areaStatsData)

      // Calcular estadísticas por especialista
      const specialists = getSpecialists()
      const specialistStatsData = specialists.map((specialist) => {
        const specialistAppointments = appointments.filter((a) => a.especialistaId === specialist.id)
        return {
          id: specialist.id,
          nombre: specialist.nombre,
          total: specialistAppointments.length,
          pendientes: specialistAppointments.filter((a) => a.estado === "pendiente").length,
          agendadas: specialistAppointments.filter((a) => a.estado === "agendada").length,
          completas: specialistAppointments.filter((a) => a.estado === "completa").length,
          canceladas: specialistAppointments.filter((a) => a.estado === "cancelada").length,
        }
      })

      setSpecialistStats(specialistStatsData)
    }
  }, [currentBrand, getAppointments, getAreas, getSpecialists])

  return (
    <div>
      <div className="page-header">
        <Title level={2}>Dashboard</Title>
      </div>

      <div className="dashboard-stats">
        <Title level={3}>Resumen de Citas</Title>
        <Row gutter={16}>
          <Col span={4}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic title="Total Citas" value={appointmentStats.total} prefix={<CalendarOutlined />} />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Pendientes"
                value={appointmentStats.pendientes}
                valueStyle={{ color: "#faad14" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Agendadas"
                value={appointmentStats.agendadas}
                valueStyle={{ color: "#1890ff" }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Completadas"
                value={appointmentStats.completas}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Canceladas"
                value={appointmentStats.canceladas}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Divider />

      <div className="dashboard-stats">
        <Title level={3}>Citas por Áreas</Title>
        <Row gutter={16}>
          {areaStats.map((area) => (
            <Col span={8} key={area.id}>
              <Card title={area.nombre} variant={'borderless'} className="dashboard-card">
                <Statistic title="Total Citas" value={area.total} prefix={<CalendarOutlined />} />
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={8}>
                    <Statistic title="Pendientes" value={area.pendientes} valueStyle={{ color: "#faad14" }} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Agendadas" value={area.agendadas} valueStyle={{ color: "#1890ff" }} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Completadas" value={area.completas} valueStyle={{ color: "#52c41a" }} />
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Divider />

      <div className="dashboard-stats">
        <Title level={3}>Citas por Especialistas</Title>
        <Row gutter={16}>
          {specialistStats.map((specialist) => (
            <Col span={8} key={specialist.id}>
              <Card title={specialist.nombre} bordered={false} className="dashboard-card">
                <Statistic title="Total Citas" value={specialist.total} prefix={<CalendarOutlined />} />
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={8}>
                    <Statistic title="Pendientes" value={specialist.pendientes} valueStyle={{ color: "#faad14" }} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Agendadas" value={specialist.agendadas} valueStyle={{ color: "#1890ff" }} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Completadas" value={specialist.completas} valueStyle={{ color: "#52c41a" }} />
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default DashboardView
