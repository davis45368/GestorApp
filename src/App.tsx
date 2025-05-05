"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { ConfigProvider, Spin, theme } from "antd"
import { useUserStore } from "./context/userContext"
import { useBrandStore } from "./context/brandContext"
import { PATHS } from "./paths"

// Layouts
import AuthLayout from "./UI/Layouts/AuthLayout"
import DashboardLayout from "./UI/Layouts/DashboardLayout"

// Vistas de Auth
import LoginView from "./UI/Routes/Auth/LoginView"
import RegisterView from "./UI/Routes/Auth/RegisterView"
import ChangePasswordView from "./UI/Routes/Auth/ChangePasswordView"

// Vistas de Dashboard
import DashboardView from "./UI/Routes/Dashboard/DashboardView"

// Vistas de Citas
import AppointmentsListView from "./UI/Routes/Appointments/AppointmentsListView"
import AppointmentDetailView from "./UI/Routes/Appointments/AppointmentDetailView"
import AppointmentCreateView from "./UI/Routes/Appointments/AppointmentCreateView"

// Vistas de Usuarios
import UsersListView from "./UI/Routes/Users/UsersListView"

// Vistas de Áreas
import AreasListView from "./UI/Routes/Areas/AreasListView"
import AreaDetailView from "./UI/Routes/Areas/AreaDetailView"

// Vistas de Especialistas
import SpecialistsListView from "./UI/Routes/Specialists/SpecialistsListView"

// Protección de rutas
import ProtectedRoute from "./UI/Components/ProtectedRoute"
import RoleProtectedRoute from "./UI/Components/RoleProtectedRoute"
import useUserModeStore from "./context/useUserModeStore"
import CustomLayout from "./UI/Layouts/Layout"
import UserFormView from "./UI/Routes/Users/UserFormView"
import AreaFormView from "./UI/Routes/Areas/AreaFormView"
import SpecialistFormView from "./UI/Routes/Specialists/SpecialistFormView"
import AppointmentEditView from "./UI/Routes/Appointments/AppointmentEditView"

function App() {
const { loadInitialData, loading } = useBrandStore()
const { user } = useUserStore()

const { defaultAlgorithm, darkAlgorithm, useToken } = theme;
const { darkMode } = useUserModeStore(state => state);

const token = useToken()?.token;

useEffect(() => {
	loadInitialData()
}, [loadInitialData])

if (loading) {
	return (
	<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
		<Spin size="large" tip="Cargando datos..." />
	</div>
	)
}

return (
	<ConfigProvider
		theme={{
			token: {
				borderRadius: 8,
				paddingLG: 16,
				colorPrimary: token['cyan-5'],
			},
			algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
		}}
	>
		<Routes>
			{/* Rutas de Citas */}
			<Route path={PATHS.APPOINTMENTS} element={
				<RoleProtectedRoute allowedRoles={['especialista', 'paciente', 'recepcionista']}	>
					<CustomLayout />
				</RoleProtectedRoute>
			}>
				<Route index element={<AppointmentsListView />} />
				<Route path={`${PATHS.APPOINTMENTS}/:id`} element={<AppointmentDetailView />} />
				<Route path={`${PATHS.APPOINTMENTS}/:id/editar`} element={<AppointmentEditView />} />
				<Route path={`${PATHS.APPOINTMENTS}/crear`} element={<AppointmentCreateView />} />
			</Route>

			{/* Rutas de Usuarios (solo admin) */}
			<Route path={PATHS.USERS} element={
				<RoleProtectedRoute allowedRoles={["admin"]}>
					<CustomLayout />
				</RoleProtectedRoute>
			}>	
				<Route index element={<UsersListView />} />	
				<Route path={`${PATHS.USERS}/crear`} element={<UserFormView />}	/>
				<Route path={`${PATHS.USERS}/:id`} element={<UserFormView readonly />}	/>
				<Route path={`${PATHS.USERS}/:id/editar`} element={<UserFormView />}	/>
			</Route>

			{/* Rutas de Áreas (solo admin) */}
			<Route path={PATHS.AREAS} element={
				<RoleProtectedRoute allowedRoles={["admin"]}>
					<CustomLayout />
				</RoleProtectedRoute>
			}>	
				<Route index element={<AreasListView />}/>
				<Route path={`${PATHS.AREAS}/crear`} element={<AreaFormView />}/>
				<Route path={`${PATHS.AREAS}/:id/editar`} element={<AreaFormView />}/>
				<Route path={`${PATHS.AREAS}/:id`} element={<AreaFormView readonly />}/>
			</Route>

			{/* Rutas de Especialistas (solo admin) */}
			<Route path={PATHS.SPECIALISTS} element={
				<RoleProtectedRoute allowedRoles={["admin"]}>
					<CustomLayout />
				</RoleProtectedRoute>
			}>	
				<Route index element={<SpecialistsListView />}/>
				<Route path={`${PATHS.SPECIALISTS}/:id`} element={<SpecialistFormView readonly />}/>
				<Route path={`${PATHS.SPECIALISTS}/crear`} element={<SpecialistFormView />}/>
				<Route path={`${PATHS.SPECIALISTS}/:id/editar`} element={<SpecialistFormView />}/>
			</Route>

			{/* Rutas protegidas para dashboard */}
			<Route
				path={PATHS.HOME}
				element={
				<ProtectedRoute>
					<DashboardLayout />
				</ProtectedRoute>
				}
			>
				<Route index element={<Navigate to={PATHS.DASHBOARD} replace />} />
				<Route
					path={PATHS.DASHBOARD}
					element={
						<RoleProtectedRoute allowedRoles={["admin", "recepcionista", "especialista"]}>
						<DashboardView />
						</RoleProtectedRoute>
					}
				/>

			</Route>

			<Route element={<AuthLayout />}>
				<Route index path={PATHS.LOGIN} element={<LoginView />} />
				<Route path={PATHS.REGISTER} element={<RegisterView />} />
				<Route path={PATHS.CHANGE_PASSWORD} element={<ChangePasswordView />} />
			</Route>

			{/* Ruta por defecto */}
			<Route path="*" element={<Navigate to={user ? PATHS.HOME : PATHS.LOGIN} replace />} />
		</Routes>
	</ConfigProvider>	
)
}

export default App
