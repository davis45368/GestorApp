import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AreaStoreState, Area } from "../types"
import { useBrandStore } from "./brandContext"

export const useAreaStore = create<AreaStoreState>()(
  persist(
    (set, get) => ({
      areas: [],
      loading: false,
      error: null,

      getAreas: (filters = {}) => {
        const brandStore = useBrandStore.getState()
        const currentBrand = brandStore.currentBrand

        if (!currentBrand) return []
  
        // Filtrar áreas por los criterios proporcionados
        return currentBrand.areas.filter((area) => {
          for (const [key, value] of Object.entries(filters)) {
            if (area[key as keyof Area] !== value) {
              return false
            }
          }
          return true
        })
      },

      getAreaById: (id: string) => {
        const brandStore = useBrandStore.getState()
        const currentBrand = brandStore.currentBrand

        if (!currentBrand) return undefined

        return currentBrand.areas.find((area) => area.id === id)
      },

      createArea: async (areaData) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          // Crear nueva área
          const newArea: Area = {
            id: `${currentBrand.brandId}-area-${currentBrand.areas.length + 1}`,
            ...areaData,
          }

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              return {
                ...brand,
                areas: [...brand.areas, newArea],
              }
            }
            return brand
          })

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              areas: [...currentBrand.areas, newArea],
            },
          })

          set({ loading: false })
          return newArea
        } catch (error) {
          set({ error: "Error al crear el área", loading: false })
          throw error
        }
      },

      updateArea: async (id, areaData) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          let updatedArea: Area | null = null

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              const updatedAreas = brand.areas.map((area) => {
                if (area.id === id) {
                  updatedArea = {
                    ...area,
                    ...areaData,
                  }
                  return updatedArea
                }
                return area
              })

              return {
                ...brand,
                areas: updatedAreas,
              }
            }
            return brand
          })

          if (!updatedArea) {
            set({ error: "Área no encontrada", loading: false })
            return null
          }

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              areas: currentBrand.areas.map((area) => (area.id === id ? { ...area, ...areaData } : area)),
            },
          })

          set({ loading: false })
          return updatedArea
        } catch (error) {
          set({ error: "Error al actualizar el área", loading: false })
          return null
        }
      },

      deleteArea: async (id) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición a la API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const currentBrand = brandStore.currentBrand

          if (!currentBrand) {
            throw new Error("No hay marca seleccionada")
          }

          // Verificar si el área existe
          const areaExists = currentBrand.areas.some((area) => area.id === id)

          if (!areaExists) {
            set({ error: "Área no encontrada", loading: false })
            return false
          }

          // Actualizar el store de marcas
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === currentBrand.brandId) {
              return {
                ...brand,
                areas: brand.areas.filter((area) => area.id !== id),
              }
            }
            return brand
          })

          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...currentBrand,
              areas: currentBrand.areas.filter((area) => area.id !== id),
            },
          })

          set({ loading: false })
          return true
        } catch (error) {
          set({ error: "Error al eliminar el área", loading: false })
          return false
        }
      },
    }),
    {
      name: "area-storage",
    },
  ),
)
