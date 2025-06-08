
export interface FileDTO {
    id: string
    filename_download?: string,
    folder?: string
    appointment_id: string[]
}

export interface FileDtoCreate {
    folder?: string
    appointment_id: string 
    file: File
}

export interface Files {
    id: string
    filenameDownload?: string,
    folder?: string
    appointmentId: string[]
}

export class FileModel {
    fileId: string
    file: Files

    constructor(file:Files) {
        this.fileId=file.id,
        this.file = file
    }

    static ToModel(dto: FileDTO) {
        const file: Files = {
            appointmentId: dto.appointment_id,
            id: dto.id,
            filenameDownload: dto.filename_download,
            folder: dto.folder
        }

        return new FileModel(file)
    }
}