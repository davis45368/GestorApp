import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { MedicalRecordStoreState, MedicalRecord } from "../types"
import { useBrandStore } from "./brandContext"

export const useMedicalRecordStore = create<MedicalRecordStoreState>()(
  persist(
    (set, get) => ({
      medicalRecords: [],
      loading: false,
      error: null,

      getMedicalRecords: (filters = {}) => {
        const brandStore = useBrandStore.getState()
        const currentBrand = brandStore.currentBrand

        if (!currentBrand) return []

        // Filtrar historiales por los criterios proporcionados
        return currentBrand.historial.filter((record) => {
          for (const [key, value] of Object.entries(filters)) {
            if (record[key as keyof MedicalRecord] !== value) {
              return false
            }
          }
          return true
        })
      },

      getMedicalRecordById: (id: string) => {
        const brandStore = useBrandStore.getState()
        const currentBrand = brandStore.currentBrand

        if (!currentBrand) return undefined

        return currentBrand.historial.find((record) => record.id === id)
      },

      getMedicalRecordByPatientId: (patientId: string) => {
        const brandStore = useBrandStore.getState()
        const currentBrand = brandStore.currentBrand

        if (!currentBrand) return []

        return currentBrand.historial.filter((record) => record.pacienteId === patientId)
      },

      createMedicalRecord: async (recordData) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          // Crear nuevo historial
          const newRecord: MedicalRecord = {
            id: `${currentBrand.brandId}-hist-${currentBrand.historial.length + 1}`,
            ...recordData,
          }

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              return {
                ...brand,
                historial: [...brand.historial, newRecord],
              }
            }
            return brand
          })

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              historial: [...currentBrand.historial, newRecord],
            },
          })

          set({ loading: false })
          return newRecord
        } catch (error) {
          set({ error: "Error al crear el historial médico", loading: false })
          throw error
        }
      },

      updateMedicalRecord: async (id, recordData) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          let updatedRecord: MedicalRecord | null = null

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              const updatedRecords = brand.historial.map((record) => {
                if (record.id === id) {
                  updatedRecord = {
                    ...record,
                    ...recordData,
                  }
                  return updatedRecord
                }
                return record
              })

              return {
                ...brand,
                historial: updatedRecords,
              }
            }
            return brand
          })

          if (!updatedRecord) {
            set({ error: "Historial médico no encontrado", loading: false })
            return null
          }

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              historial: currentBrand.historial.map((record) =>
                record.id === id ? { ...record, ...recordData } : record,
              ),
            },
          })

          set({ loading: false })
          return updatedRecord
        } catch (error) {
          set({ error: "Error al actualizar el historial médico", loading: false })
          return null
        }
      },

      deleteMedicalRecord: async (id) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          // Verificar si el historial existe
          const recordExists = currentBrand.historial.some((record) => record.id === id)

          if (!recordExists) {
            set({ error: "Historial médico no encontrado", loading: false })
            return false
          }

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              return {
                ...brand,
                historial: brand.historial.filter((record) => record.id !== id),
              }
            }
            return brand
          })

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              historial: currentBrand.historial.filter((record) => record.id !== id),
            },
          })

          set({ loading: false })
          return true
        } catch (error) {
          set({ error: "Error al eliminar el historial médico", loading: false })
          return false
        }
      },
    }),
    {
      name: "medical-record-storage",
    },
  ),
)
