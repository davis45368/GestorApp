import useRolesStore from "@/context/rolesContext";
import useUserDataStore from "@/context/userDataContext";
import { Appointment } from "@/domain/Appointment";
import { Files as CustomFile } from "@/domain/File";
import useLoading from "@/hooks/useLoading";
import { usePatients } from "@/hooks/usePatients";
import { PATHS } from "@/paths";
import { createAppointment, getAppointmentById, updateAppointment } from "@/querys/appointment";
import { createFile, deleteFile } from "@/querys/file";
import { AppointmentStatusOptions } from "@/types/const";
import { SelectArea } from "@/UI/Components/Fields/SelectArea";
import { SelectBrand } from "@/UI/Components/Fields/SelectBrand";
import { SelectSpecialist } from "@/UI/Components/Fields/selectSpecialist";
import { SelectUser } from "@/UI/Components/Fields/SelectUser";
import { handleErrorMutation } from "@/utils/handleError";
import { DeleteOutlined, EyeOutlined, FilePdfOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Avatar, Button, Card, Col, DatePicker, Form, Input, List, Row, Select, Space, Spin, Tooltip, Typography, Upload } from "antd";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const urlApi = import.meta.env.VITE_URL_API;

interface UploadedFile extends Partial<CustomFile> {
    name?: string;
    binary?: ArrayBuffer;
    type?: string
}

const AppointmentFormView: FC<{ readonly: boolean }> = ({ readonly=false }) => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { notification, modal } = App.useApp()
    const { userRole } = useRolesStore(state => state)
    const { user } = useUserDataStore(state => state)
    const { patients, isLoading: isLoadingPatients } = usePatients()

    const { startLoading, stopLoading, isLoading: isLoadingUpLoadFiles } = useLoading()
    const createFileMutation = createFile()
    const deleteFileMutation = deleteFile()

    const [form] = Form.useForm<Partial<Appointment>>()

    const appointmentMutation = id ? updateAppointment() : createAppointment()
    
    const { appointment, isLoading, isRefetching, refetch } = getAppointmentById(id)
    
    const [filesInfo, setFilesInfo] = useState<UploadedFile[] | null>(appointment?.appointment.filesIds ?? null);
    
    const isPatient = userRole?.role.name == 'paciente'

    const beforeUpload = (file: File) => {
        const reader = new FileReader()
        
        reader.onload = () => {
            const result = reader.result;
            if (result instanceof ArrayBuffer) {
                setFilesInfo([...(filesInfo ? filesInfo : []), {
                    name: file.name,
                    binary: result,
                    type: file.type,
                }]);
            } else {
                notification.error({ message: 'Error al leer el archivo en formato binario.' });
            }
        };

        reader.readAsArrayBuffer(file);

        return false
    }

    const removeField = (index: number) => {
        const file = filesInfo?.[index]
        
        if (!file?.id) {
            setFilesInfo(filesInfo?.filter(item => JSON.stringify(item) != JSON.stringify(file)) ?? [])
            return
        }

        modal.confirm({
            title: '¿Esta seguro de eliminar este archivo?',
            content: 'El archivo sera eliminado y no podra ser recuperado',
            onOk: () => {
                deleteFileMutation.mutate(file.id ?? '', {
                    onSuccess: () => {
                        notification.success({ message: 'El archivo fue eliminado exitosamente' })
                    },
                    onError: (error) => {
                        console.log(error)
                        const errorMessage = handleErrorMutation(error, 'Ocurrio un error al guardar la información')
                        notification.error({ message: errorMessage })
                    }
                }
                )
            }
        })
    }

    const onFinish = (values: Partial<Appointment>) => {
        appointmentMutation.mutate({
            id: appointment?.appointmentId,
            ...appointment,
            ...values,
            patientId: values.patientId ?? user?.patientId ?? ''
        }, {
            onSuccess: (response) => {
                notification.success({ message: `Cita ${id ? 'actualizada' : 'creada'} exitosamente` })
                const uploadFiles = filesInfo?.filter(item => !item.id)
                
                if ((uploadFiles?.length ?? 0) > 0) {
                    startLoading()
                    notification.info({ message: `Cargando archivos` })

                    const appointmentId = response.data?.data?.id
                    const folder = patients.find(item => item.id == (values.patientId ?? user?.patientId ?? ''))?.folder_id

                    uploadFiles?.forEach((item, index) => {

                        createFileMutation.mutate({
                            appointment_id: appointmentId,
                            file: new File([item.binary], item.name ?? '', { type: item.type }),
                            folder: folder,
                        }, {
                            onSuccess: () => {
                                if ((uploadFiles.length) == index + 1 ) {
                                    notification.success({ message: `${uploadFiles.length} Archivos cargados exitosamente` })
                                    void refetch()
                                }
                            },
                            onError: (error) => {
                                console.log(error)
                                const errorMessage = handleErrorMutation(error, `Ocurrio un error al cargar el archivo ${item.name}`)
                                notification.error({ message: errorMessage })
                            }
                        })
                    })

                    stopLoading()
                }

                if (!id && response.data.data.id) {
                    navigate(`${PATHS.APPOINTMENTS}/${response.data.data.id}/editar`)
                    return
                }
            },
            onError: (error) => {
                console.log(error)
                const errorMessage = handleErrorMutation(error, 'Ocurrio un error al guardar la información')
                notification.error({ message: errorMessage })
            }
        })
    }

    useEffect(() => {
        if (appointment?.appointment.filesIds) {
            setFilesInfo(appointment.appointment.filesIds)
        }
    }, [appointment]) 

    if (isLoading) {
        return <Spin spinning tip={'Cargando....'} />
    }

    return (
        <Card title={`${id ? 'Editar' : 'Crear'} cita`}>
            <Form
                form={form}
                layout="vertical"
                initialValues={appointment?.appointment}
                onFinish={onFinish}
                disabled={appointmentMutation.isPending || isLoadingUpLoadFiles}
            >
                <Row gutter={[16, 0]}>
                    {isPatient &&
                        <Col span={12}>
                            <Form.Item
                                label={'Hospital/Clínica'}
                                rules={[{ required: true, message: 'Este campo es requerido' }]}
                                name={'brandId'}
                            >
                                <SelectBrand
                                    placeholder='Seleccione un Hospital o Clínica'
                                />
                            </Form.Item>
                        </Col>
                    }
                    {(userRole?.role.name != 'paciente') &&
                        <Col span={12}>
                            <Form.Item
                                label={'Paciente'}
                                rules={[{ required: true, message: 'Este campo es requerido' }]}
                                name={'patientId'}
                            >
                                <SelectUser
                                    disabled={!!id}
                                    role="Paciente"
                                    valueKey="patientId"
                                    placeholder='Seleccione un paciente'
                                />
                            </Form.Item>
                        </Col>
                    }
                    {(isPatient ? id : true)  && 
                        <>
                            <Col span={12}>
                                <Form.Item
                                    name={'areaId'}
                                    label='Area'
                                >   
                                    <SelectArea
                                        allowClear
                                        disabled={isPatient}
                                        placeholder={'Seleccione un area'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prev: Appointment, curr) => curr.areaId != prev.areaId}
                                >
                                    {({ getFieldValue }) => {
                                        const areaId = getFieldValue('areaId') as string
                                        
                                        return (
                                            <Form.Item
                                                name={'specialintId'}
                                                label={'Especialista'}
                                            >
                                                <SelectSpecialist
                                                    allowClear
                                                disabled={isPatient || !areaId}
                                                    areaId={areaId}
                                                    placeholder='Seleccione un especialista'
                                                />
                                            </Form.Item>
                                        )
                                    }}
                                </Form.Item>
                            </Col>
                        </>
                    }
                    <Col span={12}>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prev: Appointment, curr) => curr.areaId != prev.areaId || curr.specialintId != prev.specialintId}
                        >
                            {({ getFieldValue }) => {
                                const areaId = getFieldValue('areaId') as string
                                const specialintId = getFieldValue('specialintId') as string

                                return (
                                    <Form.Item
                                        label='Estado'
                                        name='status'
                                    >
                                        <Select
                                            placeholder='Seleccione un estado'
                                            disabled={(isPatient) || !areaId || !specialintId}
                                            options={AppointmentStatusOptions}
                                        />
                                    </Form.Item>
                                )
                            }}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={'Fecha Hora cita'}
                            name={'date'}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                disabled={isPatient}
                                showTime showSecond={false}
                                placeholder="Fecha y hora de la cita"
                            />
                        </Form.Item>
                    </Col>
                    
                    <Col span={24}>
                        <Form.Item
                            label={'Motivo consulta'}
                            name={'reason'}
                        >
                            <Input.TextArea style={{ height: '5rem' }} placeholder="Ingrese detalladamente el motivo de su consulta" />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Upload
                            multiple={false}
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                        >
                            <Button icon={<UploadOutlined />}>Adjuntar autorización u otros documentos</Button>
                        </Upload>
                    </Col>
                    <Col span={24}>
                        <Form.Item style={{ marginTop: '10px' }}>
                            {!readonly && <Button type="primary" htmlType="submit" loading={isLoading}>
                                {!id ? "Crear cita" : "Guardar cita"}
                            </Button>}
                            <Button danger loading={isLoading} disabled={false} style={{ marginLeft: 8 }} onClick={() => navigate(PATHS.APPOINTMENTS)}>
                                {readonly ? 'Cerrar': 'Cancelar'}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            {isRefetching ? (
                <Spin spinning={isRefetching} />  
                ) : (
                (filesInfo?.length ?? 0) > 0 &&
                    <Card title='Archivos' style={{ margin: '10px 0' }} loading={isLoadingPatients}>
                        <List
                            loading={isLoadingUpLoadFiles}
                            style={{ overflow: 'auto', maxHeight: '350px' }}
                            dataSource={filesInfo ?? []}
                            renderItem={(item, index) => {
                                return (
                                    <List.Item key={index} style={{ width: '100%', margin: 0, padding: 0 }}>
                                        <Row gutter={[2, 0]} align={'middle'} style={{ width: '100%' }}>
                                            <Col span={2}>
                                                <Avatar style={{ width: '40px', height: '40px', marginTop: '10px' }} icon={<FilePdfOutlined />} />
                                            </Col>
                                            <Col span={20}>
                                                <Typography.Title level={5}>{item.id ? item.filenameDownload : item.name}</Typography.Title>
                                            </Col>

                                            <Col span={2} >
                                                <Space align="end" style={{ marginTop: '10px' }}>
                                                    <Tooltip title={'Eliminar'} color="red">
                                                        <Button onClick={() => removeField(index)} size="small" type="primary" danger icon={<DeleteOutlined />} />
                                                    </Tooltip>
                                                    {item.id &&
                                                        <Tooltip title='Ver archivo' color="cyan">
                                                            <Button size="small" onClick={() => window.open(`${urlApi}assets/${item.id}`)} type="primary" icon={<EyeOutlined />} />
                                                        </Tooltip>
                                                    }
                                                </Space>
                                            </Col>

                                        </Row>
                                    </List.Item>
                                )
                            }}
                        />
                    </Card>
                )
            }
            
        </Card>
    )
}

export default AppointmentFormView