"use client"

import { useState, useEffect, FC } from "react"
import { Form, Input, Button, Card, Typography, Spin, Select, App } from "antd"
import { useParams, useNavigate } from "react-router-dom"
import { useSpecialistStore } from "../../../context/specialistContext"
import { useBrandStore } from "../../../context/brandContext"
import { PATHS } from "../../../paths"
import type { Specialist } from "../../../types"

const { Title } = Typography

interface SpecialistFormData {
  nombre: string
  codigoDoctor: string
  areaId: string
  userId: string | null
}

const SpecialistFormView: FC<{ readonly?: boolean }> = ({ readonly = false }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getSpecialistById, createSpecialist, updateSpecialist, loading: specialistLoading } = useSpecialistStore()
  const { currentBrand } = useBrandStore()

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [specialist, setSpecialist] = useState<Specialist | null>(null)

  const { notification } = App.useApp()

  // Cargar datos del especialista si estamos editando
  useEffect(() => {
    if (id) {
      setLoading(true)

      const specialistData = getSpecialistById(id)

      if (specialistData) {
        setSpecialist(specialistData)
        form.setFieldsValue({
          nombre: specialistData.nombre,
          codigoDoctor: specialistData.codigoDoctor,
          areaId: specialistData.areaId,
          userId: specialistData.userId,
        })
      } else {
        notification.error({ message: "Especialista no encontrado"})
        setTimeout(() => navigate(PATHS.SPECIALISTS), 2000)
      }

      setLoading(false)
    }
  }, [id, getSpecialistById, form, navigate])

  const onFinish = async (values: SpecialistFormData) => {
    setLoading(true)

    try {
      if (!id) {
        // Crear nuevo especialista
        await createSpecialist(values)
      } else if (specialist) {
        // Actualizar especialista existente
        await updateSpecialist(specialist.id, values)
      }

      navigate(PATHS.SPECIALISTS)
    } catch (err) {
      notification.error({ message: "Error al guardar el especialista" })
    } finally {
      setLoading(false)
    }
  }

  if ((loading || specialistLoading) && id) {
    return <Spin size="large" tip="Cargando..." />
  }

  return (
    <div>
      <Title level={2}>{!id ? "Crear Especialista" : "Editar Especialista"}</Title>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} disabled={readonly}>
          <Form.Item
            name="nombre"
            label="Nombre del Especialista"
            rules={[
              { required: true, message: "Por favor ingrese el nombre del especialista" },
              { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
              { max: 100, message: "El nombre no puede exceder los 100 caracteres" },
              {
                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/,
                message: "El nombre solo debe contener letras, espacios y puntos",
              },
            ]}
          >
            <Input placeholder="Nombre del especialista" />
          </Form.Item>

          <Form.Item
            name="codigoDoctor"
            label="Código de Doctor"
            rules={[
              { required: true, message: "Por favor ingrese el código del doctor" },
              { min: 3, message: "El código debe tener al menos 3 caracteres" },
              { max: 20, message: "El código no puede exceder los 20 caracteres" },
              {
                pattern: /^[A-Z0-9-]+$/,
                message: "El código solo debe contener letras mayúsculas, números y guiones",
              },
              {
                validator: async (_, value) => {
                  if (!value || (specialist && specialist.codigoDoctor === value)) return Promise.resolve()

                  // Verificar si ya existe un especialista con el mismo código
                  const codeExists = currentBrand?.especialistas.some(
                    (spec) => spec.codigoDoctor === value && spec.id !== id,
                  )

                  if (codeExists) {
                    return Promise.reject("Ya existe un especialista con este código")
                  }

                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input placeholder="Código del doctor" />
          </Form.Item>

          <Form.Item>
            {!readonly &&
              <Button type="primary" htmlType="submit" loading={loading}>
                {id ? 'Guardar' : 'Crear' } Especialista
              </Button>
            }
            <Button disabled={false} danger style={{ marginLeft: 8 }} onClick={() => navigate(PATHS.SPECIALISTS)}>
              {readonly ? 'Cerrar' : 'Cancelar'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SpecialistFormView