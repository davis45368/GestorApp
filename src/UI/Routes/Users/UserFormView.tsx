"use client"

import { FC } from "react"
import { Form, Input, Button, Card, Spin, App } from "antd"
import { useParams, useNavigate } from "react-router-dom"
import { PATHS } from "../../../paths"
import { useFormValidation } from "../../../hooks/useFormValidation"
import { SelectRole } from "../../Components/Fields/SelectRole"
import { User } from "@/domain/User"
import { createUser, getUserById, updateUser } from "@/querys/user"
import useUserDataStore from "@/context/userDataContext"
import { handleErrorMutation } from "@/utils/handleError"
import useLoading from "@/hooks/useLoading"

const UserFormView: FC<{ readonly?: boolean }> = ({ readonly=false }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useUserDataStore(state => state)
  const { emailRules, nameRules, passwordRules, confirmPasswordRules } = useFormValidation()
  const [form] = Form.useForm<Partial<User>>()
  const { startLoading, isLoading, stopLoading } = useLoading()

  const { user: userData, isFetching } = getUserById(id)

  const { notification } = App.useApp()

  const userMutation= id ? updateUser() : createUser()

  const onFinish = async (values: Partial<User>) => {
    startLoading()

    userMutation.mutate({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      role: values.role,
      brandId: user?.brandId,
      ...(id ? { id: id } : {}),
      ...(!id ? { password: values.password } : {})
    },
    {
      onSuccess: (response) => {
        stopLoading()
        if (!id) {
          navigate(`${PATHS.USERS}/${response?.data?.data?.id as string}/editar`, { replace: true })
          return
        }

        navigate(-1)
      },
      onError: (error) => {
        stopLoading()
        const errorMessage = handleErrorMutation(error, 'Ocurrio un error al crear el usuario')
        notification.error({ message: errorMessage })
      }
    }
  )}

  if (isFetching && id) {
    return <Spin size="large" tip="Cargando..." />
  }

  return (
    <Card title={!id ? "Crear Usuario" : "Editar Usuario"}>
      <Form 
        disabled={readonly || isLoading} 
        form={form} 
        initialValues={userData?.user}
        layout="vertical" 
        onFinish={onFinish}
      >
        <Form.Item name="firstName" label="Nombres" rules={nameRules}>
          <Input placeholder="Nombres" />
        </Form.Item>

        <Form.Item name="lastName" label="Apellidos" rules={nameRules}>
          <Input placeholder="Apellidos" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={emailRules}
        >
          <Input disabled={!!id} placeholder="Email" />
        </Form.Item>

        <Form.Item name="role" label="Rol" rules={[{ required: true, message: "Por favor seleccione un rol" }]}>
          <SelectRole placeholder="Seleccione un rol" />
        </Form.Item>

        {!id && (
          <>
            <Form.Item name="password" label="Contraseña" rules={passwordRules}>
              <Input.Password placeholder="Contraseña" />
            </Form.Item>

            <Form.Item name="confirmPassword" label="Confirmar contraseña" rules={confirmPasswordRules("password")}>
              <Input.Password placeholder="Confirmar contraseña" />
            </Form.Item>
          </>
        )}

        <Form.Item>
          {!readonly && <Button type="primary" htmlType="submit" loading={isLoading}>
            {!id ? "Crear Usuario" : "Guardar Cambios"}
          </Button>}
          <Button disabled={false} loading={isLoading} danger style={{ marginLeft: 8 }} onClick={() => navigate(PATHS.USERS)}>
            {readonly ? 'Cerrar' : 'Cancelar'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default UserFormView
