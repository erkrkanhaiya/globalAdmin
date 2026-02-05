import { z } from 'zod'
import { simulateNetwork } from './client'

export type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'viewer'
}

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'viewer'])
})

const UpdateUserSchema = CreateUserSchema.partial()

let usersDb: User[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'manager' },
  { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', role: 'viewer' },
  { id: 'u3', name: 'Carol Adams', email: 'carol@example.com', role: 'admin' }
]

export async function listUsers(): Promise<User[]> {
  return simulateNetwork([...usersDb])
}

export async function createUser(input: unknown): Promise<User> {
  const data = CreateUserSchema.parse(input)
  const user: User = { id: `u${Date.now()}`, ...data }
  usersDb = [user, ...usersDb]
  return simulateNetwork(user)
}

export async function updateUser(id: string, input: unknown): Promise<User> {
  const data = UpdateUserSchema.parse(input)
  usersDb = usersDb.map(u => (u.id === id ? { ...u, ...data } : u))
  const updated = usersDb.find(u => u.id === id)!
  return simulateNetwork(updated)
}

export async function deleteUser(id: string): Promise<{ id: string }> {
  usersDb = usersDb.filter(u => u.id !== id)
  return simulateNetwork({ id })
}

