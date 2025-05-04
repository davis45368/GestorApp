"use client"

import { useState, useEffect, FC } from "react"
import { Form, Input, Button, Card, Select, Typography, Spin, App } from "antd"
import { useParams, useNavigate } from "react-router-dom"
import { useBrandStore } from "../../../context/brandContext"
import { PATHS } from "../../../paths"
import { useFormValidation } from "../../../hooks/useFormValidation"
import type { User, Role, Option } from "../../../types"
import { useUserStore } from "@/context/userContext"

const { Title } = Typography
const { Option } = Select

interface UserFormData {
  nombre: string
  email: string
  role: Role
  password?: string
  confirmPassword?: string
  codigoDoctor?: string
}

const UserFormView: FC<{ readonly?: boolean }> = ({ readonly=false }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentBrand } = useBrandStore()
  const { register } = useUserStore()
  const { emailRules, nameRules, passwordRules, confirmPasswordRules } = useFormValidation()
  const [form] = Form.useForm<UserFormData>()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const { notification } = App.useApp()

  // Cargar datos del usuario si estamos editando
  useEffect(() => {
    if (id && id !== "nuevo" && currentBrand) {
      setLoading(true)

      // Buscar usuario
      const userData = currentBrand.users.find((user) => user.id === id)
      console.log(userData)
      if (userData) {
        setUser(userData)
        form.setFieldsValue({
          nombre: userData.nombre,
          email: userData.email,
          role: userData.role,
        })
      } else {
        setTimeout(() => navigate(PATHS.USERS), 2000)
      }

      setLoading(false)
    }
  }, [id, currentBrand, form, navigate])

  const onFinish = async (values: UserFormData) => {
    if (!currentBrand) return

    setLoading(true)

    try {
      // Simulación de guardado (en una app real, esto sería una llamada a API)
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!id) {
        // Crear nuevo usuario
        // En una app real, esto llamaría a un método del store para crear el usuario
        register({ ...values, brandId: currentBrand.brandId })
 
        // Simulación de éxito
        navigate(PATHS.USERS)
      } else if (user) {
        // Actualizar usuario existente
        // En una app real, esto llamaría a un método del store para actualizar el usuario
        

        // Simulación de éxito
        navigate(PATHS.USERS)
      }
    } catch (err) {
        console.error(err)
        notification.error({ message: "Ocurrio un error al guardar el usuario" })
    } finally {
      setLoading(false)
    }
  }

  if (loading && id) {
    return <Spin size="large" tip="Cargando..." />
  }

  return (
    <div>
      <Title level={2}>{!id ? "Crear Usuario" : "Editar Usuario"}</Title>

      <Card>
        <Form disabled={readonly} initialValues={user ?? {} } form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="nombre" label="Nombre completo" rules={nameRules}>
            <Input placeholder="Nombre completo" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              ...emailRules,
              {
                validator: async (_, value) => {
                  if (!value || (user && user.email === value)) return Promise.resolve()

                  // Verificar si el email ya existe
                  const emailExists = currentBrand?.users.some(
                    (u) => u.email.toLowerCase() === value.toLowerCase() && u.id !== id,
                  )

                  if (emailExists) {
                    return Promise.reject("Este email ya está registrado")
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item name="role" label="Rol" rules={[{ required: true, message: "Por favor seleccione un rol" }]}>
            <Select placeholder="Seleccione un rol">
              <Option value="admin">Administrador</Option>
              <Option value="recepcionista">Recepcionista</Option>
              <Option value="especialista">Especialista</Option>
              <Option value="paciente">Paciente</Option>
            </Select>
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

          {/* <Form.Item
            noStyle
            shouldUpdate={(prev: UserFormData, curr) => prev.role != curr.role}
          >
            {({ getFieldValue }) => {
              const role = getFieldValue('role')
              
              if (role == 'especialista') {
                return (
                  <>
                    <Form.Item name={'codigoDoctor'} label={'Código de especialista'} rules={[{ required: true, message: 'Este campo es requerido' }]}>
                      <Input placeholder="Código de especialista" />
                    </Form.Item>
                  </>
                )
              }
              return null
            }}
          </Form.Item>  */}

          <Form.Item>
            {!readonly && <Button type="primary" htmlType="submit" loading={loading}>
              {!id ? "Crear Usuario" : "Guardar Cambios"}
            </Button>}
            <Button disabled={false} danger style={{ marginLeft: 8 }} onClick={() => navigate(PATHS.USERS)}>
              {readonly ? 'Cerrar' : 'Cancelar'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default UserFormView
