"use client"

import { useState } from "react"
import { Table, Button, Input, Select, Typography, Space, Row, Col, Modal, message } from "antd"
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons"
import { useSpecialistStore } from "../../../context/specialistContext"
import { Specialist } from "@/types"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { Option } = Select
const { confirm } = Modal

const SpecialistsListView = () => {
  const { getSpecialists, deleteSpecialist, loading } = useSpecialistStore()

  // Estados locales
  const [searchText, setSearchText] = useState("")
  const [areaFilter, setAreaFilter] = useState<string | undefined>(undefined)
  const specialists = getSpecialists();

  const navigate = useNavigate()

  // Manejar eliminación
  const handleDelete = async (id: string) => {
    confirm({
      title: "¿Estás seguro de eliminar este especialista?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        const success = await deleteSpecialist(id)
        if (success) {
          message.success("Especialista eliminado correctamente")
        } else {
          message.error("Error al eliminar el especialista")
        }
      },
    })
  }


  // Aplicar filtros
  const filteredSpecialists = specialists.filter((specialist) => {
    const matchesSearch = specialist.nombre.toLowerCase().includes(searchText.toLowerCase())
    const matchesArea = areaFilter ? specialist.areaId === areaFilter : true

    return matchesSearch && matchesArea
  })

  // Columnas de la tabla
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <small>{text.substring(text.length - 8)}</small>,
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Código",
      dataIndex: "codigoDoctor",
      key: "codigoDoctor",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (record: Specialist) =>  (
        <Space size="middle" className="table-actions">
          <Button icon={<EyeOutlined />} size="middle" onClick={() => navigate(`${record.id}`)} />
          <Button
            icon={<EditOutlined />}
            size="middle"
            type="primary"
            onClick={() => navigate(`${record.id}/editar`)}
          />
          {/* <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} /> */}
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
        dataSource={filteredSpecialists}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

    </div>
  )
}

export default SpecialistsListView
