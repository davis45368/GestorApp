"use client"

import { useCallback } from "react"
import { useMedicalRecordStore } from "../context/medicalRecordContext"
import { useBrandStore } from "../context/brandContext"
import { useUserStore } from "../context/userContext"
import type { MedicalRecord } from "../types"

export const useMedicalRecords = () => {
  const {
    getMedicalRecords,
    getMedicalRecordById,
    getMedicalRecordByPatientId,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    loading,
    error,
  } = useMedicalRecordStore()
  const { currentBrand } = useBrandStore()
  const { user } = useUserStore()

  // Verificar si el usuario actual puede acceder a historiales
  const canAccessMedicalRecords = useCallback(() => {
    return user && (user.role === "especialista" || user.role === "admin")
  }, [user])

  // Crear historial asegurando que tenga el brandId correcto
  const createMedicalRecordWithBrand = useCallback(
    async (recordData: Omit<MedicalRecord, "id" | "brandId">) => {
      if (!currentBrand) {
        throw new Error("No hay marca seleccionada")
      }

      if (!canAccessMedicalRecords()) {
        throw new Error("No tiene permisos para crear historiales médicos")
      }

      return await createMedicalRecord({
        ...recordData,
        brandId: currentBrand.brandId,
      })
    },
    [createMedicalRecord, currentBrand, canAccessMedicalRecords],
  )

  // Obtener historiales con verificación de permisos
  const getAccessibleMedicalRecords = useCallback(
    (filters = {}) => {
      if (!canAccessMedicalRecords()) {
        return []
      }

      return getMedicalRecords(filters)
    },
    [getMedicalRecords, canAccessMedicalRecords],
  )

  return {
    medicalRecords: getAccessibleMedicalRecords(),
    loading,
    error,
    canAccessMedicalRecords,
    getMedicalRecordById,
    getMedicalRecordByPatientId,
    createMedicalRecord: createMedicalRecordWithBrand,
    updateMedicalRecord,
    deleteMedicalRecord,
  }
}
