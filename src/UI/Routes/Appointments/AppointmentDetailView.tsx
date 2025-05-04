"use client"

import { useEffect, useState } from "react"
import { Card, Descriptions, Button, Typography, Space, Modal, Form, Input, Row, Col, Tag, Spin } from "antd"
import { useParams, useNavigate } from "react-router-dom"
import { useAppointments } from "../../../hooks/useAppointments"
import { useUserStore } from "../../../context/userContext"
import { useBrandStore } from "../../../context/brandContext"
import { useMedicalRecords } from "../../../hooks/useMedicalRecords"
import { PATHS } from "../../../paths"
import StatusBadge from "../../Components/StatusBadge"
import dayjs from "dayjs"

const { Title, Text } = Typography
const { TextArea } = Input

const AppointmentDetailView = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getAppointmentById, changeAppointmentStatus, loading: appointmentLoading } = useAppointments()
  const { user } = useUserStore()
  const { currentBrand } = useBrandStore()
  const {
    getMedicalRecordByPatientId,
    createMedicalRecord,
    canAccessMedicalRecords,
    loading: medicalRecordLoading,
  } = useMedicalRecords()

  const [appointment, setAppointment] = useState<any>(null)
  const [patient, setPatient] = useState<any>(null)
  const [specialist, setSpecialist] = useState<any>(null)
  const [area, setArea] = useState<any>(null)
  const [medicalRecords, setMedicalRecords] = useState<any[]>([])

  const [diagnosisModalVisible, setDiagnosisModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Cargar datos de la cita
  useEffect(() => {
    if (id && currentBrand) {
      const appointmentData = getAppointmentById(id)

      if (appointmentData) {
        setAppointment(appointmentData)

        // Buscar paciente
        const patientData = currentBrand.users.find((user) => user.id === appointmentData.pacienteId)
        setPatient(patientData)

        // Buscar especialista
        const specialistData = currentBrand.especialistas.find((spec) => spec.id === appointmentData.especialistaId)
        setSpecialist(specialistData)

        // Buscar área
        const areaData = currentBrand.areas.find((area) => area.id === appointmentData.areaId)
        setArea(areaData)

        // Cargar historial médico si tiene permisos
        if (canAccessMedicalRecords() && patientData) {
          const records = getMedicalRecordByPatientId(patientData.id)
          setMedicalRecords(records)
        }
      } else {
        navigate(PATHS.APPOINTMENTS)
      }
    }
  }, [id, currentBrand, getAppointmentById, navigate, getMedicalRecordByPatientId, canAccessMedicalRecords])

  // Función para completar la cita con diagnóstico
  const handleCompleteCita = async (values: any) => {
    if (!appointment || !specialist || !patient) return

    try {
      // Crear registro médico
      await createMedicalRecord({
        pacienteId: patient.id,
        especialistaId: specialist.id,
        citaId: appointment.id,
        diagnostico: values.diagnostico,
        notas: values.notas,
        fecha: new Date().toISOString(),
        brandId: currentBrand!.brandId,
      })

      // Actualizar estado de la cita
      await changeAppointmentStatus(appointment.id, "completa")

      // Actualizar la cita en la vista
      const updatedAppointment = getAppointmentById(id!)
      setAppointment(updatedAppointment)

      // Recargar historial médico
      const records = getMedicalRecordByPatientId(patient.id)
      setMedicalRecords(records)

      setDiagnosisModalVisible(false)
    } catch (error) {
      console.error("Error al completar la cita:", error)
    }
  }

  // Función para cancelar la cita
  const handleCancel = async () => {
    if (!appointment) return

    try {
      await changeAppointmentStatus(appointment.id, "cancelada")

      // Actualizar la cita en la vista
      const updatedAppointment = getAppointmentById(id!)
      setAppointment(updatedAppointment)
    } catch (error) {
      console.error("Error al cancelar la cita:", error)
    }
  }

  if (appointmentLoading || !appointment) {
    return <Spin size="large" tip="Cargando..." />
  }

  return (
    <div>
      <Title level={2}>Detalle de Cita</Title>

      <Card title="Información de la Cita" style={{ marginBottom: 24 }}>
        <Descriptions bordered>
          <Descriptions.Item label="ID">{appointment.id}</Descriptions.Item>
          <Descriptions.Item label="Especialidad">{area?.nombre || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Especialista">{specialist?.nombre || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Fecha">{dayjs(appointment.fecha).format("DD/MM/YYYY HH:mm")}</Descriptions.Item>
          <Descriptions.Item label="Estado">
            <StatusBadge status={appointment.estado} />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Información del Paciente" style={{ marginBottom: 24 }}>
        <Descriptions bordered>
          <Descriptions.Item label="Nombre">{patient?.nombre || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Email">{patient?.email || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Tipo de Usuario">
            <Tag color="blue">{patient?.role || "N/A"}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Historial médico (solo para especialistas y admin) */}
      {canAccessMedicalRecords() && (
        <Card title="Historial Médico" style={{ marginBottom: 24 }} loading={medicalRecordLoading}>
          {medicalRecords.length === 0 ? (
            <Text>No hay registros médicos disponibles para este paciente.</Text>
          ) : (
            medicalRecords.map((record, index) => (
              <Card
                key={record.id}
                type="inner"
                title={`Registro ${index + 1} - ${dayjs(record.fecha).format("DD/MM/YYYY")}`}
                style={{ marginBottom: 16 }}
              >
                <Descriptions bordered contentStyle={{ width: '60vh' }}>
                  <Descriptions.Item label="Diagnóstico" span={3}>
                    {record.diagnostico}
                  </Descriptions.Item>
                  <Descriptions.Item label="Notas" span={3}>
                    {record.notas}
                  </Descriptions.Item>
                  <Descriptions.Item label="Especialista">
                    {currentBrand?.especialistas.find((s) => s.id === record.especialistaId)?.nombre || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            ))
          )}
        </Card>
      )}

      {/* Acciones según el rol y estado de la cita */}
      <Row justify="end" gutter={16}>
        <Col>
          <Space>
            {/* Volver */}
            <Button onClick={() => navigate(PATHS.APPOINTMENTS)}>Volver</Button>

            {/* Cancelar cita (admin, recepcionista, paciente con cita agendada) */}
            {appointment.estado === "agendada" &&
              (user?.role === "admin" ||
                user?.role === "recepcionista" ||
                (user?.role === "paciente" && user.id === patient?.id)) && (
                <Button danger onClick={handleCancel}>
                  Cancelar Cita
                </Button>
              )}

            {/* Completar cita (especialista con cita agendada) */}
            {appointment.estado === "agendada" && user?.role === "especialista" && specialist?.userId === user.id && (
              <Button type="primary" onClick={() => setDiagnosisModalVisible(true)}>
                Completar Cita
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {/* Modal para diagnóstico médico */}
      <Modal
        title="Completar Cita - Diagnóstico Médico"
        open={diagnosisModalVisible}
        onCancel={() => setDiagnosisModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCompleteCita}>
          <Form.Item
            name="diagnostico"
            label="Diagnóstico"
            rules={[{ required: true, message: "Por favor ingrese el diagnóstico" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="notas"
            label="Notas y Recomendaciones"
            rules={[{ required: true, message: "Por favor ingrese las notas" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setDiagnosisModalVisible(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">
                Guardar y Completar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AppointmentDetailView
