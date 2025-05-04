"use client"

import { useState, useEffect, FC } from "react"
import { Form, Input, Button, Card, Typography, Spin, Select, App, List, Avatar } from "antd"
import { useParams, useNavigate } from "react-router-dom"
import { useAreaStore } from "../../../context/areaContext"
import { useSpecialistStore } from "../../../context/specialistContext"
import { PATHS } from "../../../paths"
import { TeamOutlined } from "@ant-design/icons"
import type { Area } from "../../../types"

const { Title } = Typography

interface AreaFormData {
  nombre: string
  especialistaIds: string[]
}

const AreaFormView: FC<{ readonly?:boolean }> = ({ readonly=false }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getAreaById, createArea, updateArea, loading: areaLoading } = useAreaStore()
  const { getSpecialists } = useSpecialistStore()

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [area, setArea] = useState<Area | null>(null)

  const { notification } = App.useApp()

  const specialist = getSpecialists()
  const areaSpecialists = specialist.filter(item => area?.especialistaIds.includes(item.id))

  // Cargar datos del área si estamos editando
  useEffect(() => {
    if (id) {
      setLoading(true)

      const areaData = getAreaById(id)

      if (areaData) {
        setArea(areaData)
        form.setFieldsValue({
          nombre: areaData.nombre,
          especialistaIds: areaData.especialistaIds
        })
      } else {
        notification.error({ message:"Área no encontrada" })
        setTimeout(() => navigate(PATHS.AREAS), 2000)
      }

      setLoading(false)
    }
  }, [id, getAreaById, form, navigate])

  const onFinish = async (values: AreaFormData) => {
    setLoading(true)

    try {
      const areaData = {
        nombre: values.nombre,
        especialistaIds: values.especialistaIds,
      }

      if (!id) {
        // Crear nueva área
        await createArea(areaData)
      } else if (area) {
        // Actualizar área existente
        await updateArea(area.id, areaData)
      }

      navigate(PATHS.AREAS)
    } catch (err) {
      notification.error({ message: "Error al guardar el área" })
    } finally {
      setLoading(false)
    }
  }


  if ((loading || areaLoading) && id) {
    return <Spin size="large" tip="Cargando..." />
  }

  return (
    <div>
      <Title level={2}>{!id ? "Crear Área" : "Editar Área"}</Title>

      <Card>
        <Form disabled={readonly} form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="nombre"
            label="Nombre del Área"
            rules={[
              { required: true, message: "Por favor ingrese el nombre del área" },
              { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
              { max: 50, message: "El nombre no puede exceder los 50 caracteres" },
              {
                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: "El nombre solo debe contener letras y espacios",
              },
            ]}
          >
            <Input placeholder="Nombre del área" />
          </Form.Item>

          <Form.Item
            name="especialistaIds"
            label="Especialistas del Área"
            rules={[{ required: true, message: "Por favor ingrese los especialistas del área" }]}
          >
            <Select
              mode="multiple"
              showSearch={false}
              placeholder='Especialistas'
              options={specialist?.map(item => ({ label: item.nombre, value: item.id }))}
            />
          </Form.Item>

            {id && <div>
                <Title level={4}>Especialistas</Title>
                {areaSpecialists?.length > 0 ? (
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
            </div>}

          <Form.Item>
            {!readonly && <Button type="primary" htmlType="submit" loading={loading}>
              {!id ? "Crear Área" : "Guardar Cambios"}
            </Button>}
            <Button danger disabled={false} style={{ marginLeft: 8 }} onClick={() => navigate(PATHS.AREAS)}>
              {readonly ? 'Cerrar': 'Cancelar'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default AreaFormView