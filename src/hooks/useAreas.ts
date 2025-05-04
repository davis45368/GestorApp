"use client"

import { useCallback } from "react"
import { useAreaStore } from "../context/areaContext"
import { useBrandStore } from "../context/brandContext"
import type { Area } from "../types"

export const useAreas = () => {
  const { getAreas, getAreaById, createArea, updateArea, deleteArea, loading, error } = useAreaStore()
  const { currentBrand } = useBrandStore()

  // Crear área asegurando que tenga el brandId correcto
  const createAreaWithBrand = useCallback(
    async (areaData: Omit<Area, "id" | "brandId">) => {
      if (!currentBrand) {
        throw new Error("No hay marca seleccionada")
      }

      return await createArea({
        ...areaData,
        brandId: currentBrand.brandId,
        especialistaIds: areaData.especialistaIds || [],
      })
    },
    [createArea, currentBrand],
  )

  return {
    areas: getAreas(),
    loading,
    error,
    getAreaById,
    createArea: createAreaWithBrand,
    updateArea,
    deleteArea,
  }
}
