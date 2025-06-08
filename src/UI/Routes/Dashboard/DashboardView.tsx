"use client"

import { Row, Col, Card, Statistic, Typography, Divider } from "antd"
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"
const { Title } = Typography

const DashboardView = () => {

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
              <Statistic title="Total Citas" value={0} prefix={<CalendarOutlined />} />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Pendientes"
                value={1}
                valueStyle={{ color: "#faad14" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Agendadas"
                value={2}
                valueStyle={{ color: "#1890ff" }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Completadas"
                value={3}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card variant={'borderless'} className="dashboard-card">
              <Statistic
                title="Canceladas"
                value={4}
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
          {/* {areaStats.map((area) => (
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
            </Col> */}
        </Row>
      </div>

      <Divider />

      <div className="dashboard-stats">
        <Title level={3}>Citas por Especialistas</Title>
        <Row gutter={16}>
          {/* {specialistStats.map((specialist) => (
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
          ))} */}
        </Row>
      </div>
    </div>
  )
}

export default DashboardView
