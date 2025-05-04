"use client"

import { useEffect, useState } from "react"
import { Card, Descriptions, Button, Typography, Tag, Spin, Divider, Row, Col } from "antd"
import { useParams, useNavigate } from "react-router-dom"
import { useBrandStore } from "../../../context/brandContext"
import { PATHS } from "../../../paths"
import type { Role, User } from "../../../types"

const { Title } = Typography

const UserDetailView = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentBrand } = useBrandStore()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Cargar datos del usuario
  useEffect(() => {
    if (id && currentBrand) {
      setLoading(true)

      // Buscar usuario
      const userData = currentBrand.users.find((user) => user.id === id)

      if (userData) {
        setUser(userData)
      } else {
        // Si no se encuentra, redirigir a la lista
        navigate(PATHS.USERS)
      }

      setLoading(false)
    }
  }, [id, currentBrand, navigate])

  if (loading) {
    return <Spin size="large" tip="Cargando..." />
  }

  if (!user) {
    return <Title level={3}>Usuario no encontrado</Title>
  }

  // Función para mostrar el color del tag según el rol
  const getRoleTagColor = (role: Role) => {
    switch (role) {
      case "admin":
        return "red"
      case "recepcionista":
        return "blue"
      case "especialista":
        return "green"
      case "paciente":
        return "purple"
      default:
        return "default"
    }
  }

  return (
    <div>
      <Title level={2}>Detalle de Usuario</Title>

      <Card style={{ marginBottom: 24 }}>
        <Descriptions title="Información del Usuario" bordered>
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Nombre">{user.nombre}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Rol">
            <Tag color={getRoleTagColor(user.role)}>{user.role.toUpperCase()}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Marca/Hospital">{currentBrand?.brandName}</Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* Información adicional dependiendo del rol */}
        {user.role === "especialista" && (
          <div>
            <Title level={4}>Información del Especialista</Title>
            {(() => {
              const specialist = currentBrand?.especialistas.find((spec) => spec.userId === user.id)

              if (specialist) {
                const area = currentBrand?.areas.find((area) => area.id === specialist.areaId)

                return (
                  <Descriptions bordered>
                    <Descriptions.Item label="Código de Doctor">{specialist.codigoDoctor}</Descriptions.Item>
                    <Descriptions.Item label="Área">{area?.nombre || "N/A"}</Descriptions.Item>
                  </Descriptions>
                )
              }

              return <p>No se encontró información de especialista para este usuario.</p>
            })()}
          </div>
        )}

        {user.role === "paciente" && (
          <div>
            <Title level={4}>Citas del Paciente</Title>
            {(() => {
              const appointments = currentBrand?.citas.filter((cita) => cita.pacienteId === user.id)

              if (appointments && appointments.length > 0) {
                return (
                  <ul>
                    {appointments.map((cita) => {
                      const specialist = currentBrand?.especialistas.find((spec) => spec.id === cita.especialistaId)

                      const area = currentBrand?.areas.find((area) => area.id === cita.areaId)

                      return (
                        <li key={cita.id}>
                          {new Date(cita.fecha).toLocaleDateString()} - {area?.nombre || "N/A"} -{" "}
                          {specialist?.nombre || "N/A"} - Estado: {cita.estado}
                        </li>
                      )
                    })}
                  </ul>
                )
              }

              return <p>Este paciente no tiene citas registradas.</p>
            })()}
          </div>
        )}
      </Card>

      {/* Acciones */}
      <Row justify="end">
        <Col>
          <Button onClick={() => navigate(PATHS.USERS)}>Volver</Button>
        </Col>
      </Row>
    </div>
  )
}

export default UserDetailView
