"use client"

import { Card, Typography, Alert, Image, Button, Result } from "antd"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { verifyEmailUser } from "@/querys/auth"
import { handleErrorMutation } from "@/utils/handleError"
import logo from "@assets/GestorAppLogo.png"
import { PATHS } from "@/paths"
import { resetAllStores } from "@/utils/storeCreate"

const { Paragraph } = Typography

const VerifyEmailUserView = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const navigate = useNavigate()
    const [localError, setLocalError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
    const [noToken, setNoToken] = useState<boolean>(false)

    const verifyMutation = verifyEmailUser()

    useEffect(() => {
        void resetAllStores()

        if (!token) {
            setLocalError("No se proporcionó un token válido.")
            setIsSuccess(false)
            setNoToken(true)
            return
        }

        verifyMutation.mutate({ token }, {
            onSuccess: () => {
                setIsSuccess(true)
                setTimeout(() => {
                    navigate(PATHS.LOGIN)
                }, 3000)
            },
            onError: (error) => {
                const messageError = handleErrorMutation(error, 'Error al verificar el correo.')
                setLocalError(messageError)
                setIsSuccess(false)
            }
        })
    }, [token])

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card style={{ width: 500, textAlign: 'center' }} bordered={false}>
                <Image preview={false} src={logo} width={160} style={{ marginBottom: 24 }} />

                {noToken ? (
                    <Result
                        status="warning"
                        title="Token no encontrado"
                        subTitle="No se proporcionó un token válido para verificar el correo electrónico."
                        extra={[
                            <Button key="home" type="primary" onClick={() => navigate("/")}>
                                Volver al inicio
                            </Button>,
                        ]}
                    />
                ) : isSuccess === null ? (
                    <Paragraph>Cargando verificación...</Paragraph>
                ) : isSuccess === true ? (
                    <Result
                        status="success"
                        title="¡Correo verificado con éxito!"
                        subTitle="Gracias por verificar tu cuenta. Serás redirigido automáticamente."
                    />
                ) : (
                    <Result
                        status="error"
                        title="La verificación del correo falló"
                        subTitle={localError || "Por favor, contacta con el administrador del sistema."}
                        extra={[
                            <Button key="home" type="primary" onClick={() => navigate("/")}>
                                Volver al inicio
                            </Button>,
                        ]}
                    />
                )}
            </Card>
        </div>
    )
}

export default VerifyEmailUserView
