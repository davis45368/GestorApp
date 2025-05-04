import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, UserStoreState } from "../types"
import { useBrandStore } from "./brandContext"

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null })
        try {
          // En una aplicación real, esto sería una petición a un servidor
          // Por ahora, buscamos en los datos locales

          // Espera artificial para simular petición a API
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Buscar en todas las marcas
          const brandStore = useBrandStore.getState()
          let foundUser: User | null = null

          for (const brand of brandStore.brands) {
            const user = brand.users.find((u) => u.email === email)
            if (user) {
              // Comprobar password (en un caso real sería con bcrypt.compare)
              // Aquí simplemente comparamos con el valor hasheado guardado
              // (suponiendo que todos los passwords son "password" hasheado)
              if (user.password === "$2a$10$X7SZv0wDRu0F0K5eqd.j3.0gRj8ZyJvl6UQh6VT3UzRnJz/hq5RLm") {
                foundUser = user
                break
              }
            }
          }

          if (foundUser) {
            set({ user: foundUser, loading: false })
            // Si el usuario tiene una marca, establecerla como actual
            if (foundUser.brandId) {
              brandStore.setCurrentBrand(foundUser.brandId)
            }
            return foundUser
          } else {
            set({ error: "Credenciales inválidas", loading: false })
            return null
          }
        } catch (error) {
          set({ error: "Error en el inicio de sesión", loading: false })
          return null
        }
      },

      logout: () => {
        set({ user: null, error: null })
      },

      register: async (userData) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición API
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          const selectedBrand = brandStore.brands.find((b) => b.brandId === userData.brandId)

          if (!selectedBrand) {
            set({ error: "Marca no encontrada", loading: false })
            return null
          }

          // Comprobar si el email ya existe
          const emailExists = selectedBrand.users.some((u) => u.email === userData.email)
          if (emailExists) {
            set({ error: "El email ya está registrado", loading: false })
            return null
          }

          // Crear nuevo usuario
          const newUser: User = {
            id: `${userData.brandId}-user-${selectedBrand.users.length + 1}`,
            nombre: userData.nombre,
            email: userData.email,
            // En una aplicación real, la contraseña se hashearía
            password: "$2a$10$X7SZv0wDRu0F0K5eqd.j3.0gRj8ZyJvl6UQh6VT3UzRnJz/hq5RLm", // Simulación del hash
            role: userData.role ?? "paciente", // Los nuevos registros son siempre pacientes
            brandId: userData.brandId,
          }

          // Actualizar el store de marcas con el nuevo usuario
          const updatedBrands = brandStore.brands.map((brand) => {
            if (brand.brandId === userData.brandId) {
              return {
                ...brand,
                users: [...brand.users, newUser],
              }
            }
            return brand
          })
          console.log(updatedBrands)
          // Actualizar el store
          useBrandStore.setState({
            brands: updatedBrands,
            currentBrand: {
              ...selectedBrand,
              users: updatedBrands.find(item => item.brandId == userData.brandId)?.users ?? selectedBrand.users
            }
          })
          console.log(useBrandStore)
          // Devolver el usuario creado (sin contraseña)
          set({ loading: false })
          return newUser
        } catch (error) {
          set({ error: "Error en el registro", loading: false })
          return null
        }
      },

      changePassword: async (userId, oldPassword, newPassword) => {
        set({ loading: true, error: null })
        try {
          // En una app real, esto sería una petición API con validación de old password
          await new Promise((resolve) => setTimeout(resolve, 500))

          const brandStore = useBrandStore.getState()
          let userUpdated = false

          // Recorrer todas las marcas para encontrar al usuario
          const updatedBrands = brandStore.brands.map((brand) => {
            const updatedUsers = brand.users.map((user) => {
              if (user.id === userId) {
                // Comprobar si la contraseña antigua coincide
                if (user.password === "$2a$10$X7SZv0wDRu0F0K5eqd.j3.0gRj8ZyJvl6UQh6VT3UzRnJz/hq5RLm") {
                  userUpdated = true
                  return {
                    ...user,
                    // En una aplicación real, la nueva contraseña se hashearía
                    password: "$2a$10$X7SZv0wDRu0F0K5eqd.j3.0gRj8ZyJvl6UQh6VT3UzRnJz/hq5RLm", // Simulación del nuevo hash
                  }
                }
              }
              return user
            })

            return {
              ...brand,
              users: updatedUsers,
            }
          })

          if (userUpdated) {
            // Actualizar el store
            useBrandStore.setState({ brands: updatedBrands })
            set({ loading: false })
            return true
          } else {
            set({ error: "Contraseña actual incorrecta", loading: false })
            return false
          }
        } catch (error) {
          set({ error: "Error al cambiar la contraseña", loading: false })
          return false
        }
      },
    }),
    {
      name: "user-storage",
    },
  ),
)
