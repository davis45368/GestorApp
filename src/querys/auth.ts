import { ChangePasswordRecovery, LoginData, VerifyEmailChangePassword, VerifyEmailUserData } from "@/domain/Login"
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

export const verifyEmailUser = ( ) => {
    const mutation = useMutation({
        mutationFn: (data: VerifyEmailUserData) => {
            return repository.verifyEmailUser(data)
        }
    })

    return mutation;
}

export const verifyEmailUserChangePassword = ( ) => {
    const mutation = useMutation({
        mutationFn: (data: VerifyEmailChangePassword) => {
            return repository.verifyEmailChangePassword(data)
        }
    })

    return mutation;
}

export const changePasswordRecovery = ( ) => {
    const mutation = useMutation({
        mutationFn: (data: ChangePasswordRecovery) => {
            return repository.changePasswordReset(data)
        }
    })

    return mutation;
}