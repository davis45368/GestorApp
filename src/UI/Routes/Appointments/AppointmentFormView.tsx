import useRolesStore from "@/context/rolesContext";
import { Appointment } from "@/domain/Appointment";
import { AppointmentStatusOptions } from "@/types/const";
import { SelectArea } from "@/UI/Components/Fields/SelectArea";
import { SelectBrand } from "@/UI/Components/Fields/SelectBrand";
import { SelectSpecialist } from "@/UI/Components/Fields/selectSpecialist";
import { SelectUser } from "@/UI/Components/Fields/SelectUser";
import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Card, Col, DatePicker, Form, Input, List, Row, Select, Upload } from "antd";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";

interface UploadedFile {
    name: string;
    binary?: ArrayBuffer;
    id?: string
}


const AppointmentFormView: FC = () => {
    const { id } = useParams<{ id: string }>()
    const { notification } = App.useApp()
    const [form] = Form.useForm()
    
    const [filesInfo, setFilesInfo] = useState<UploadedFile[] | null>(null);

    const { userRole } = useRolesStore(state => state)
    
    const isPatient = userRole?.role.name == 'paciente'

    const beforeUpload = (file: File) => {
        console.log(" file --->", file)
        const reader = new FileReader()
        
        reader.onload = () => {
            const result = reader.result;
            if (result instanceof ArrayBuffer) {
                console.log("result --->", result)
                setFilesInfo([...(filesInfo ? filesInfo : []), {
                    name: file.name,
                    binary: result,
                }]);
                notification.success({ message: `Archivo "${file.name}" cargado correctamente.` });
            } else {
                notification.error({ message: 'Error al leer el archivo en formato binario.' });
            }
        };

        reader.readAsArrayBuffer(file);

        return false
    }

    return (
        <Card title={`${id ? 'Editar' : 'Crear'} cita`}>
            <Form
                form={form}
                layout="vertical"
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
                                                name={'specialistId'}
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
                            shouldUpdate={(prev: Appointment, curr) => curr.areaId != prev.areaId || curr.specialistId != prev.specialistId}
                        >
                            {({ getFieldValue }) => {
                                const areaId = getFieldValue('areaId') as string
                                const specialintId = getFieldValue('specialistId') as string

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
                        >
                            <Input.TextArea style={{ height: '5rem' }} placeholder="Ingrese detalladamente el motivo de su consulta" />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Upload
                            multiple={false}
                            showUploadList={true}
                            beforeUpload={beforeUpload}
                            //onRemove={handleRemove}
                        >
                            <Button icon={<UploadOutlined />}>Adjuntar autorización u otros documentos</Button>
                        </Upload>
                    </Col>
                </Row>
            </Form>
        </Card>
    )
}

export default AppointmentFormView