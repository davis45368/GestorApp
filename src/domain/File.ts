import { Base, BaseDto } from "./Base"

export interface FileDTO {
    id: string
    filename_download?: string,
    folder?: string
    appointment_id: string 
}

interface FileDtoCreate {
    name: string
    folder?: string
    appointment_id: string 
    binary: ArrayBuffer
}

export interface File extends Base {
    id: string
    name: string
}

export class FileModel {
    fileId: string
    file: File

    constructor(file:File) {
        this.fileId=file.id,
        this.file = file
    }

    static ToModel(dto: FileDTO) {
        const file: File = {
            ...dto,
            dateCreated: dto.date_created,
            dateUpdated: dto.date_updated,
        }

        return new FileModel(file)
    }

    static ToDTo(file: Partial<File>): Partial<FileDTO> {
        return {
            name: file.name,
            ...(file.id ? { id: file.id } : {})
        }
    }
}