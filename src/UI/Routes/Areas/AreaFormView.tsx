"use client"

import { useState, FC, useEffect } from "react"
import { Form, Input, Button, Card, Spin, Select, App, List, Avatar, Space, Modal } from "antd"
import { useParams, useNavigate } from "react-router-dom"
import { PATHS } from "../../../paths"
import { DeleteOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons"
import useLoading from "@/hooks/useLoading"
import { createArea, getAreaById, updateArea } from "@/querys/area"
import { listSpecialists } from "@/querys/specialist"
import useUserDataStore from "@/context/userDataContext"
import { Specialist } from "@/domain/Specialist"
import { handleErrorMutation } from "@/utils/handleError"

interface AreaFormData {
  name: string
  especialistaIds: string[]
  specialListIdsUpdate: {
    create: [],
    update: {area_id: string, id: string}[],
    delete: string[]
  }
}

const AreaFormView: FC<{ readonly?:boolean }> = ({ readonly=false }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { user } = useUserDataStore()
  const [specialistData, setSpecilistData] = useState<Specialist[]>([])
  const [specialistDelete, setSpecialistDelete] = useState<string[]>([])

  const { notification } = App.useApp()

  const { startLoading, stopLoading, isLoading } = useLoading()

  const areaMutation = id ? updateArea() : createArea()

  const { area, isFetching } = getAreaById(id)
  const { specialists, isLoading: loadingSpecialist } = listSpecialists(`filter[active][_eq]=true`)

  const onFinish = async (values: AreaFormData) => {
    startLoading()

    areaMutation.mutate({
      id: id,
      name: values.name,
      brandId: user?.brandId,
      specialListIdsUpdate: {
        create: [],
        update: specialistData?.filter(item => !area?.area.specialistsIds.includes(item.id))?.map(item => ({ area_id: area?.areaId ?? '', id: item.id  })),
        delete: area?.area?.specialistsIds.filter(item1 => !specialistData.some(item2 => item1 == item2.id)) ?? []
      }
    }, {
      onSuccess: (response) => {
        stopLoading()
        if (!id) {
          navigate(`${PATHS.AREAS}/${response?.data?.data?.id as string}/editar`, { replace: true })
          return
        }

        navigate(-1)
      },
      onError: (error) => {
        stopLoading()
        const errorMessage = handleErrorMutation(error, `Ocurrio un error al ${id ? 'actualizar' : 'crear'} el area`)
        notification.error({ message: errorMessage })
      }
    })
  }

  const addSpecialist = () => {
    const specialistId = form.getFieldValue('addSpecialistId') as string;
    if (!specialistId) return

    const specialistAdd = specialists?.find(item => item.id == specialistId)

    if (!specialistAdd) {
      notification.error({ message: 'Especialista no encontrado' })
      form.setFieldValue('addSpecialistId', undefined)
      return
    }

    if (specialistDelete.includes(specialistId)) {
      setSpecialistDelete(specialistDelete.filter(item => item != specialistId))
    }

    const newSpecialistData = [...specialistData, specialistAdd]
    setSpecilistData(newSpecialistData)

    form.setFieldValue('specialists', newSpecialistData)
    form.setFieldValue('addSpecialistId', undefined)
  }

  const onDelete = (specialistId: string) => {
    if (!specialistId) return

    const inArea = area?.area.specialistsIds?.some(item => specialistId == item)

    if (inArea) {
      Modal.confirm({
        title: '¿Esta seguro de eliminar este especialista?',
        content: 'El especialista sera desvinculado del area',
        cancelText: 'Cancelar',
        cancelButtonProps: { danger: true },
        okText: 'Sí, estoy seguro',
        onOk: () => {
          setSpecialistDelete([...specialistDelete, specialistId])
          const newSpecialistData = specialistData.filter(item => item.id != specialistId)
          setSpecilistData(newSpecialistData)
          form.setFieldValue('specialists', newSpecialistData)
        }
      })
    } else {
      const newSpecialistData = specialistData.filter(item => item.id != specialistId)
      setSpecilistData(newSpecialistData)
      form.setFieldValue('specialists', newSpecialistData)
    }
  }
  useEffect(() => {
    const getListSpecialist = specialists?.filter(item => area?.area.specialistsIds?.includes(item.id))
    setSpecilistData(getListSpecialist ?? [])

    form.setFieldValue('specialists', getListSpecialist)
  }, [specialists])

  if (isFetching && id) {
    return <Spin size="large" tip="Cargando..." />
  }

  return (
    <Card title={`${id ? 'Editar' : 'Crear'} area`}>
      <Form
        disabled={readonly || isLoading} 
        form={form}
        initialValues={area?.area}
        layout="vertical" 
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Nombre del Área"
          rules={[
            { required: true, message: "Por favor ingrese el nombre del área" },
            { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
            { max: 50, message: "El nombre no puede exceder los 50 caracteres" },
            {
              pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
              message: "El nombre solo debe contener letras y espacios",
            },
          ]}
        >
          <Input placeholder="Nombre del área" />
        </Form.Item>
        {id && (
          <Card
            variant="outlined"
            title='Especialistas'
            style={{ marginBottom: '5px' }}
            extra={
              <Space.Compact>
                <Form.Item noStyle name={'addSpecialistId'}>
                  <Select 
                    style={{ width: '250px' }}
                    loading={loadingSpecialist}
                    options={specialists?.filter(item1 => !specialistData.some(item2 => item1.id == item2.id))?.map((item) => ({ label: item.name, value: item.id }))}
                    placeholder={'Agregar especialista'}
                  />
                </Form.Item>
                <Button onClick={addSpecialist} loading={loadingSpecialist} type="primary" icon={<PlusOutlined />} />
              </Space.Compact>
            }
          >
            <Form.List
              name={'specialists'}
            >
              {(fields) => (
                <List
                  style={{ overflow: 'auto', maxHeight: '80vh' }}
                  itemLayout="horizontal"
                  loading={loadingSpecialist}
                >
                  {fields.map((field) => {
                    const specialist = specialistData?.[field.key]
                    return (
                      <List.Item
                        extra={<Space><Button onClick={() => onDelete(specialist?.id ?? '')} type="primary" danger size="small" icon={<DeleteOutlined />} /></Space>}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={<TeamOutlined />} />}
                          title={specialist?.name}
                          description={`Codigo: ${specialist?.doctorCode}`}
                        />
                      </List.Item>
                    )
                  })}
                </List>
              )}
            </Form.List>
          </Card>

        )}
        <Form.Item>
          {!readonly && <Button type="primary" htmlType="submit" loading={isLoading}>
            {!id ? "Crear Área" : "Guardar Cambios"}
          </Button>}
          <Button danger loading={isLoading} disabled={false} style={{ marginLeft: 8 }} onClick={() => navigate(PATHS.AREAS)}>
            {readonly ? 'Cerrar': 'Cancelar'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default AreaFormView