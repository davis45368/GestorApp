"use client"

import { useCallback } from "react"
import { useSpecialistStore } from "../context/specialistContext"
import { useBrandStore } from "../context/brandContext"
import type { Specialist } from "../types"

export const useSpecialists = () => {
  const { getSpecialists, getSpecialistById, createSpecialist, updateSpecialist, deleteSpecialist, loading, error } =
    useSpecialistStore()
  const { currentBrand } = useBrandStore()

  // Crear especialista asegurando que tenga el brandId correcto
  const createSpecialistWithBrand = useCallback(
    async (specialistData: Omit<Specialist, "id" | "brandId">) => {
      if (!currentBrand) {
        throw new Error("No hay marca seleccionada")
      }

      return await createSpecialist({
        ...specialistData,
        brandId: currentBrand.brandId,
      })
    },
    [createSpecialist, currentBrand],
  )

  // Obtener especialistas por área
  const getSpecialistsByArea = useCallback(
    (areaId: string) => {
      return getSpecialists({ areaId })
    },
    [getSpecialists],
  )

  return {
    specialists: getSpecialists(),
    loading,
    error,
    getSpecialistById,
    getSpecialistsByArea,
    createSpecialist: createSpecialistWithBrand,
    updateSpecialist,
    deleteSpecialist,
  }
}
