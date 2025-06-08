import { listMedicalRecords } from "@/querys/medicalRecord";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Spin, Typography } from "antd";
import dayjs from "dayjs";
import { FC, useState } from "react";
import ModalFormMedicalRecord from "./ModalForm";

const ListDetailMedicalRecords: FC<{ appoimentId?: string, specialintId?: string, readonly: boolean }> = ({ appoimentId, specialintId, readonly }) => {

    const { medicalrecords, isLoading, isRefetching, refetch } = listMedicalRecords('filter[_and][0][appointment_id][_eq]='+appoimentId)

    const [modalOpen, setModalOpen] = useState<boolean>(false)
    
    return (
        <Spin spinning={isRefetching}>
            <Card loading={isLoading} title='Historial Médico' extra={<Button disabled={readonly} onClick={() => setModalOpen(true)} type="primary" icon={<PlusOutlined />}>Agregar</Button>}>
                    {medicalrecords?.length == 0 &&
                        <Typography.Text>No hay registros médicos disponibles para este paciente.</Typography.Text>
                    }

                    {medicalrecords?.map((record, index) => {
                        return (
                            <Card
                                key={record.id}
                                type="inner"
                                title={`Registro ${index + 1} - ${dayjs(record.dateCreated).format("YYYY-MM-DD HH:mm")}`}
                                style={{ marginBottom: 16, overflowY: 'auto', maxHeight: '300px' }}
                            >
                                <Descriptions bordered contentStyle={{ width: '60vh' }}>
                                    <Descriptions.Item label="Diagnóstico" span={3}>
                                        {record.diagnostic}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Notas y recomendaciones" span={3}>
                                        {record.notes}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Especialista">
                                        {(record.speciallistId as { id: string, name: string })?.name}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        )
                    })}
            </Card> 

            {modalOpen &&
                <ModalFormMedicalRecord
                    appointmentId={appoimentId ?? ''}
                    specialintId={specialintId ?? ''}
                    onCancel={() => setModalOpen(false)}
                    onSave={() => { void refetch(); setModalOpen(false) }}
                    open={modalOpen}
                />
            }
        </Spin>
    )
}

export default ListDetailMedicalRecords