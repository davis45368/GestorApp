"use client"

import { Row, Col, Card, Statistic, Typography, Divider } from "antd"
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"
import { appointmentsByArea, appointmentsByState, appointmentsBySpecialist } from "@/querys/dashboard"
import useUserDataStore from "@/context/userDataContext"
const { Title } = Typography

const DashboardView = () => {

  const { user } = useUserDataStore(state => state);
  const mutationDashboard = appointmentsByState(user?.id || "", user?.role || "especialista");

  
  const mutationDashboardAreas = appointmentsByArea();
  const mutationDashboardSpecialists = appointmentsBySpecialist();

  const totalAppointments = mutationDashboard.data?.data.reduce((acc, item) => acc + item.count, 0) || 0
  const pendingAppointments = mutationDashboard.data?.data.find(item => item.status === ("pendiente" as typeof item.status))?.count || 0;
  const scheduledAppointments = mutationDashboard.data?.data.find(item => item.status === ("agendada" as typeof item.status))?.count || 0;
  const completedAppointments = mutationDashboard.data?.data.find(item => item.status === ("completa" as typeof item.status))?.count || 0;
  const cancelledAppointments = mutationDashboard.data?.data.find(item => item.status === ("cancelada" as typeof item.status))?.count || 0;


  // Paso 1: Agrupa los datos
  const areasAgrupadas = mutationDashboardAreas.data?.data.reduce((acc, item) => {
    const key = item.area_id;
    if (!acc[key]) {
      acc[key] = {
        area_id: item.area_id,
        area: item.area,
        total: 0,
        pendientes: 0,
        agendadas: 0,
        completadas: 0,
      };
    }

    const total = Number(item.total);

    acc[key].total += total;

    if (item.status === "pendiente") {
      acc[key].pendientes += total;
    } else if (item.status === "agendada") {
      acc[key].agendadas += total;
    } else if (item.status === "completa") {
      acc[key].completadas += total;
    }

    return acc;
  }, {} as Record<string, any>);

  // Paso 2: Convertir el objeto en array
  const areas = Object.values(areasAgrupadas || {});


  // Agruoar los datos de especialistas
  const specialistStats = mutationDashboardSpecialists.data?.data.reduce((acc, item) => {
    const key = item.id;
    if (!acc[key]) {
      acc[key] = {
        id: item.id,
        nombre: item.name,
        total: 0,
        pendientes: 0,
        agendadas: 0,
        completas: 0,
      };
    }
    const total = Number(item.total);
    acc[key].total += total;

    if (item.status === "pendiente") {
      acc[key].pendientes += total;

    } else if (item.status === "agendada") {
      acc[key].agendadas += total;

    } else if (item.status === "completa") {
      acc[key].completas += total;
    }
    return acc;
  }, {} as Record<string, any>);
  const specialistStatsArray = Object.values(specialistStats || {});


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
              <Statistic title="Total Citas" value={totalAppointments} prefix={<CalendarOutlined />} />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Pendientes"
                value={pendingAppointments}
                valueStyle={{ color: "#faad14" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Agendadas"
                value={scheduledAppointments}
                valueStyle={{ color: "#1890ff" }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Completadas"
                value={completedAppointments}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Canceladas"
                value={cancelledAppointments}
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
          {areas.map((area) => (
            <Col span={8} key={area.area_id}>
              <Card title={area.area} variant="borderless" className="dashboard-card">
                <Statistic title="Total Citas" value={area.total} prefix={<CalendarOutlined />} />
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={8}>
                    <Statistic title="Pendientes" value={area.pendientes} valueStyle={{ color: "#faad14" }} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Agendadas" value={area.agendadas} valueStyle={{ color: "#1890ff" }} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Completadas" value={area.completadas} valueStyle={{ color: "#52c41a" }} />
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
          {
            specialistStatsArray.map((specialist) => (
              <Col span={8} key={specialist.id}>
                <Card title={specialist.nombre} variant="borderless" className="dashboard-card">
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
            ))
          }
        </Row>
      </div>
    </div>
  )
}

export default DashboardView
