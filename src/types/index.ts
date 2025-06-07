// Definición de tipos para los modelos

export type Role = "admin" | "recepcionista" | "especialista" | "paciente"

export type AppointmentStatus = "pendiente" | "agendada" | "completa" | "cancelada"

export interface User {
  id: string
  lastName: string
  firstName: string
  email: string
  password: string
  role: Role
  brandId: string[]
}

export interface Area {
  id: string
  nombre: string
  brandId: string
  especialistaIds: string[]
}

export interface Specialist {
  id: string
  nombre: string
  codigoDoctor: string
  areaId: string
  userId: string | null
  brandId: string
}

export interface Appointment {
  id: string
  pacienteId: string
  especialistaId: string
  areaId: string
  fecha: string
  estado: AppointmentStatus
  brandId: string
}

export interface MedicalRecord {
  id: string
  pacienteId: string
  especialistaId: string
  citaId: string | null
  diagnostico: string
  notas: string
  fecha: string
  brandId: string
}

export interface Brand {
  brandId: string
  brandName: string
  users: User[]
  areas: Area[]
  especialistas: Specialist[]
  citas: Appointment[]
  historial: MedicalRecord[]
}

// Estado global para cada store
export interface UserState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface BrandState {
  brands: Brand[]
  currentBrand: Brand | null
  loading: boolean
  error: string | null
}

export interface UserStoreState extends UserState {
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
  register: (userData: Omit<User, "id"> & { password: string; brandId: string }) => Promise<User | null>
  changePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<boolean>
}

export interface BrandStoreState extends BrandState {
  loadInitialData: () => Promise<void>
  setCurrentBrand: (brandId: string) => void
  getBrands: () => Brand[]
}

export interface AppointmentStoreState {
  appointments: Appointment[]
  loading: boolean
  error: string | null
  getAppointments: (filters?: Partial<Appointment>) => Appointment[]
  getAppointmentById: (id: string) => Appointment | undefined
  createAppointment: (appointment: Omit<Appointment, "id">) => Promise<Appointment>
  updateAppointment: (id: string, appointmentData: Partial<Appointment>) => Promise<Appointment | null>
  deleteAppointment: (id: string) => Promise<boolean>
}

export interface AreaStoreState {
  areas: Area[]
  loading: boolean
  error: string | null
  getAreas: (filters?: Partial<Area>) => Area[]
  getAreaById: (id: string) => Area | undefined
  createArea: (area: Pick<Area, 'nombre' | 'especialistaIds'>) => Promise<Area>
  updateArea: (id: string, areaData: Partial<Area>) => Promise<Area | null>
  deleteArea: (id: string) => Promise<boolean>
}

export interface SpecialistStoreState {
  specialists: Specialist[]
  loading: boolean
  error: string | null
  getSpecialists: (filters?: Partial<Specialist>) => Specialist[]
  getSpecialistsByArea: (area: string) => Specialist[]
  getSpecialistById: (id: string) => Specialist | undefined
  createSpecialist: (specialist: Omit<Specialist, "id">) => Promise<Specialist>
  updateSpecialist: (id: string, specialistData: Partial<Specialist>) => Promise<Specialist | null>
  deleteSpecialist: (id: string) => Promise<boolean>
}

export interface MedicalRecordStoreState {
  medicalRecords: MedicalRecord[]
  loading: boolean
  error: string | null
  getMedicalRecords: (filters?: Partial<MedicalRecord>) => MedicalRecord[]
  getMedicalRecordById: (id: string) => MedicalRecord | undefined
  getMedicalRecordByPatientId: (patientId: string) => MedicalRecord[]
  createMedicalRecord: (record: Omit<MedicalRecord, "id">) => Promise<MedicalRecord>
  updateMedicalRecord: (id: string, recordData: Partial<MedicalRecord>) => Promise<MedicalRecord | null>
  deleteMedicalRecord: (id: string) => Promise<boolean>
}

export type Option = { label: string, value: string | number }