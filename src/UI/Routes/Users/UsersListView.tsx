"use client"
import { useState } from "react"
import { Table, Button, Input, Typography, Space, Row, Col, Tag, App, Tooltip, Modal } from "antd"
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { PATHS } from "../../../paths"
import type { Role } from "../../../types"
import { deleteUser, listUsers } from "@/querys/user"
import { SelectRole } from "@/UI/Components/Fields/SelectRole"
import useUserDataStore from "@/context/userDataContext"
import useRolesStore from "@/context/rolesContext"
import { handleErrorMutation } from "@/utils/handleError"
import { User } from "@/domain/User"

const { Title } = Typography

const UsersListView = () => {
  const navigate = useNavigate()
  const { user } = useUserDataStore(state => state)
  const deleteUserMutation = deleteUser()
  const { notification } = App.useApp()

  const [searchText, setSearchText] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | undefined>(undefined)

  const { roles } = useRolesStore(state => state)
  const { users, refetch, isLoading, isRefetching } = listUsers(`filter[_and][0][active][_eq]=true&filter[_and][1][brand_id][_eq]=${user?.brandId}&filter[_and][2][role][name][_neq]=paciente${!!searchText ? `&filter[_or][3][first_name][_icontains]=${searchText}&filter[_or][4][last_name][_icontains]=${searchText}&filter[_or][5][email][_icontains]=${searchText}`: '' }${!!roleFilter ? `&filter[_and][${!!searchText ? '6' : '3'}][role]=${roleFilter}` : ''}`)
  // Simulación de eliminación
  const handleDelete = (id: string) => {
    void Modal.confirm({
      title: "¿Estás seguro de eliminar este usuario?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        deleteUserMutation.mutate(id, {
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
      title: "Nombres",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Apellidos",
      dataIndex: "lastName",
      key: "lastName",
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
        const roleData = roles.find(item => item.roleId == role)

        switch (roleData?.role.name?.toLocaleLowerCase()) {
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
        return <Tag color={color}>{roleData?.role.name?.toLocaleUpperCase()}</Tag>
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (record: User) => (
        <Space size="middle" className="table-actions">
          <Tooltip title="Ver">
            <Button type="primary" ghost icon={<EyeOutlined />} size="small" onClick={() => navigate(`${PATHS.USERS}/${record.id}`)} />
          </Tooltip>

          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              onClick={() => navigate(`${PATHS.USERS}/${record.id}/editar`)}
            />
          </Tooltip>

          <Tooltip title="Eliminar">
            <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
          </Tooltip>
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
          <SelectRole
            placeholder="Filtrar por rol"
            style={{ width: "100%" }}
            value={roleFilter}
            onChange={setRoleFilter}
            allowClear
          />
        </Col>
      </Row>

      {/* Tabla de usuarios */}
      <Table loading={isLoading || isRefetching} columns={columns} dataSource={users} rowKey="id" pagination={{ pageSize: 10 }} />
    </div>
  )
}

export default UsersListView
