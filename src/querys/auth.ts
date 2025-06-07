import { LoginData } from "@/domain/Login"
import { repository } from "@/repositories/auth"
import { useMutation } from "@tanstack/react-query"

export const login = () => {
    const mutation = useMutation({
        mutationFn: (data: LoginData) => {
            return repository.login(data)
        }
    })

    return mutation;
}