import { createMedicalRecord } from "@/querys/medicalRecord";
import { handleErrorMutation } from "@/utils/handleError";
import { App, Col, Form, Input, Modal, Row } from "antd";
import { FC } from "react";

interface ModalFormMedicalRecordProps {
    open: boolean,
    onSave: () => void,
    onCancel: () => void
    appointmentId: string
    specialintId: string
}

const ModalFormMedicalRecord: FC<ModalFormMedicalRecordProps> = ({ appointmentId, onCancel, onSave, open, specialintId }) => {
    const [form] = Form.useForm<{ notes: string, diagnostic: string }>()
    const { notification } = App.useApp()

    const createMedicalrecordMutation = createMedicalRecord()

    const onFinish = (values: { notes: string, diagnostic: string }) => {
        createMedicalrecordMutation.mutate({
            notes: values.notes,
            diagnostic: values.diagnostic,
            appointmentId: appointmentId,
            speciallistId: specialintId,
        },
            {
                onSuccess: () => {
                    notification.success({ message: 'Historial creado exitosamente' })
                    void onSave()
                },
                onError: (error) => {
                    const errorMessage = handleErrorMutation(error, 'Ocurrio un error al crear el historial')
                    notification.error({ message: errorMessage })
                }
            }  
        )
    }

    return (
        <Modal
            title={'Agregar un nuevo historial clínico'}
            open={open}
            onOk={form.submit}
            onCancel={onCancel}
            okText='Guardar'
            cancelText='Cancelar'
            loading={createMedicalrecordMutation.isPending}
            cancelButtonProps={{ danger: true }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                disabled={createMedicalrecordMutation.isPending}
            >
                <Row gutter={10}>
                    <Col span={24}>
                        <Form.Item
                            label="Diagnóstico"
                            name={'diagnostic'}
                            rules={[{ required: true, message: 'Este campo es requerido' }]}
                        >
                            <Input placeholder="Ingresa el diagnóstico" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Notas y recomendaciones"
                            name={'notes'}
                            rules={[{ required: true, message: 'Este campo es requerido' }]}
                        >
                         <Input.TextArea placeholder="Ingresa notas y recomendaciones" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalFormMedicalRecord;