"use client"

import { useState, useEffect } from "react"
import { Table, Button, Input, Select, Typography, Space, Row, Col, Tooltip } from "antd"
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { Link, useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import { useAppointments } from "../../../hooks/useAppointments"
import { useUserStore } from "../../../context/userContext"
//import { useAreaStore } from "../../../context/areaContext"
import { PATHS } from "../../../paths"
import StatusTag from "../../Components/StatusBadge"
import BrandSelector from "../../Components/BrandSelector"
import type { Appointment, AppointmentStatus } from "../../../types"
import { SelectSpecialist } from "@/UI/Components/Fields/selectSpecialist"
import { SelectArea } from "@/UI/Components/Fields/SelectArea"

const { Title } = Typography
const { Option } = Select

const AppointmentsListView = () => {
  const navigate = useNavigate()
  const { appointments, loading, setAppointmentFilters, deleteAppointment } = useAppointments()
  const { user } = useUserStore()
  //const { getAreas } = useAreaStore()

  // Estados locales para filtros
  const [searchText, setSearchText] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | undefined>(undefined)
  const [areaFilter, setAreaFilter] = useState<string | undefined>(undefined)
  const [specialistFilter, setSpecialistFilter] = useState<string | undefined>(undefined)

  // Aplicar filtros
  useEffect(() => {
    const filters: any = {}

    if (statusFilter) {
      filters.estado = statusFilter
    }

    if (areaFilter) {
      filters.areaId = areaFilter
    }

    if (specialistFilter) {
      filters.especialistaId = specialistFilter
    }

    setAppointmentFilters(filters)
  }, [statusFilter, areaFilter, specialistFilter, setAppointmentFilters])

  // Manejar eliminación de cita
  const handleDelete = async (id: string) => {
    const success = await deleteAppointment(id)
    if (success) {
      // Recargar citas
      setAppointmentFilters({})
    }
  }

  // Columnas de la tabla
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <small>{text.substring(text.length - 8)}</small>,
    },
    {
      title: "Área",
      dataIndex: "areaId",
      key: "area",
      // render: (areaId: string) => {
      //   const area = areas.find((a) => a.id === areaId)
      //   return area ? area.nombre : areaId
      // },
    },
    {
      title: "Especialista",
      dataIndex: "especialistaId",
      key: "especialista",
      // render: (especialistaId: string) => {
      //   const specialist = specialists.find((s) => s.id === especialistaId)
      //   return specialist ? specialist.nombre : especialistaId
      // },
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (status: AppointmentStatus) => <StatusTag status={status} />,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (record: Appointment) => (
        <Space size="small" className="table-actions">
          <Tooltip title="Ver detalle">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => navigate(`${PATHS.APPOINTMENTS}/${record.id}`)}
            />
          </Tooltip>

          {/* Solo admin y recepcionista pueden editar */}
          {user && (user.role === "admin" || user.role === "recepcionista") && (
            <Tooltip title="Editar">
              <Button
                icon={<EditOutlined />}
                size="small"
                type="primary"
                onClick={() => navigate(`${PATHS.APPOINTMENTS}/${record.id}/editar`)}
              />
            </Tooltip>
          )}

          {/* Solo admin puede eliminar */}
          {user && user.role === "admin" && (
            <Tooltip title="Eliminar">
              <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  // Filtrar por búsqueda de texto
  const filteredAppointments = ''

    const selectSpan = user?.role != 'especialista' ? 5 : 6

  return (
    <div>
      <div className="page-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Citas</Title>
          </Col>
          {user?.role != 'especialista' &&
            <Col>
              <Link to={`${PATHS.APPOINTMENTS}/crear`}>
                <Button type="primary" icon={<PlusOutlined />}>
                  Nueva Cita
                </Button>
              </Link>
            </Col>
          }
        </Row>
      </div>

      {/* Selector de marca (solo para pacientes) */}
      {user && user.role === "paciente" && <BrandSelector />}

      {/* Filtros */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={user?.role != 'especialista' ? 9 : 12}>
          <Input
            placeholder="Buscar por especialista o área"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col span={selectSpan}>
          <Select
            placeholder="Filtrar por estado"
            style={{ width: "100%" }}
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
          >
            <Option value="pendiente">Pendiente</Option>
            <Option value="agendada">Agendada</Option>
            <Option value="completa">Completa</Option>
            <Option value="cancelada">Cancelada</Option>
          </Select>
        </Col>
        <Col span={selectSpan}>
          <SelectArea 
            placeholder="Filtrar por área"
            style={{ width: "100%" }}
            value={areaFilter}
            onChange={setAreaFilter}
            allowClear
          />
        </Col>
        {user?.role != 'especialista' &&          
          <Col span={selectSpan}>
            <SelectSpecialist
              placeholder="Filtrar por especialista"
              style={{ width: "100%" }}
              value={specialistFilter}
              onChange={setSpecialistFilter}
              allowClear
            />
          </Col>
        }
      </Row>

      {/* Tabla de citas */}
      <Table
        columns={columns}
        //dataSource={filteredAppointments}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default AppointmentsListView
