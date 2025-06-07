"use client"

import { useState } from "react"
import { Table, Button, Input, Typography, Space, Row, Col } from "antd"
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { PATHS } from "../../../paths"
import useUserDataStore from "@/context/userDataContext"
import { listAreas } from "@/querys/area"
import { Area } from "@/domain/Area"

const { Title } = Typography

const AreasListView = () => {
  const navigate = useNavigate()
  const { user } = useUserDataStore(state => state)

  // Estados locales
  const [searchText, setSearchText] = useState("")

  const { areas, isRefetching, isLoading } = listAreas(`filter[_and][0][active][_eq]=true&filter[_and][1][brand_id][_eq]=${user?.brandId}&search=${searchText}`)

  // Columnas de la tabla
  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Especialistas",
      key: "specialistsIds",
      dataIndex: 'specialistsIds',
      render: (specialistsIds: string[]) => specialistsIds.length,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (record: Area) => (
        <Space size="small" className="table-actions">
          <Button type="primary" ghost icon={<EyeOutlined />} size="small" onClick={() => navigate(`${PATHS.AREAS}/${record.id}`)} />
          <Button
            icon={<EditOutlined />}
            size="small"
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
      <Table columns={columns} dataSource={areas} rowKey="id" loading={isLoading || isRefetching} pagination={{ pageSize: 10 }} />
    </div>
  )
}

export default AreasListView
