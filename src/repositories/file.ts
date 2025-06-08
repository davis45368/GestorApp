import axios from 'axios';
import { FileDTO, FileDtoCreate, FileModel } from '@/domain/File';

export class ImplementationFileRepository {
    protected readonly baseUrl: string = 'files/';
    async create(data: Partial<FileDtoCreate>) {
        const formData = new FormData()

        formData.append('appointment_id', data.appointment_id ?? '');
        if (data.folder) formData.append('folder', data.folder);
        formData.append('file', data.file ?? '');

        return await axios.post<{ data: Partial<FileDTO> }>(this.baseUrl, formData, { headers: { "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryG1f2mPmLLWJF3xvh" } })
    }

    async delete(fileId: string) {
        return await axios.delete(this.baseUrl+fileId)
    }

    async list(filter: string) {
        const response = await axios.get<{ data: FileDTO[] }>(this.baseUrl+`?${filter}`)

        return {
            ...response,
            data: response.data?.data?.map(item => FileModel.ToModel(item).file)
        }
    }
}

export const repository = new ImplementationFileRepository();
