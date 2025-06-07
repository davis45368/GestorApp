"use client"

import { useState, FC } from "react"
import { Form, Input, Button, Card, Typography, Spin, Select, App, List, Avatar } from "antd"
import { useParams, useNavigate } from "react-router-dom"
import { PATHS } from "../../../paths"
import { TeamOutlined } from "@ant-design/icons"
import useLoading from "@/hooks/useLoading"
import { createArea, getAreaById, updateArea } from "@/querys/area"

const { Title } = Typography

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

  const { notification } = App.useApp()

  const { startLoading, stopLoading, isLoading } = useLoading()

  const areaMutation = id ? updateArea() : createArea()

  const { area, isFetching } = getAreaById(id)

  const onFinish = async (values: AreaFormData) => {
    startLoading()

    areaMutation.mutate({
      name: values.name,
      
    })
  }

  if (isFetching && id) {
    return <Spin size="large" tip="Cargando..." />
  }

  return (
    <Card title={`${id ? 'Editar' : 'Crear'} area`}>
      <Form
        disabled={readonly || isLoading} 
        form={form}
        initialValues={area}
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
{/* 
        <Form.Item
          name="especialistaIds"
          label="Especialistas del Área"
          rules={[{ required: true, message: "Por favor ingrese los especialistas del área" }]}
        >
          <Select
            mode="multiple"
            showSearch={false}
            placeholder='Especialistas'
            options={specialist?.map(item => ({ label: item.nombre, value: item.id }))}
          />
        </Form.Item> */}

          {/* {id && <div>
              <Title level={4}>Especialistas</Title>
              {areaSpecialists?.length > 0 ? (
              <List
                  itemLayout="horizontal"
                  dataSource={areaSpecialists}
                  renderItem={(specialist) => (
                  <List.Item>
                      <List.Item.Meta
                      avatar={<Avatar icon={<TeamOutlined />} />}
                      title={specialist.nombre}
                      description={`Código: ${specialist.codigoDoctor}`}
                      />
                  </List.Item>
                  )}
              />
              ) : (
              <p>No hay especialistas asignados a esta área.</p>
              )}
          </div>} */}

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