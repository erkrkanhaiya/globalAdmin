import { api } from './client.js'

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role?: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  role?: string
}

export async function listUsers(): Promise<User[]> {
  const response = await api.get('/user')
  return response.data.data || response.data
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const response = await api.post('/user', input)
  return response.data.data || response.data
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  const response = await api.patch(`/user/${id}`, input)
  return response.data.data || response.data
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/user/${id}`)
}

export async function getUser(id: string): Promise<User> {
  const response = await api.get(`/user/${id}`)
  return response.data.data || response.data
}