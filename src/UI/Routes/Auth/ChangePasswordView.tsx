"use client"

import { Form, Input, Button, Card, Typography, Alert } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUserStore } from "../../../context/userContext"
import { PATHS } from "../../../paths"

const { Title } = Typography

const ChangePasswordView = () => {
  const { user, changePassword, loading, error } = useUserStore()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const onFinish = async (values: {
    email?: string
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    setLocalError(null)
    setSuccessMessage(null)

    if (values.newPassword !== values.confirmPassword) {
      setLocalError("Las nuevas contraseñas no coinciden")
      return
    }

    try {
      // Si el usuario está logueado, usar su ID
      if (user) {
        const success = await changePassword(user.id, values.oldPassword, values.newPassword)

        if (success) {
          setSuccessMessage("Contraseña cambiada correctamente")
          // Redirigir después de un segundo
          setTimeout(() => {
            navigate(PATHS.LOGIN)
          }, 1000)
        } else {
          setLocalError("Error al cambiar la contraseña")
        }
      } else {
        setLocalError("Debe iniciar sesión para cambiar su contraseña")
      }
    } catch (error) {
      setLocalError("Error al cambiar la contraseña")
    }
  }

  return (
    <div className="centered-form">
      <Card className="auth-form">
        <Title level={2} className="auth-title">
          Cambiar Contraseña
        </Title>

        {(error || localError) && (
          <Alert description={error || localError} type="error" showIcon style={{ marginBottom: 16, padding: 5 }} />
        )}

        {successMessage && (
          <Alert message="Éxito" description={successMessage} type="success" showIcon style={{ marginBottom: 16 }} />
        )}

        <Form form={form} name="changePassword" onFinish={onFinish} layout="vertical">
          {!user && (
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Por favor ingresa tu email" },
                { type: "email", message: "Email no válido" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
          )}

          <Form.Item name="oldPassword" rules={[{ required: true, message: "Por favor ingresa tu contraseña actual" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña actual" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Por favor ingresa tu nueva contraseña" },
              { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nueva contraseña" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: "Por favor confirma tu nueva contraseña" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirmar nueva contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="auth-form-button">
              Cambiar Contraseña
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to={PATHS.LOGIN}>Volver al inicio de sesión</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default ChangePasswordView
