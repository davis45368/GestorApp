"use client"
import { useState } from "react"
import { Table, Button, Input, Select, Typography, Space, Row, Col, Tag, Modal, message, Tooltip } from "antd"
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useBrandStore } from "../../../context/brandContext"
import { PATHS } from "../../../paths"
import type { Role } from "../../../types"

const { Title } = Typography
const { Option } = Select
const { confirm } = Modal

const UsersListView = () => {
  const navigate = useNavigate()
  const { currentBrand } = useBrandStore()

  // Estados locales para filtros
  const [searchText, setSearchText] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | undefined>(undefined)

  // Simulación de eliminación
  const handleDelete = (id: string) => {
    confirm({
      title: "¿Estás seguro de eliminar este usuario?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        // En una aplicación real, esto llamaría a la API
        message.success("Usuario eliminado correctamente")
      },
    })
  }

  // Obtener usuarios de la marca actual
  const users = currentBrand?.users.filter(item => item.role != 'paciente') || []

  // Aplicar filtros
  const filteredUsers = users.filter((user) => {
    // Filtrar por texto
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())

    // Filtrar por rol
    const matchesRole = roleFilter ? user.role === roleFilter : true

    return matchesSearch && matchesRole
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role: Role) => {
        let color = "default"

        switch (role) {
          case "admin":
            color = "red"
            break
          case "recepcionista":
            color = "blue"
            break
          case "especialista":
            color = "green"
            break
          case "paciente":
            color = "purple"
            break
        }

        return <Tag color={color}>{role.toUpperCase()}</Tag>
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record: any) => (
        <Space size="middle" className="table-actions">
          <Tooltip title="Ver">
            <Button icon={<EyeOutlined />} size="middle" onClick={() => navigate(`${PATHS.USERS}/${record.id}`)} />
          </Tooltip>

          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              size="middle"
              type="primary"
              onClick={() => navigate(`${PATHS.USERS}/${record.id}/editar`)}
            />
          </Tooltip>

          {/* <Tooltip title="Eliminar">
            <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
          </Tooltip> */}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Usuarios</Title>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('crear')}>
              Nuevo Usuario
            </Button>
          </Col>
        </Row>
      </div>

      {/* Filtros */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Input
            placeholder="Buscar por nombre o email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Filtrar por rol"
            style={{ width: "100%" }}
            value={roleFilter}
            onChange={setRoleFilter}
            allowClear
          >
            <Option value={undefined}>Todos</Option>
            <Option value="admin">Administrador</Option>
            <Option value="recepcionista">Recepcionista</Option>
            <Option value="especialista">Especialista</Option>
          </Select>
        </Col>
      </Row>

      {/* Tabla de usuarios */}
      <Table columns={columns} dataSource={filteredUsers} rowKey="id" pagination={{ pageSize: 10 }} />
    </div>
  )
}

export default UsersListView
