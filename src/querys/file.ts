import { FileDtoCreate } from "@/domain/File"
import { repository } from "@/repositories/file"
import { useMutation } from "@tanstack/react-query"
export const createFile = () => {
    const mutation = useMutation({
        mutationFn: (data: Partial<FileDtoCreate>) => {
            return repository.create(data)
        }
    })

    return mutation
}
export const deleteFile = () => {
    const mutation = useMutation({
        mutationFn: (fileId: string) => {

            return repository.delete(fileId)
        }
    })

    return mutation
}