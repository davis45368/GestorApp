import useUserDataStore from "@/context/userDataContext";
import useUserJWTStore from "@/context/UserDataJWTStore";
import { useRoles } from "@/hooks/useRoles";
import { PATHS } from "@/paths";
import { getUserById } from "@/querys/user";
import { Result, Spin } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
    const navigate = useNavigate()
    const { userId } = useUserJWTStore(state => state)
    const { setUser, user } = useUserDataStore(state => state)
    const { isLoading, userRole } = useRoles(userId)

    const { isLoading: isLoadingUser, isError, user: userModel } = getUserById(userId)

    if (isError) {
        return <Result status={'error'} title='Ocurrio un error al cargar la configuracion' />
    }

    if (isLoading || isLoadingUser) {
        return <Spin fullscreen spinning tip={'Cargando configuración...'} />
    }

    if (!isLoadingUser && !!userModel && !user) setUser(userModel.user)
    if (!isLoading && !!user) {
        if (userRole?.role.name.toLocaleLowerCase()?.includes('paciente')) {
            navigate(`${PATHS.APPOINTMENTS}`, { replace: true })
        } else {
            navigate(`${PATHS.DASHBOARD}`, { replace: true })
        }
    }

    return <></>
}
export default Home
