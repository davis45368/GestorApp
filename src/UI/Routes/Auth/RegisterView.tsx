"use client"

import { Form, Input, Button, Card, Typography, Alert, Select, Image } from "antd"
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUserStore } from "../../../context/userContext"
import { useBrandStore } from "../../../context/brandContext"
import { PATHS } from "../../../paths"
import logo from "../../../../assets/GestorAppLogo.png"

const { Title } = Typography
const { Option } = Select

const RegisterView = () => {
  const { register, loading, error } = useUserStore()
  const { brands } = useBrandStore()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [localError, setLocalError] = useState<string | null>(null)

  const onFinish = async (values: {
    nombre: string
    email: string
    password: string
    confirmPassword: string
    brandId: string
  }) => {
    setLocalError(null)

    if (values.password !== values.confirmPassword) {
      setLocalError("Las contraseñas no coinciden")
      return
    }

    try {
      const user = await register({
        nombre: values.nombre,
        email: values.email,
        password: values.password,
        brandId: values.brandId,
      })

      if (user) {
        navigate(PATHS.APPOINTMENTS)
      } else {
        setLocalError("Error al registrar usuario")
      }
    } catch (error) {
      setLocalError("Error al registrar usuario")
    }
  }

  return (
      <Card style={{ width: '25vw' }}>
        <Image style={{ marginBottom: '-80px', marginTop: '-60px', marginLeft: '5vw' }} preview={false} src={logo} width={'190px'} />

        <Title level={2} className="auth-title">
          Registro de Paciente
        </Title>

        {(error || localError) && (
          <Alert description={error || localError} type="error" showIcon style={{ marginBottom: 16, padding: 5 }} />
        )}

        <Form form={form} name="register" onFinish={onFinish} layout="vertical">
          <Form.Item name="nombre" rules={[{ required: true, message: "Por favor ingresa tu nombre completo" }]}>
            <Input prefix={<UserOutlined />} placeholder="Nombre completo" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Por favor ingresa tu email" },
              { type: "email", message: "Email no válido" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
              { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item name="confirmPassword" rules={[{ required: true, message: "Por favor confirma tu contraseña" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Confirmar contraseña" />
          </Form.Item>

          <Form.Item name="brandId" rules={[{ required: true, message: "Por favor selecciona un hospital/clínica" }]}>
            <Select placeholder="Selecciona un hospital/clínica">
              {brands.map((brand) => (
                <Option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="auth-form-button">
              Registrarme
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to={PATHS.LOGIN}>Ya tengo una cuenta</Link>
          </div>
        </Form>
      </Card>
  )
}

export default RegisterView
