import useRolesStore from "@/context/rolesContext";
import { Select, SelectProps } from "antd";
import { FC } from "react";

export const SelectRole: FC<Omit<SelectProps, "options">> = (props) => {
    const roles = useRolesStore(state => state.roles)

    const getOptions = () => {
        const options = roles.map(item => ({
            label: item.role.name.toLocaleUpperCase(),
            value: item.roleId
        }))

        return options
    }

    return (
        <Select
            {...props}
            popupMatchSelectWidth={false}
            options={getOptions()}
        />
    )
}