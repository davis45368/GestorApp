import useUserDataStore from "@/context/userDataContext";
import { Patient } from "@/domain/Patient";
import { UserModel } from "@/domain/User";
import { createPatient, getPatientById, updatePatient } from "@/querys/patient";
import { updateUser } from "@/querys/user";
import { handleErrorMutation } from "@/utils/handleError";
import { App, Button, Card, Col, DatePicker, Form, Input, Row, Select, Spin } from "antd";
import { FC } from "react";

interface DataFormValues extends Partial<Patient> {
    lastName: string,
    fisrtsName: string,
    email: string
}

const PatientFormView: FC = () => {
    const [form] = Form.useForm<DataFormValues>()
    const { notification } = App.useApp()
    const { user, setUser } = useUserDataStore(state => state)

    const mutationUser = updateUser()
    const mutationPatient = user?.patientId ? updatePatient() : createPatient()

    const { patient, isLoading } = getPatientById(user?.patientId)
    

    const onFinish = (values: DataFormValues) => {
        const { fisrtsName, lastName, email, ...dataPatient } = values

        const dataUser = { ...user, fisrtsName, lastName, email }

        mutationPatient.mutate({
            ...patient,
            id: patient?.patientId,
            ...dataPatient
        }, 
            {
                onSuccess: (response) => {
                    mutationUser.mutate({
                        ...dataUser,
                        id: user?.id,
                        patientId: response.data?.data?.id,
                    }, {
                        onSuccess: (response) => {
                            setUser(UserModel.ToModel(response.data?.data).user)
                        }, 
                        onError: (error) => {
                            const messageError = handleErrorMutation(error, 'Ocurrio un error al guardar la información')
                            notification.error({ message: messageError })
                        }
                    })
                },
                onError: (error) => {
                    const messageError = handleErrorMutation(error, 'Ocurrio un error al guardar la información')
                    notification.error({ message: messageError })
                }
            }
        )
    }

    const getInitialValues = () => {
        return {
            ...user,
            ...patient?.patient,
        }
    }

    if (isLoading) {
        return (<Spin fullscreen spinning tip='Cargando información...' />)
    }

    return (
        <Card title={'Mi información'}>
            <Form
                form={form}
                layout="vertical"
                initialValues={getInitialValues()}
                onFinish={onFinish}
            >
                <Row gutter={[16, 0]}>
                    <Col span={8}>
                        <Form.Item
                            label={'Nombres'}
                            name={'firstName'}
                            rules={[{ required: true, message: 'Este campo es requerido' }]}
                        >
                            <Input placeholder="Nombres" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Apellidos'}
                            name={'lastName'}
                            rules={[{ required: true, message: 'Este campo es requerido' }]}
                        >
                            <Input placeholder="Apellidos" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Teléfono celular principal'}
                            name={'phonePrimary'}
                            rules={[{ required: true, message: 'Este campo es requerido' }]}
                        >
                            <Input placeholder="Teléfono celular principal'" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Teléfono celular secundario'}
                            name={'phoneSecondary'}
                        >
                            <Input placeholder="Teléfono celular secundario" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Email'}
                            name={'email'}
                            rules={[{ required: true, message: 'Este campo es requerido' }, { type: 'email', message: 'Email no valido' }]}
                            tooltip={'Tenga en cuenta que el modificar este correo, también se modifica el correo de inicio de sección'}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'EPS'}
                            name={'eps'}
                            tooltip='Entidad prestadora de salud'
                        >
                            <Input placeholder="EPS" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Fecha de nacimiento'}
                            rules={[{ required: true, message: 'Este campo es requerido' }]}
                            name={'dateOfBirth'}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Seleccione una fecha de nacimiento" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Genero'}
                            name={'gender'}
                        >
                            <Select options={[{ label: 'Masculino', value: 'M'}, { label: 'Femenino', value: 'F' }, { label: 'Otro', value: 'another' }]} placeholder="Seleccione un genero" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Dirección'}
                            name={'address'}
                        >
                            <Input placeholder="Ingrese su dirección de residencia" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Contacto de emergencia'}
                            name={'emergencyContact'}
                        >
                            <Input placeholder="Contacto de emergencia" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Aseguradora'}
                            name={'insuranceProvider'}
                        >
                            <Input placeholder="Nombre de la aseguradora" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'No. Póliza'}
                            name={'insuranceNumber'}
                        >
                            <Input placeholder="Numero de póliza" />
                        </Form.Item>
                    </Col>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            Guardar información
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
        </Card> 
    )
}

export default PatientFormView