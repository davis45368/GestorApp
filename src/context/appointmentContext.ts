import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AppointmentStoreState, Appointment } from "../types"
import { useBrandStore } from "./brandContext"

export const useAppointmentStore = create<AppointmentStoreState>()(
  persist(
    (set, get) => ({
      appointments: [],
      loading: false,
      error: null,

      getAppointments: (filters = {}) => {
        const brandStore = useBrandStore.getState()
        const currentBrand = brandStore.currentBrand

        if (!currentBrand) return []

        // Filtrar citas por los criterios proporcionados
        return currentBrand.citas.filter((appointment) => {
          for (const [key, value] of Object.entries(filters)) {
            if (appointment[key as keyof Appointment] !== value) {
              return false
            }
          }
          return true
        })
      },

      getAppointmentById: (id: string) => {
        const brandStore = useBrandStore.getState()
        const currentBrand = brandStore.currentBrand

        if (!currentBrand) return undefined

        return currentBrand.citas.find((appointment) => appointment.id === id)
      },

      createAppointment: async (appointmentData) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          // Crear nueva cita
          const newAppointment: Appointment = {
            id: `${currentBrand.brandId}-cita-${currentBrand.citas.length + 1}`,
            ...appointmentData,
          }

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              return {
                ...brand,
                citas: [...brand.citas, newAppointment],
              }
            }
            return brand
          })

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              citas: [...currentBrand.citas, newAppointment],
            },
          })

          set({ loading: false })
          return newAppointment
        } catch (error) {
          set({ error: "Error al crear la cita", loading: false })
          throw error
        }
      },

      updateAppointment: async (id, appointmentData) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          let updatedAppointment: Appointment | null = null

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              const updatedAppointments = brand.citas.map((appointment) => {
                if (appointment.id === id) {
                  updatedAppointment = {
                    ...appointment,
                    ...appointmentData,
                  }
                  return updatedAppointment
                }
                return appointment
              })

              return {
                ...brand,
                citas: updatedAppointments,
              }
            }
            return brand
          })

          if (!updatedAppointment) {
            set({ error: "Cita no encontrada", loading: false })
            return null
          }

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              citas: currentBrand.citas.map((appointment) =>
                appointment.id === id ? { ...appointment, ...appointmentData } : appointment,
              ),
            },
          })

          set({ loading: false })
          return updatedAppointment
        } catch (error) {
          set({ error: "Error al actualizar la cita", loading: false })
          return null
        }
      },

      deleteAppointment: async (id) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          // Verificar si la cita existe
          const appointmentExists = currentBrand.citas.some((appointment) => appointment.id === id)

          if (!appointmentExists) {
            set({ error: "Cita no encontrada", loading: false })
            return false
          }

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              return {
                ...brand,
                citas: brand.citas.filter((appointment) => appointment.id !== id),
              }
            }
            return brand
          })

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              citas: currentBrand.citas.filter((appointment) => appointment.id !== id),
            },
          })

          set({ loading: false })
          return true
        } catch (error) {
          set({ error: "Error al eliminar la cita", loading: false })
          return false
        }
      },
    }),
    {
      name: "appointment-storage",
    },
  ),
)
