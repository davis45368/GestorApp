import useUserDataStore from "@/context/userDataContext";
import { listUsers } from "@/querys/user";
import { Select, SelectProps } from "antd";
import { FC } from "react";

export const SelectUser: FC<Omit<SelectProps, 'options'>> = (props) => {
    const { user } = useUserDataStore(state => state)

    const { users, isFetching } = listUsers(`filter[_and][0][active][_eq]=true&filter[_and][1][brand_id][_eq]=${user?.brandId}&filter[_and][2][role][name][_eq]=Especialista`)
   
    const getOptions = () => {
        const options = users?.map(item => ({
            label: item.firstName + ' ' + item.lastName,
            value: item.id}
        ))

        return options
    }

    return (
        <Select
            {...props}
            loading={isFetching}
            options={getOptions()}
        />
    )
}