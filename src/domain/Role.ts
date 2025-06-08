export interface RoleDTO {
    id: string
    name: string
    users: string[]
}

export interface Role {
    id: string
    name: string
    users: string[]
}

export class RoleModel {
    roleId: string
    role: Role

    constructor(role:Role) {
        this.roleId=role.id,
        this.role = role
    }

    static ToModel(dto: RoleDTO) {
        const role: Role = {
            ...dto,
            name: dto.name?.toLocaleLowerCase()
        }

        return new RoleModel(role)
    }

    static ToDTo(role: Partial<Role>): Partial<RoleDTO> {
        return {
            name: role.name,
            ...(role.id ? { id: role.id } : {})
        }
    }
}