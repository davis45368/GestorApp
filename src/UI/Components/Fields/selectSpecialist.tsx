import useUserDataStore from "@/context/userDataContext";
import { useSpecialists } from "@/hooks/useSpecialists";
import { Select, SelectProps } from "antd";
import { FC } from "react";

interface SelectEspecialistProps extends Omit<SelectProps, "options"> {
    areaId?: string
}

export const SelectSpecialist: FC<SelectEspecialistProps> = ({ areaId, ...props }) => {
    const { user } = useUserDataStore(state => state)

    const { isLoading, specialist } = useSpecialists(user?.brandId)

    const getOptions = () => {
        const options = specialist?.filter(item => areaId ? item.areaId == areaId : true)?.map(item => ({
            label: item.name,
            value: item.id
        }))

        return options
    }

    return (
        <Select
            loading={isLoading}
            options={getOptions()}
            popupMatchSelectWidth={false}
            {...props}
        />
    )
}