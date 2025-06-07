import { Form, Input, Button, Card, Typography, Alert } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { PATHS } from "../../../paths"
import { changePasswordRecovery } from "@/querys/auth"
import { handleErrorMutation } from "@/utils/handleError"

const { Title, Text } = Typography

const ResetPasswordView = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const navigate = useNavigate()
  const [form] = Form.useForm()
  const changePasswordMutation = changePasswordRecovery()

  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: {
    email: string,
    newPassword: string
    confirmPassword: string
  }) => {
    setLocalError(null)
    setSuccessMessage(null)

    if (values.newPassword !== values.confirmPassword) {
      setLocalError("Las nuevas contraseñas no coinciden.")
      return
    }

    setLoading(true)

    try {
      changePasswordMutation.mutate(
        { token: token ?? '', email: values.email, password: values.newPassword },
        {
          onSuccess: () => {
            setSuccessMessage("¡Contraseña actualizada exitosamente! Redirigiendo al inicio de sesión...")
            form.resetFields()

            // Redirige después de 3 segundos al login
            setTimeout(() => navigate(PATHS.LOGIN), 3000)
          },
          onError: (error) => {
            const messageError = handleErrorMutation(error, "No fue posible cambiar la contraseña.")
            setLocalError(messageError)
            setLoading(false)
          },
        }
      )
    } catch (error) {
      setLocalError("Ocurrió un error inesperado al cambiar la contraseña.")
      setLoading(false)
    }
  }

  return (
    <div className="centered-form" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card className="auth-form" style={{ maxWidth: 400, width: "100%", padding: 24 }}>
        <Title level={2} className="auth-title" style={{ textAlign: "center", marginBottom: 24 }}>
          Cambiar Contraseña
        </Title>

        {localError && (
          <Alert
            description={localError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {successMessage && (
          <Alert
            message="Éxito"
            description={successMessage}
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form form={form} name="changePassword" onFinish={onFinish} layout="vertical">

  <Form.Item
        name="email"
        rules={[
        { required: true, message: "Por favor ingresa tu email" },
        { type: "email", message: "Email no válido" },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>

          <Form.Item
            name="newPassword"
            label="Nueva Contraseña"
            rules={[
              { required: true, message: "Por favor ingresa tu nueva contraseña" },
              { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nueva contraseña" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar Contraseña"
            rules={[{ required: true, message: "Por favor confirma tu nueva contraseña" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirmar nueva contraseña" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="auth-form-button"
            >
              Cambiar Contraseña
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Text type="secondary">
              ¿Recuerdas tu contraseña?
            </Text>{" "}
            <Link to={PATHS.LOGIN}>Inicia sesión</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default ResetPasswordView
