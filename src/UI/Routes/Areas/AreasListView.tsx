"use client"

import { useState } from "react"
import { Table, Button, Input, Typography, Space, Row, Col, Modal, message } from "antd"
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useAreaStore } from "../../../context/areaContext"
import { PATHS } from "../../../paths"

const { Title } = Typography
const { confirm } = Modal

const AreasListView = () => {
  const navigate = useNavigate()
  const { getAreas, deleteArea, loading } = useAreaStore()

  // Estados locales
  const [searchText, setSearchText] = useState("")

  // Manejar eliminación
  const handleDelete = async (id: string) => {
    confirm({
      title: "¿Estás seguro de eliminar esta área?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        const success = await deleteArea(id)
        if (success) {
          message.success("Área eliminada correctamente")
        } else {
          message.error("Error al eliminar el área")
        }
      },
    })
  }

  // Aplicar filtros
  const filteredAreas = getAreas()?.filter((area) => area.nombre.toLowerCase().includes(searchText.toLowerCase()))

  // Columnas de la tabla
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <small>{text?.substring(text.length - 8)}</small>,
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Especialistas",
      key: "especialistas",
      render: (_, record: any) => record.especialistaIds.length,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record: any) => (
        <Space size="small" className="table-actions">
          <Button icon={<EyeOutlined />} size="middle" onClick={() => navigate(`${PATHS.AREAS}/${record.id}`)} />
          <Button
            icon={<EditOutlined />}
            size="middle"
            type="primary"
            onClick={() => navigate(`${PATHS.AREAS}/${record.id}/editar`)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Áreas</Title>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('crear')}>
              Nueva Área
            </Button>
          </Col>
        </Row>
      </div>

      {/* Filtros */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Input
            placeholder="Buscar por nombre"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>

      {/* Tabla de áreas */}
      <Table columns={columns} dataSource={filteredAreas} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  )
}

export default AreasListView
