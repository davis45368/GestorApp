"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { ConfigProvider, Spin, theme, App as AppAntd } from "antd"
import { useBrandStore } from "./context/brandContext"
import { PATHS } from "./paths"

// Layouts
import AuthLayout from "@layouts/AuthLayout"
import DashboardLayout from "@layouts/DashboardLayout"

// Vistas de Auth
import LoginView from "@routes/Auth/LoginView"
import RegisterView from "@routes/Auth/RegisterView"
import VerifyEmailUserView from "./UI/Routes/Auth/VerifyEmailUserView"
import VerifyEmailChangePassword from "./UI/Routes/Auth/VerifyEmailChangePasswordView"

// Vistas de Dashboard
import DashboardView from "@routes/Dashboard/DashboardView"

// Vistas de Citas
import AppointmentsListView from "@routes/Appointments/AppointmentsListView"
import AppointmentFormView from "@routes/Appointments/AppointmentFormView"

// Vistas de Usuarios
import UsersListView from "@routes/Users/UsersListView"

// Vistas de Áreas
import AreasListView from "@routes/Areas/AreasListView"

// Vistas de Especialistas
import SpecialistsListView from "@routes/Specialists/SpecialistsListView"

// Protección de rutas
import ProtectedRoute from "@components/ProtectedRoute"
import RoleProtectedRoute from "@components/RoleProtectedRoute"
import useUserModeStore from "./context/useUserModeStore"
import CustomLayout from "@layouts/Layout"
import UserFormView from "@routes/Users/UserFormView"
import AreaFormView from "@routes/Areas/AreaFormView"
import SpecialistFormView from "@routes/Specialists/SpecialistFormView"
import HomeView from "@layouts/Home"
import useUserDataStore from "./context/userDataContext"
import ChangePasswordView from "./UI/Routes/Auth/ChangePasswordView"
import ResetPasswordView from "./UI/Routes/Auth/ResetPasswordView"
import PatientFormView from "@routes/Patient/PatientFormView"

function App() {
const { loadInitialData, loading } = useBrandStore()
const { user } = useUserDataStore(state => state)
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
		<AppAntd>
			<Routes>
				<Route path={PATHS.LOADING_DATA} element={<HomeView />} />
				
				<Route path={PATHS.MYINFORMATION} element={
					<RoleProtectedRoute allowedRoles={['paciente']}	>
						<CustomLayout />
					</RoleProtectedRoute>
				}>
					<Route index element={<PatientFormView />} />
				</Route>

				{/* Rutas de Citas */}
				<Route path={PATHS.APPOINTMENTS} element={
					<RoleProtectedRoute allowedRoles={['especialista', 'paciente', 'recepcionista']}	>
						<CustomLayout />
					</RoleProtectedRoute>
				}>
					<Route index element={<AppointmentsListView />} />
					<Route path={`${PATHS.APPOINTMENTS}/:id`} element={<AppointmentFormView readonly={true} />} />
					<Route path={`${PATHS.APPOINTMENTS}/:id/editar`} element={<AppointmentFormView readonly={false} />} />
					<Route path={`${PATHS.APPOINTMENTS}/crear`} element={<AppointmentFormView readonly={false} />} />
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
					<Route index path={PATHS.VERIFY_EMAIL_USER} element={<VerifyEmailUserView />} />
					<Route index path={PATHS.VIRIFY_EMAIL_CHANGE_PASSWORD} element={<VerifyEmailChangePassword />} />
					<Route index path={PATHS.CHANGE_PASSWORD_RESET} element={<ResetPasswordView />} />
				</Route>

				{/* Ruta por defecto */}
				<Route path="*" element={<Navigate to={user ? PATHS.HOME : PATHS.LOGIN} replace />} />
			</Routes>
		</AppAntd>
	</ConfigProvider>	
)
}

export default App
