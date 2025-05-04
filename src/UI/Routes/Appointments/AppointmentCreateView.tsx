"use client"

import { useEffect, useState } from "react"
import { Form, Input, Button, Select, DatePicker, Card, Typography, Alert, Upload, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useAppointments } from "../../../hooks/useAppointments"
import { useUserStore } from "../../../context/userContext"
import { useAreaStore } from "../../../context/areaContext"
import { useSpecialistStore } from "../../../context/specialistContext"
import { useBrandStore } from "../../../context/brandContext"
import { PATHS } from "../../../paths"
import BrandSelector from "../../Components/BrandSelector"

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

const AppointmentCreateView = () => {
  const navigate = useNavigate()
  const { createAppointment, loading, error } = useAppointments()
  const { user } = useUserStore()
  const { getAreas } = useAreaStore()
  const { getSpecialistsByArea } = useSpecialistStore()
  const { currentBrand } = useBrandStore()

  const areas = getAreas()

  const [form] = Form.useForm()
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [specialists, setSpecialists] = useState<any[]>([])
  const [isRecepcionista, setIsRecepcionista] = useState(false)

  // Verificar si el usuario es recepcionista
  useEffect(() => {
    if (user) {
      setIsRecepcionista(user.role === "admin" || user.role === "recepcionista")
    }
  }, [user])

  // Cargar especialistas al seleccionar área
  useEffect(() => {
    if (selectedArea) {
      const areaSpecialists = getSpecialistsByArea(selectedArea)
      setSpecialists(areaSpecialists)
    } else {
      setSpecialists([])
    }
  }, [selectedArea, getSpecialistsByArea])

  // Manejar cambio de área
  const handleAreaChange = (value: string) => {
    setSelectedArea(value)
    form.setFieldsValue({ especialistaId: undefined })
  }

  // Enviar formulario
  const onFinish = async (values: any) => {
    if (!currentBrand || !user) return

    try {
      // Crear objeto de cita
      const appointmentData = {
        pacienteId: user.role === "paciente" ? user.id : values.pacienteId,
        especialistaId: values.especialistaId,
        areaId: values.areaId,
        fecha: isRecepcionista ? values.fecha.toISOString() : null,
        estado: isRecepcionista ? "agendada" : "pendiente",
        brandId: currentBrand.brandId,
      }

      // Guardar cita
      await createAppointment(appointmentData)

      message.success("Cita creada correctamente")
      navigate(PATHS.APPOINTMENTS)
    } catch (error) {
      message.error("Error al crear la cita")
    }
  }

  return (
    <div>
      <Title level={2}>Crear Nueva Cita</Title>

      {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      {/* Selector de marca (solo para pacientes) */}
      {user && user.role === "paciente" && <BrandSelector />}

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Si es recepcionista, seleccionar paciente */}
          {isRecepcionista && (
            <Form.Item
              name="pacienteId"
              label="Paciente"
              rules={[{ required: true, message: "Por favor seleccione un paciente" }]}
            >
              <Select placeholder="Seleccione un paciente">
                {currentBrand?.users
                  .filter((u) => u.role === "paciente")
                  .map((patient) => (
                    <Option key={patient.id} value={patient.id}>
                      {patient.nombre} ({patient.email})
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          )}

          {/* Seleccionar área */}
          <Form.Item name="areaId" label="Área" rules={[{ required: true, message: "Por favor seleccione un área" }]}>
            <Select placeholder="Seleccione un área" onChange={handleAreaChange}>
              {areas.map((area) => (
                <Option key={area.id} value={area.id}>
                  {area.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Seleccionar especialista */}
          <Form.Item
            name="especialistaId"
            label="Especialista"
            rules={[{ required: true, message: "Por favor seleccione un especialista" }]}
          >
            <Select placeholder="Seleccione un especialista" disabled={!selectedArea}>
              {specialists.map((specialist) => (
                <Option key={specialist.id} value={specialist.id}>
                  {specialist.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Motivo de consulta */}
          <Form.Item
            name="motivo"
            label="Motivo de la consulta"
            rules={[{ required: true, message: "Por favor ingrese el motivo de la consulta" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* Fecha (solo para recepcionistas) */}
          {isRecepcionista && (
            <Form.Item
              name="fecha"
              label="Fecha y hora"
              rules={[{ required: true, message: "Por favor seleccione una fecha" }]}
            >
              <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          )}

          {/* Adjuntar archivos (opcional) */}
          <Form.Item name="attachments" label="Adjuntar archivos (opcional)">
            <Upload>
              <Button icon={<UploadOutlined />}>Adjuntar autorización u otros documentos</Button>
            </Upload>
          </Form.Item>

          {/* Botones de acción */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isRecepcionista ? "Agendar Cita" : "Solicitar Cita"}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate(PATHS.APPOINTMENTS)}>
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default AppointmentCreateView
