import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SpecialistStoreState, Specialist } from "../types"
import { useBrandStore } from "./brandContext"

export const useSpecialistStore = create<SpecialistStoreState>()(
  persist(
    (set, get) => ({
      specialists: [],
      loading: false,
      error: null,

      getSpecialists: (filters = {}) => {
        const brandStore = useBrandStore.getState()
        const currentBrand = brandStore.currentBrand

        if (!currentBrand) return []

        // Filtrar especialistas por los criterios proporcionados
        return currentBrand.especialistas.filter((specialist) => {
          for (const [key, value] of Object.entries(filters)) {
            if (specialist[key as keyof Specialist] !== value) {
              return false
            }
          }
          return true
        })
      },
      getSpecialistsByArea: (area: string) => {
        const brandStore = useBrandStore.getState()
        const currentBrand = brandStore.currentBrand

        if (!currentBrand) return [] as Specialist[]
        const currentArea = currentBrand.areas.find(item => item.id == area)
        return currentBrand.especialistas.filter((specialist) => currentArea?.especialistaIds.includes(specialist.id))
      },
      getSpecialistById: (id: string) => {
        const brandStore = useBrandStore.getState()
        const currentBrand = brandStore.currentBrand

        if (!currentBrand) return undefined

        return currentBrand.especialistas.find((specialist) => specialist.id === id)
      },

      createSpecialist: async (specialistData) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          // Crear nuevo especialista
          const newSpecialist: Specialist = {
            id: `${currentBrand.brandId}-spec-${currentBrand.especialistas.length + 1}`,
            ...specialistData,
          }

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              return {
                ...brand,
                especialistas: [...brand.especialistas, newSpecialist],
              }
            }
            return brand
          })

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              especialistas: [...currentBrand.especialistas, newSpecialist],
            },
          })

          set({ loading: false })
          return newSpecialist
        } catch (error) {
          set({ error: "Error al crear el especialista", loading: false })
          throw error
        }
      },

      updateSpecialist: async (id, specialistData) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          let updatedSpecialist: Specialist | null = null

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              const updatedSpecialists = brand.especialistas.map((specialist) => {
                if (specialist.id === id) {
                  updatedSpecialist = {
                    ...specialist,
                    ...specialistData,
                  }
                  return updatedSpecialist
                }
                return specialist
              })

              return {
                ...brand,
                especialistas: updatedSpecialists,
              }
            }
            return brand
          })

          if (!updatedSpecialist) {
            set({ error: "Especialista no encontrado", loading: false })
            return null
          }

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              especialistas: currentBrand.especialistas.map((specialist) =>
                specialist.id === id ? { ...specialist, ...specialistData } : specialist,
              ),
            },
          })

          set({ loading: false })
          return updatedSpecialist
        } catch (error) {
          set({ error: "Error al actualizar el especialista", loading: false })
          return null
        }
      },

      deleteSpecialist: async (id) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          // Verificar si el especialista existe
          const specialistExists = currentBrand.especialistas.some((specialist) => specialist.id === id)

          if (!specialistExists) {
            set({ error: "Especialista no encontrado", loading: false })
            return false
          }

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              return {
                ...brand,
                especialistas: brand.especialistas.filter((specialist) => specialist.id !== id),
              }
            }
            return brand
          })

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              especialistas: currentBrand.especialistas.filter((specialist) => specialist.id !== id),
            },
          })

          set({ loading: false })
          return true
        } catch (error) {
          set({ error: "Error al eliminar el especialista", loading: false })
          return false
        }
      },
    }),
    {
      name: "specialist-storage",
    },
  ),
)
