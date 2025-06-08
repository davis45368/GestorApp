import useRolesStore from "@/context/rolesContext";
import { useUserStore } from "@/context/userContext";
import useUserDataStore from "@/context/userDataContext";
import { Appointment, AppointmentFull } from "@/domain/Appointment";
import { PATHS } from "@/paths";
import { listAppointmentsFull } from "@/querys/appointment";
import { AppointmentStatus, AppointmentStatusOptions } from "@/types/const";
import { SelectArea } from "@/UI/Components/Fields/SelectArea";
import { SelectBrand } from "@/UI/Components/Fields/SelectBrand";
import { SelectSpecialist } from "@/UI/Components/Fields/selectSpecialist";
import StatusTag from "@/UI/Components/StatusBadge";
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Col, Input, Row, Select, Space, Table, Tooltip, Typography } from "antd";
import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface StateFilter {
	searchText?: string,
	appointmentStatus?: string
	appointmentStatusSpecialist?: string
	areaId?: string
	specialistsId?: string
	brandId?: string
	isSpecialist?: string
}

const { Title } = Typography;


const AppointmentsListView: FC = () => {
	const navigate = useNavigate()
	const { userRole } = useRolesStore(state => state)
	const { user } = useUserDataStore(state => state)

	const span = userRole?.role.name == 'especialista' ? 12 : 6
	const [filterState, setFilterState] = useState<StateFilter>({ searchText: undefined, appointmentStatus: undefined, areaId: undefined, specialistsId: undefined, brandId: user?.brandId ?? undefined, isSpecialist: userRole?.role.name == 'especialista' ? user?.id : undefined, appointmentStatusSpecialist: userRole?.role.name == 'especialista' ? 'agendada,completa' : undefined })

	const getFilters = () => {
		const fieldMap: Record<keyof StateFilter, string[] | string> = {
			searchText: 'search=',
			appointmentStatus: ['filter[_and]','[status][_eq]='],
			appointmentStatusSpecialist: ['filter[_and]','[status][_in]='],
			areaId: ['filter[_and]','[area_id][_eq]='],
			brandId: ['filter[_and]','[brand_id][_eq]='],
			specialistsId: ['filter[_and]', '[specialint_id][_eq]='],
			isSpecialist: ['filter[_and]', '[specialint_id][user_id][_eq]=']
		}

		const keys = Object.keys(filterState)
		let filters = 'filter[_and][0][active][_eq]=true'

		keys.forEach((key, index) => {
			const value = filterState[key as keyof StateFilter] as string | undefined
			if (value && value != '') {
				if (key == 'searchText') {
					filters += `&${fieldMap[key as keyof StateFilter] as string}${value}`
				} else {
					filters += `&${fieldMap[key as keyof StateFilter][0] as string}[${index}]${fieldMap[key as keyof StateFilter][1] as string}${value}`
				}
			}
		})

		return filters
	}

	const { appointments, isLoading } = listAppointmentsFull(getFilters()+'&fields=*,area_id.name,area_id.id,specialint_id.id,specialint_id.name')

	// Columnas de la tabla
	const columns = [
		{
			title: "Área",
			dataIndex: "areaId",
			key: "area",
			render: (areaId: AppointmentFull["areaId"]) => {
			  return areaId?.name
			},
		},
		{
			title: "Especialista",
			dataIndex: "specialintId",
			key: "specialintId",
			render: (specialintId: AppointmentFull["specialintId"]) => {
			  return specialintId?.name
			},
		},
		{
			title: "Fecha",
			dataIndex: "date",
			key: "date",
		},
		{
			title: "Estado",
			dataIndex: "status",
			key: "status",
			render: (status: AppointmentStatus) => <StatusTag status={status} />,
		},
		{
			title: "Acciones",
			key: "actions",
			render: (record: Appointment) => (
			<Space size="small" className="table-actions">
				<Tooltip title="Ver detalle">
					<Button
						type="primary"
						icon={<EyeOutlined />}
						size="small"
						ghost
						onClick={() => navigate(`${PATHS.APPOINTMENTS}/${record.id}`)}
					/>
				</Tooltip>

				{(userRole?.role.name != 'especialista' && !([AppointmentStatus.completed, AppointmentStatus.canceled].includes(record.status))) && (
					<Tooltip title="Editar">
						<Button
						icon={<EditOutlined />}
						size="small"
						type="primary"
						onClick={() => navigate(`${PATHS.APPOINTMENTS}/${record.id}/editar`)}
						/>
					</Tooltip>
				)}
			</Space>
			),
		},
	]

	return (
		<>
			<div className="page-header">
				<Row justify={"space-between"} align={'middle'}>
					<Col>
						<Title level={2}>Citas</Title>
					</Col>
					{['paciente', 'recepcionista'].includes(userRole?.role.name ?? '') &&
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

			<Row gutter={[10, 0]} style={{ marginBottom: 16 }}>
				{userRole?.role.name != 'paciente' &&
					<Col span={span}>
						<Input
							placeholder="Buscar por paciente"
							prefix={<SearchOutlined />}
							value={filterState.searchText}
							onChange={(e) => setFilterState({ ...filterState, searchText: e.target.value })}
						/>
					</Col>
				}
				{userRole?.role.name == 'paciente' && 
					<Col span={span}>
						<SelectBrand 
							
							style={{ width: "100%" }} 
							placeholder={'Hospital/Clínica'}
							onChange={(value: string) => setFilterState({ ...filterState, brandId: value })}
						 />
					</Col>
				}
				<Col span={span}>
					<Select
						placeholder="Filtrar por estado"
						style={{ width: "100%" }}
						popupMatchSelectWidth={false}
						value={filterState.appointmentStatus}
						onChange={(value: string) => setFilterState({ ...filterState, appointmentStatus: value })}
						allowClear
						options={AppointmentStatusOptions}
					/>
				</Col>
				{userRole?.role.name != 'especialista' && (
					<>
						<Col span={span}>
							<SelectArea
								placeholder="Filtrar por área"
								style={{ width: "100%" }}
								value={filterState.areaId}
								onChange={(value: string) => setFilterState({ ...filterState, areaId: value })}
								allowClear
							/>
						</Col>
						<Col span={span}>
							<SelectSpecialist
								placeholder="Filtrar por especialista"
								style={{ width: "100%" }}
								value={filterState.specialistsId}
								onChange={(value: string) => setFilterState({ ...filterState, specialistsId: value })}
								allowClear
							/>
						</Col>

					</>
				)}
			</Row>

			<Table
				columns={columns}
				dataSource={appointments}
				rowKey="id"
				loading={isLoading}
				pagination={{ pageSize: 10 }}
			/>
		</>
	)
}

export default AppointmentsListView;