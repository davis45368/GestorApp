"use client"

import { FC, useEffect, useState } from "react"
import { Card, Descriptions, Button, Typography, Spin, Divider, Row, Col, List, Avatar } from "antd"
import { TeamOutlined } from "@ant-design/icons"
import { useParams, useNavigate } from "react-router-dom"
import { useAreaStore } from "../../../context/areaContext"
import { useSpecialistStore } from "../../../context/specialistContext"
import { PATHS } from "../../../paths"
import type { Area } from "../../../types"

const { Title } = Typography

const AreaDetailView: FC<{ readonly?:boolean }> = ({ readonly=false }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getAreaById, loading: areaLoading } = useAreaStore()
  const { specialists, loading: specialistLoading } = useSpecialistStore()

  const [area, setArea] = useState<Area | null>(null)
  const [areaSpecialists, setAreaSpecialists] = useState<any[]>([])

  // Cargar datos del área
  useEffect(() => {
    if (id) {
      const areaData = getAreaById(id)

      if (areaData) {
        setArea(areaData)

        // Filtrar especialistas de esta área
        const filteredSpecialists = specialists.filter((specialist) => specialist.areaId === id)

        setAreaSpecialists(filteredSpecialists)
      } else {
        // Si no se encuentra, redirigir a la lista
        navigate(PATHS.AREAS)
      }
    }
  }, [id, getAreaById, specialists, navigate])

  if (areaLoading || specialistLoading) {
    return <Spin size="large" tip="Cargando..." />
  }

  if (!area) {
    return <Title level={3}>Área no encontrada</Title>
  }

  return (
    <div>
      <Title level={2}>Detalle de Área</Title>

      <Card style={{ marginBottom: 24 }}>
        <Descriptions title="Información del Área" bordered>
          <Descriptions.Item label="ID">{area.id}</Descriptions.Item>
          <Descriptions.Item label="Nombre">{area.nombre}</Descriptions.Item>
          <Descriptions.Item label="Total Especialistas">{areaSpecialists.length}</Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* Lista de especialistas */}
        <div>
          <Title level={4}>Especialistas</Title>
          {areaSpecialists.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={areaSpecialists}
              renderItem={(specialist) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<TeamOutlined />} />}
                    title={specialist.nombre}
                    description={`Código: ${specialist.codigoDoctor}`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <p>No hay especialistas asignados a esta área.</p>
          )}
        </div>
      </Card>

      {/* Acciones */}
      <Row justify="end">
        <Col>
          <Button onClick={() => navigate(PATHS.AREAS)}>Volver</Button>
        </Col>
      </Row>
    </div>
  )
}

export default AreaDetailView
