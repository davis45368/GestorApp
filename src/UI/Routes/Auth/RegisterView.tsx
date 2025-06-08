"use client"

import { Form, Input, Button, Card, Typography, Alert, Image, notification } from "antd"
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PATHS } from "../../../paths"
import logo from "../../../../assets/GestorAppLogo.png"
import { User } from "@/types"
import { registerUser } from "@/querys/user"
import { login } from "@/querys/auth"
import useUserJWTStore from "@/context/UserDataJWTStore"
import { handleErrorMutation } from "@/utils/handleError"
import { useFormValidation } from "@/hooks/useFormValidation"

const { Title } = Typography

const RegisterView = () => {
	const navigate = useNavigate()
	const [form] = Form.useForm()
	const [localError, setLocalError] = useState<string | null>(null)
	const setJwt = useUserJWTStore(state => state.setJwt)

	const { confirmPasswordRules, passwordRules } = useFormValidation()

	const registerUserMutation = registerUser()

	const onFinish = (values: Pick<User, "email" | "password" | "firstName" | "lastName">) => {
		registerUserMutation.mutate({ email: values.email, firstName: values.firstName, lastName: values.lastName, password: values.password }, {
			onSuccess: () => {
				notification.info({ message: 'Se ha enviado una notificación a su correo para la verificación de la cuenta' })
				navigate(PATHS.LOGIN)
			},
			onError: (error) => {
				const messageError = handleErrorMutation(error, 'Ocurrió un error al iniciar sección')
				setLocalError(messageError)
			}
		})
	}


	return (
		<Card style={{ width: '25vw' }}>
			<Image style={{ marginBottom: '-80px', marginTop: '-60px', marginLeft: '5vw' }} preview={false} src={logo} width={'190px'} />

			<Title level={2} className="auth-title">
				Registro de Paciente
			</Title>

			{(localError) && (
				<Alert description={localError} type="error" showIcon style={{ marginBottom: 16, padding: 5 }} />
			)}

			<Form form={form} name="register" onFinish={onFinish} layout="vertical">
				<Form.Item name="firstName" rules={[{ required: true, message: "Por favor ingresa sus nombres completo" }]}>
					<Input prefix={<UserOutlined />} placeholder="Nombres" />
				</Form.Item>
				<Form.Item name="lastName" rules={[{ required: true, message: "Por favor ingresa sus apellidos completo" }]}>
					<Input prefix={<UserOutlined />} placeholder="Apellidos" />
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
					rules={passwordRules}
				>
					<Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
				</Form.Item>

				<Form.Item name="confirmPassword" rules={confirmPasswordRules('password')}>
					<Input.Password prefix={<LockOutlined />} placeholder="Confirmar contraseña" />
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit" loading={false} className="auth-form-button">
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
