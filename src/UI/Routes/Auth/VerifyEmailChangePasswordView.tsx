"use client"

import { Form, Input, Button, Card, Typography, Alert, Result, Spin } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PATHS } from "../../../paths"
import { handleErrorMutation } from "@/utils/handleError"
import { verifyEmailUserChangePassword } from "@/querys/auth"

const { Title, Text } = Typography

const VerifyEmailChangePasswordView = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const verifyMutation = verifyEmailUserChangePassword()

  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const onFinish = async (values: { email: string }) => {
    setLocalError(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      verifyMutation.mutate(
        { email: values.email },
        {
          onSuccess: (data) => {
            setSuccessMessage("Se ha enviado una notificación a tu correo para el cambio de contraseña. Ahora puedes proceder a cambiar tu clave.")
            setLoading(false)
            // Aquí podrías redirigir después de unos segundos si lo deseas
            // setTimeout(() => navigate(PATHS.RESET_PASSWORD), 3000)
          },
          onError: (error) => {
            const messageError = handleErrorMutation(error, "No fue posible verificar el correo.")
            setLocalError(messageError)
            setLoading(false)
          },
        }
      )
    } catch (error) {
      setLocalError("Error inesperado al verificar el correo.")
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
      <Card style={{ width: 420, padding: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        {loading && <Spin size="large" style={{ display: "flex", justifyContent: "center", marginBottom: 20 }} />}

        {!successMessage ? (
          <>
            <Title level={3} style={{ textAlign: "center" }}>Verificación de Correo</Title>
            <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
              Ingresa tu correo electrónico para verificar tu identidad
            </Text>

            {localError && (
              <Alert message="Error" description={localError} type="error" showIcon style={{ marginBottom: 16 }} />
            )}

            <Form form={form} name="changePassword" onFinish={onFinish} layout="vertical">
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Por favor ingresa tu email" },
                  { type: "email", message: "Email no válido" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Correo electrónico" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Verificar Email
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Link to={PATHS.LOGIN}>Volver al inicio de sesión</Link>
            </div>
          </>
        ) : (
          <Result
            status="success"
            title="¡Verificación completada!"
            subTitle={successMessage}
            extra={[
              <Button type="primary" key="go" onClick={() => navigate(PATHS.LOGIN)}>
                Ir al Login
              </Button>,
            ]}
          />
        )}
      </Card>
    </div>
  )
}

export default VerifyEmailChangePasswordView
