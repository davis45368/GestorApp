import useUserDataStore from "@/context/userDataContext";
import { useAreas } from "@/hooks/useAreas";
import { Select, SelectProps } from "antd";
import { FC } from "react";

interface SelectEareaProps extends Omit<SelectProps, "options"> {
    areaId?: string
}

export const SelectArea: FC<SelectEareaProps> = ({ areaId, ...props }) => {
    const { user } = useUserDataStore(state => state)

    const { isLoading, areas} = useAreas()

    const getOptions = () => {
        const options = areas?.map(item => ({
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