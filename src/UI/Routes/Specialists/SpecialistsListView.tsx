"use client"

import { useState } from "react"
import { Table, Button, Input, Typography, Space, Row, Col, Modal, message, App } from "antd"
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { Specialist } from "@/types"
import { useNavigate } from "react-router-dom"
import useUserDataStore from "@/context/userDataContext"
import { deleteSpecialist, listSpecialists } from "@/querys/specialist"
import { handleErrorMutation } from "@/utils/handleError"

const { Title } = Typography
const { confirm } = Modal

const SpecialistsListView = () => {
  const navigate = useNavigate()
  const { user } = useUserDataStore(state => state)
  const deleteEspecialistMutation = deleteSpecialist()
  const { notification } = App.useApp()

  const [searchText, setSearchText] = useState("")

  const { specialists, isLoading, isRefetching, refetch } = listSpecialists(`filter[_and][0][active][_eq]=true&filter[_and][1][brand_id][_eq]=${user?.brandId}&search=${searchText}`)

  // Manejar eliminación
  const handleDelete = async (id: string) => {
    confirm({
      title: "¿Estás seguro de eliminar este especialista?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: () => {
        deleteEspecialistMutation.mutate(id, {
          onSuccess: () => {
            void refetch()
            notification.success({ message: "Usuario eliminado correctamente" })
          },
          onError: (error) => {
            const errorMessage = handleErrorMutation(error, 'Ocurrio un error al eliminar el usuario')
            notification.error({ message: errorMessage })
          }
        })
      },
    })
  }

  // Columnas de la tabla
  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Código",
      dataIndex: "doctorCode",
      key: "doctorCode",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (record: Specialist) =>  (
        <Space size="small" className="table-actions">
          <Button type="primary" ghost icon={<EyeOutlined />} size="small" onClick={() => navigate(`${record.id}`)} />
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            onClick={() => navigate(`${record.id}/editar`)}
          />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Especialistas</Title>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('crear')}>
              Nuevo Especialista
            </Button>
          </Col>
        </Row>
      </div>

      {/* Filtros */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input
            placeholder="Buscar por nombre"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>

      {/* Tabla de especialistas */}
      <Table
        columns={columns}
        dataSource={specialists}
        rowKey="id"
        loading={isLoading || isRefetching}
        pagination={{ pageSize: 10 }}
      />

    </div>
  )
}

export default SpecialistsListView
