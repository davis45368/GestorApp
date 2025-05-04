"use client"

import { Select, Typography } from "antd"
import { useEffect } from "react"
import { useBrandStore } from "../../context/brandContext"
import { useUserStore } from "../../context/userContext"

const { Option } = Select
const { Title } = Typography

interface BrandSelectorProps {
  onBrandChange?: (brandId: string) => void
}

const BrandSelector = ({ onBrandChange }: BrandSelectorProps) => {
  const { brands, currentBrand, setCurrentBrand } = useBrandStore()
  const { user } = useUserStore()

  useEffect(() => {
    // Si el usuario tiene una marca asignada y no es paciente, usarla por defecto
    if (user && user.brandId && user.role !== "paciente" && currentBrand?.brandId !== user.brandId) {
      setCurrentBrand(user.brandId)
    }
  }, [user, currentBrand, setCurrentBrand])

  const handleBrandChange = (brandId: string) => {
    setCurrentBrand(brandId)
    if (onBrandChange) {
      onBrandChange(brandId)
    }
  }

  // Si el usuario no es paciente y tiene una marca asignada, no mostrar selector
  if (user && user.role !== "paciente" && user.brandId) {
    return (
      <div>
        <Title level={4}>{currentBrand?.brandName}</Title>
      </div>
    )
  }

  return (
    <div className="brand-selector">
      <Title level={4}>Seleccionar Hospital/Clínica:</Title>
      <Select
        style={{ width: "100%" }}
        placeholder="Seleccione una marca"
        onChange={handleBrandChange}
        value={currentBrand?.brandId}
      >
        {brands.map((brand) => (
          <Option key={brand.brandId} value={brand.brandId}>
            {brand.brandName}
          </Option>
        ))}
      </Select>
    </div>
  )
}

export default BrandSelector
