"use specialist"

import { FC } from "react"
import { Form, Input, Button, Card, Spin, App } from "antd"
import { useParams, useNavigate } from "react-router-dom"
import { PATHS } from "../../../paths"
import useUserDataStore from "@/context/userDataContext"
import { createSpecialist, getSpecialistById, updateSpecialist } from "@/querys/specialist"
import useLoading from "@/hooks/useLoading"
import { SelectUser } from "@/UI/Components/Fields/SelectUser"
import { handleErrorMutation } from "@/utils/handleError"

interface SpecialistFormData {
  nombre: string
  codigoDoctor: string
  userId: string | null
}

const SpecialistFormView: FC<{ readonly?: boolean }> = ({ readonly = false }) => {
  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { user } = useUserDataStore(state => state)
  const { notification } = App.useApp()

  const { isLoading, startLoading, stopLoading } = useLoading()

  const { specialist, isFetching } = getSpecialistById(id)
  const specialistMutation = id ? updateSpecialist() : createSpecialist()
  
  const onFinish = async (values: SpecialistFormData) => {
    startLoading()
    specialistMutation.mutate({
        ...specialist?.specialist,
        ...values,
        brandId: user?.brandId
      }, {
        onSuccess: (response) => {
          stopLoading()
          if (!id) {
            navigate(`${PATHS.SPECIALISTS}/${response?.data?.data?.id as string}/editar`, { replace: true })
            return
          }

          navigate(-1)
        },
        onError: (error) => {
          stopLoading()
          const errorMessage = handleErrorMutation(error, `Ocurrio un error al ${id ? 'actualizar' : 'crear'} el especialista`)
          notification.error({ message: errorMessage })
        }
      }
    )
  }

  if (isFetching && id) {
    return <Spin size="large" tip="Cargando..." />
  }

  return (
    <Card title={!id ? "Crear Especialista" : "Editar Especialista"}>
      <Form 
        form={form}
        layout="vertical" 
        onFinish={onFinish}
        initialValues={specialist?.specialist} 
        disabled={readonly || isLoading}
      >
        <Form.Item
          name="name"
          label="Nombre del Especialista"
          rules={[
            { required: true, message: "Por favor ingrese el nombre del especialista" },
            { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
            { max: 100, message: "El nombre no puede exceder los 100 caracteres" },
            {
              pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/,
              message: "El nombre solo debe contener letras, espacios y puntos",
            },
          ]}
        >
          <Input placeholder="Nombre del especialista" />
        </Form.Item>

        <Form.Item
          name="doctorCode"
          label="Código de Doctor"
          rules={[
            { required: true, message: "Por favor ingrese el código del doctor" },
            { min: 3, message: "El código debe tener al menos 3 caracteres" },
            { max: 20, message: "El código no puede exceder los 20 caracteres" },
            {
              pattern: /^[A-Z0-9-]+$/,
              message: "El código solo debe contener letras mayúsculas, números y guiones",
            },
          ]}
        >
          <Input placeholder="Código del doctor" />
        </Form.Item>

        <Form.Item
          label='Usuario'
          name={'userId'}
          rules={[{ required: true, message: 'Este campo es requerido' }]}
        >
          <SelectUser placeholder='Selecciona un usuario para este especialista' />
        </Form.Item>

        <Form.Item>
          {!readonly &&
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {id ? 'Guardar' : 'Crear' } Especialista
            </Button>
          }
          <Button disabled={false} loading={isLoading} danger style={{ marginLeft: 8 }} onClick={() => navigate(PATHS.SPECIALISTS)}>
            {readonly ? 'Cerrar' : 'Cancelar'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default SpecialistFormView