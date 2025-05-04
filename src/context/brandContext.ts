import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { BrandStoreState, Brand } from "../types"

// Importa los datos de las marcas
import hospitalABC from "../data/hospital-abc.json"
import clinicaXYZ from "../data/clinica-xyz.json"

export const useBrandStore = create<BrandStoreState>()(
  persist(
    (set, get) => ({
      brands: [],
      currentBrand: null,
      loading: true,
      error: null,

      loadInitialData: async () => {
        set({ loading: true, error: null })
        try {
          // En una aplicación real, esto sería una petición a la API
          // Simular retraso de carga
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Cargar datos de las marcas
          const brands = [hospitalABC as unknown as Brand, clinicaXYZ as unknown as Brand]
          set({
            brands,
            loading: false,
            // Si no hay marca actual, establecer la primera
            currentBrand: get().currentBrand || brands[0],
          })
        } catch (error) {
          set({ error: "Error al cargar los datos", loading: false })
        }
      },

      setCurrentBrand: (brandId: string) => {
        const { brands } = get()
        const brand = brands.find((b) => b.brandId === brandId)

        if (brand) {
          set({ currentBrand: brand })
        }
      },

      getBrands: () => {
        return get().brands
      },
    }),
    {
      name: "brand-storage",
    },
  ),
)
