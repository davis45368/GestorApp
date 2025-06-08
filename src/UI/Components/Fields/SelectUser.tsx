import useUserDataStore from "@/context/userDataContext";
import { User } from "@/domain/User";
import { listUsers } from "@/querys/user";
import { Select, SelectProps } from "antd";
import { FC } from "react";

interface SelectUserProps extends Omit<SelectProps, 'options'> {
    role: string
    valueKey?: string
}

export const SelectUser: FC<SelectUserProps> = ({ role, valueKey='id', ...props}) => {
    const { user } = useUserDataStore(state => state)

    const { users, isFetching } = listUsers(`filter[_and][0][active][_eq]=true&filter[_and][2][role][name][_eq]=${role}${role != 'Paciente' ? `&filter[_and][1][brand_id][_eq]=${user?.brandId}` : '&filter[_and][1][patient_id][_nnull]=true'}`)
   
    const getOptions = () => {
        const options = users?.map(item => ({
            label: item.firstName + ' ' + item.lastName,
            value: item?.[valueKey as keyof User]}
        ))

        return options
    }

    return (
        <Select
            {...props}
            loading={isFetching}
            popupMatchSelectWidth={false}
            options={getOptions()}
        />
    )
}