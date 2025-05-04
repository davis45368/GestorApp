"use client"

import { useCallback, useState } from "react"
import { useAppointmentStore } from "../context/appointmentContext"
import { useUserStore } from "../context/userContext"
import { useBrandStore } from "../context/brandContext"
import type { Appointment, AppointmentStatus } from "../types"

export const useAppointments = () => {
  const {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    loading,
    error,
  } = useAppointmentStore()
  const { user } = useUserStore()
  const [appointmentFilters, setAppointmentFilters] = useState<Partial<Appointment>>({})

  // Obtener citas filtradas por rol del usuario
  const getFilteredAppointments = useCallback(() => {
    if (!user) return []

    const filters = { ...appointmentFilters }

    // Si es paciente, solo ver sus propias citas
    if (user.role === "paciente") {
      filters.pacienteId = user.id
    }

    // Si es especialista, solo ver las citas asignadas a él
    if (user.role === "especialista") {
      // Aquí debemos obtener el ID del especialista a partir del userId
      // En un caso real, esto podría requerir una consulta adicional
      const userStore = useUserStore.getState()
      const brandStore = useBrandStore.getState()
      const currentBrand = brandStore.currentBrand

      if (currentBrand) {
        const specialist = currentBrand.especialistas.find((spec) => spec.userId === user.id)

        if (specialist) {
          filters.especialistaId = specialist.id
        }
      }
    }

    return getAppointments(filters)
  }, [getAppointments, appointmentFilters, user])

  // Cambiar el estado de una cita
  const changeAppointmentStatus = useCallback(
    async (appointmentId: string, newStatus: AppointmentStatus) => {
      return await updateAppointment(appointmentId, { estado: newStatus })
    },
    [updateAppointment],
  )

  // Solicitar reprogramación (para pacientes)
  const requestReschedule = useCallback(
    async (appointmentId: string) => {
      // En una app real, esto podría crear una solicitud en otra tabla
      // Aquí simplemente cambiamos el estado a pendiente
      return await updateAppointment(appointmentId, { estado: "pendiente" })
    },
    [updateAppointment],
  )

  return {
    appointments: getFilteredAppointments(),
    loading,
    error,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    changeAppointmentStatus,
    requestReschedule,
    setAppointmentFilters,
  }
}
