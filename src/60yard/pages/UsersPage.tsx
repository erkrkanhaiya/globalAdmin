import { FormEvent, useEffect, useMemo, useState } from 'react'
import { createUser, deleteUser, listUsers, updateUser, type User } from '@/60yard/api/users'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

type Draft = {
  name: string
  email: string
  role: User['role']
}

const emptyDraft: Draft = { name: '', email: '', role: 'viewer' }

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [orderBy, setOrderBy] = useState<keyof User>('name')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const av = a[orderBy]
      const bv = b[orderBy]
      if (typeof av === 'string' && typeof bv === 'string') {
        return order === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return 0
    })
  }, [users, orderBy, order])

  function handleRequestSort(property: keyof User) {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  async function refresh() {
    setLoading(true)
    try {
      const data = await listUsers()
      setUsers(data)
      setError(null)
    } catch (err: any) {
      setError(err?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  function startEdit(u: User) {
    setEditingId(u.id)
    setDraft({ name: u.name, email: u.email, role: u.role })
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(emptyDraft)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        await updateUser(editingId, draft)
      } else {
        await createUser(draft)
      }
      cancelEdit()
      await refresh()
    } catch (err: any) {
      alert(err?.message || 'Action failed')
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this user?')) return
    await deleteUser(id)
    await refresh()
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1 style={{ marginTop: 0 }}>Users</h1>

      <form onSubmit={onSubmit} className="panel" style={{ padding: 16, display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: 12 }}>
          <input className="input" placeholder="Name" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
          <input className="input" placeholder="Email" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} />
          <select className="input" value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value as User['role'] })}>
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="viewer">viewer</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="submit">{editingId ? 'Update user' : 'Create user'}</button>
          {editingId && <button className="btn secondary" type="button" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <Paper variant="outlined" sx={{ p: 0 }}>
        {loading ? (
          <div style={{ padding: 16 }}>Loading…</div>
        ) : error ? (
          <div style={{ padding: 16, color: 'var(--danger)' }}>{error}</div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={orderBy === 'name' ? order : false}>
                    <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleRequestSort('name')}>Name</TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'email' ? order : false}>
                    <TableSortLabel active={orderBy === 'email'} direction={orderBy === 'email' ? order : 'asc'} onClick={() => handleRequestSort('email')}>Email</TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'role' ? order : false}>
                    <TableSortLabel active={orderBy === 'role'} direction={orderBy === 'role' ? order : 'asc'} onClick={() => handleRequestSort('role')}>Role</TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedUsers.map(u => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button variant="outlined" size="small" onClick={() => startEdit(u)}>Edit</Button>
                        <Button variant="outlined" color="error" size="small" onClick={() => onDelete(u.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </div>
  )
}

