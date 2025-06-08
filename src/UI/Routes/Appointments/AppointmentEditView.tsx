// "use client"

// import { useEffect, useState } from "react"
// import { Form, Button, Select, DatePicker, Card, Typography, Spin, App } from "antd"
// import { useParams, useNavigate } from "react-router-dom"
// import { useAppointments } from "../../../hooks/useAppointments"
// import { useUserStore } from "../../../context/userContext"
// import { useAreaStore } from "../../../context/areaContext"
// import { useSpecialistStore } from "../../../context/specialistContext"
// import { useBrandStore } from "../../../context/brandContext"
// import { PATHS } from "../../../paths"
// import dayjs from "dayjs"

// const { Title } = Typography
// const { Option } = Select

// const AppointmentEditView = () => {
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()
//   const { getAppointmentById, updateAppointment, loading: appointmentLoading } = useAppointments()
//   const { user } = useUserStore()
//   const { getAreas } = useAreaStore()  
//   const { getSpecialistsByArea } = useSpecialistStore()
//   const { currentBrand } = useBrandStore()

//   const areas = getAreas()

//   const [form] = Form.useForm()
//   const [loading, setLoading] = useState(false)
//   const [selectedArea, setSelectedArea] = useState<string | null>(null)
//   const [specialists, setSpecialists] = useState<any[]>([])
//   const [isAdmin, setIsAdmin] = useState(false)

//   const { notification } = App.useApp()

//   // Verificar si el usuario es admin o recepcionista
//   useEffect(() => {
//     if (user) {
//       setIsAdmin(user.role === "admin" || user.role === "recepcionista")
//     }
//   }, [user])

//   // Cargar datos de la cita
//   useEffect(() => {
//     if (id && currentBrand) {
//       setLoading(true)

//       const appointmentData = getAppointmentById(id)

//       if (appointmentData) {
//         // Establecer el área seleccionada
//         setSelectedArea(appointmentData.areaId)

//         // Cargar especialistas del área
//         const areaSpecialists = getSpecialistsByArea(appointmentData.areaId)
//         setSpecialists(areaSpecialists)

//         // Establecer valores del formulario
//         form.setFieldsValue({
//           pacienteId: appointmentData.pacienteId,
//           areaId: appointmentData.areaId,
//           especialistaId: appointmentData.especialistaId,
//           fecha: appointmentData.fecha ? dayjs(appointmentData.fecha) : undefined,
//           estado: appointmentData.estado,
//         })
//       } else {
//         notification.error({ message: "Cita no encontrada"})
//         setTimeout(() => navigate(PATHS.APPOINTMENTS), 2000)
//       }

//       setLoading(false)
//     }
//   }, [id, currentBrand, getAppointmentById, form, navigate, getSpecialistsByArea])

//   // Manejar cambio de área
//   const handleAreaChange = (value: string) => {
//     setSelectedArea(value)
//     const areaSpecialists = getSpecialistsByArea(value)
//     setSpecialists(areaSpecialists)
//     form.setFieldsValue({ especialistaId: undefined })
//   }

//   // Enviar formulario
//   const onFinish = async (values: any) => {
//     if (!id || !currentBrand) return

//     setLoading(true)

//     try {
//       // Actualizar cita
//       await updateAppointment(id, {
//         pacienteId: values.pacienteId,
//         especialistaId: values.especialistaId,
//         areaId: values.areaId,
//         fecha: values.fecha ? values.fecha.toISOString() : undefined,
//         estado: values.estado,
//       })

//       navigate(`${PATHS.APPOINTMENTS}`)
//     } catch (err) {
//       notification.error({ message: "Error al actualizar la cita" })
//       setLoading(false)
//     }
//   }

//   if (loading || appointmentLoading) {
//     return <Spin size="large" tip="Cargando..." />
//   }

//   return (
//     <div>
//       <Title level={2}>Editar Cita</Title>

//       <Card>
//         <Form form={form} layout="vertical" onFinish={onFinish}>
//           {/* Si es admin, permitir cambiar el paciente */}
//           {isAdmin && (
//             <Form.Item
//               name="pacienteId"
//               label="Paciente"
//               rules={[{ required: true, message: "Por favor seleccione un paciente" }]}
//             >
//               <Select placeholder="Seleccione un paciente">
//                 {currentBrand?.users
//                   .filter((u) => u.role === "paciente")
//                   .map((patient) => (
//                     <Option key={patient.id} value={patient.id}>
//                       {patient.nombre} ({patient.email})
//                     </Option>
//                   ))}
//               </Select>
//             </Form.Item>
//           )}

//           {/* Seleccionar área */}
//           <Form.Item name="areaId" label="Área" rules={[{ required: true, message: "Por favor seleccione un área" }]}>
//             <Select placeholder="Seleccione un área" onChange={handleAreaChange}>
//               {areas.map((area) => (
//                 <Option key={area.id} value={area.id}>
//                   {area.nombre}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {/* Seleccionar especialista */}
//           <Form.Item
//             name="especialistaId"
//             label="Especialista"
//             rules={[{ required: true, message: "Por favor seleccione un especialista" }]}
//           >
//             <Select placeholder="Seleccione un especialista" disabled={!selectedArea}>
//               {specialists.map((specialist) => (
//                 <Option key={specialist.id} value={specialist.id}>
//                   {specialist.nombre}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {/* Fecha (solo para admin) */}
//           {isAdmin && (
//             <Form.Item
//               name="fecha"
//               label="Fecha y hora"
//               rules={[
//                 { required: true, message: "Por favor seleccione una fecha" },
//                 {
//                   validator: (_, value) => {
//                     if (!value) return Promise.resolve()

//                     const selectedDate = value.toDate()
//                     const now = new Date()

//                     // Verificar que la fecha no sea en el pasado
//                     if (selectedDate < now) {
//                       return Promise.reject("No se pueden agendar citas en fechas pasadas")
//                     }

//                     // Verificar que la fecha no sea más de 3 meses en el futuro
//                     const threeMonthsLater = new Date()
//                     threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)

//                     if (selectedDate > threeMonthsLater) {
//                       return Promise.reject("No se pueden agendar citas con más de 3 meses de anticipación")
//                     }

//                     // Verificar que sea en horario laboral (8:00 - 18:00)
//                     const hours = selectedDate.getHours()
//                     if (hours < 8 || hours >= 18) {
//                       return Promise.reject("Las citas solo pueden agendarse entre 8:00 y 18:00")
//                     }

//                     // Verificar que no sea fin de semana
//                     const day = selectedDate.getDay()
//                     if (day === 0 || day === 6) {
//                       return Promise.reject("No se pueden agendar citas en fin de semana")
//                     }

//                     return Promise.resolve()
//                   },
//                 },
//               ]}
//             >
//               <DatePicker
//                 showTime
//                 format="DD/MM/YYYY HH:mm"
//                 style={{ width: "100%" }}
//                 disabledDate={(current) => {
//                   // Deshabilitar fechas pasadas y fines de semana
//                   return current && (current < dayjs().startOf("day") || current.day() === 0 || current.day() === 6)
//                 }}
//                 disabledTime={() => ({
//                   disabledHours: () => [
//                     ...Array(7).keys(),
//                     18,19,20,21,22,23
//                   ],
//                 })}
//               />
//             </Form.Item>
//           )}

//           {/* Estado de la cita */}
//           <Form.Item
//             name="estado"
//             label="Estado"
//             rules={[{ required: true, message: "Por favor seleccione un estado" }]}
//           >
//             <Select placeholder="Seleccione un estado">
//               <Option value="pendiente">Pendiente</Option>
//               <Option value="agendada">Agendada</Option>
//               <Option value="completa">Completa</Option>
//               <Option value="cancelada">Cancelada</Option>
//             </Select>
//           </Form.Item>

//           {/* Botones de acción */}
//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading}>
//               Guardar Cambios
//             </Button>
//             <Button danger style={{ marginLeft: 8 }} onClick={() => navigate(`${PATHS.APPOINTMENTS}`)}>
//               Cancelar
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   )
// }
const AppointmentEditView = () => {
  return null
}

export default AppointmentEditView
