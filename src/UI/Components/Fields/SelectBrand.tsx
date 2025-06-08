import { useBrands } from "@/hooks/useBrand";
import { Select, SelectProps } from "antd";
import { FC } from "react";

interface SelectBrandProps extends Omit<SelectProps, "options"> { }

export const SelectBrand: FC<SelectBrandProps> = (props) => {

    const { isLoading, brands} = useBrands()

    const getOptions = () => {
        const options = brands?.map(item => ({
            label: item.name,
            value: item.id
        }))

        return options
    }

    return (
        <Select
            popupMatchSelectWidth={false}
            loading={isLoading}
            options={getOptions()}
            {...props}
        />
    )
}