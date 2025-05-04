"use client"

import { Form, Input, Button, Card, Typography, Alert, Image, Flex, Popover, Descriptions, Table } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUserStore } from "../../../context/userContext"
import { PATHS } from "../../../paths"
import logo from "../../../../assets/GestorAppLogo.png"

const { Title } = Typography

const LoginView = () => {
  const { login, loading, error } = useUserStore()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [localError, setLocalError] = useState<string | null>(null)

  const onFinish = async (values: { email: string; password: string }) => {
    setLocalError(null)
    try {
      const user = await login(values.email, values.password)
      if (user) {
        // Redirigir según el rol
        if (user.role === "paciente") {
          navigate(PATHS.APPOINTMENTS)
        } else {
          navigate(PATHS.DASHBOARD)
        }
      } else {
        setLocalError("Credenciales incorrectas")
      }
    } catch (error) {
      setLocalError("Error al iniciar sesión")
    }
  }

  return (
      <Card style={{ width: '25vw' }} >
        <Image style={{ marginBottom: '-80px', marginTop: '-60px', marginLeft: '5vw' }} preview={false} src={logo} width={'190px'} />

        <Title level={2} className="auth-title">
          Iniciar Sesión
        </Title>
        <Flex align="center" justify="center">
          <Popover placement="leftBottom" trigger={'click'} content={<>
              <Card style={{ width: 'auto', height: 'auto' }}>
                <Table
                  pagination={false}
                  columns={[{ key: '1', title: 'Usuario', dataIndex: 'user', align: 'center' }, { key: '2', title: 'Contraseña', dataIndex: 'password', align: 'center' }, { key: '3', title: 'Tipo', dataIndex: 'type', align: 'center' }]}
                  dataSource={[
                    {
                      user: "pedro@clinica-xyz.com",
                      password: "admin123",
                      type: 'Administrador',
                    },
                    {
                      user: "ana@clinica-xyz.com",
                      password: "admin123",
                      type: "Recepcionista"
                    },
                    {
                      user: "sofia@gmail.com",
                      password: "admin123",
                      type: "Paciente"
                    },
                    {
                      user: "miguel@clinica-xyz.com",
                      password: "admin123",
                      type: "Especialista"
                    },
                  ]}
                />
              </Card>
            </>}>
            <Button type="link" className="auth-title">
              Usuarios de pruebas
            </Button>
          </Popover>
        </Flex>

        {(error || localError) && (
          <Alert description={error || localError} type="error" showIcon style={{ marginBottom: 16, padding: 5 }} />
        )}

        <Form form={form} name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Por favor ingresa tu email" },
              { type: "email", message: "Email no válido" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="auth-form-button">
              Iniciar Sesión
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to={PATHS.REGISTER}>Registrarme como paciente</Link>
            <br />
            <Link to={PATHS.CHANGE_PASSWORD}>Olvidé mi contraseña</Link>
          </div>
        </Form>
      </Card>
  )
}

export default LoginView
