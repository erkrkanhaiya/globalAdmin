import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/GridLegacy'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Avatar from '@mui/material/Avatar'
import Pagination from '@mui/material/Pagination'
import { useNavigate } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AssessmentIcon from '@mui/icons-material/Assessment'
import Menu from '@mui/material/Menu'

type Ticket = {
  id: string
  customer: string
  supportBy: string
  subject: string
  startDate: string
  dueDate: string
  status: 'Active' | 'Cancel' | 'Completed' | 'Pending'
}

function makeTicket(i: number): Ticket {
  const names = ['Blonde Drizzle','Kuiper Split','Diva Bliss','Soul Dragon','Vineyard Bard','Sugar Free Diva','Angelic Quest','Cosmic Sage']
  const supports = ['Peppermint','Awesomen','Emohawk','Angle Fire','Lady Muffin','Bubbles','Celestial','Zeropie']
  const subjects = ['Edit Customer ...','Payment Error ...','Suspend Account...','Change Email','Addition Calendar...','Edit Menu','Payment Error','Change Email']
  const statuses: Ticket['status'][] = ['Active','Cancel','Completed','Pending']
  return {
    id: `T-${540000 + i}`,
    customer: names[i % names.length],
    supportBy: supports[i % supports.length],
    subject: subjects[i % subjects.length],
    startDate: '29/02/2024',
    dueDate: '29/02/2024',
    status: statuses[i % statuses.length]
  }
}

function StatCard({ title, value, color }: { title: string; value: string; color: 'primary' | 'warning' | 'success' | 'error' }) {
  return (
    <Paper variant="outlined" sx={{ p:2, borderRadius:3 }}>
      <Stack direction="row" alignItems="start" justifyContent="space-between">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width:40, height:40, borderRadius:'50%', display:'grid', placeItems:'center', border: theme => `2px solid ${theme.palette[color].main}`, color: theme => theme.palette[color].main }}>
            <AssessmentIcon fontSize="small" />
          </Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Stack>
        <IconButton size="small"><MoreVertIcon /></IconButton>
      </Stack>
      <Typography variant="h5" fontWeight={800} sx={{ my:1 }}>{value}</Typography>
      <Button size="small" variant="outlined" color="inherit" sx={{ textTransform:'none', bgcolor:'action.hover' }} endIcon={<span>→</span>}>View Report</Button>
    </Paper>
  )
}

export default function SupportPage() {
  const navigate = useNavigate()
  const allTickets = useMemo<Ticket[]>(() => Array.from({ length: 40 }, (_, i) => makeTicket(i)), [])
  const [page, setPage] = useState(2)
  const rowsPerPage = 10
  const [orderBy, setOrderBy] = useState<keyof Ticket>('customer')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const sorted = useMemo(() => {
    return [...allTickets].sort((a, b) => {
      const av = a[orderBy]
      const bv = b[orderBy]
      if (typeof av === 'string' && typeof bv === 'string') {
        return order === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return 0
    })
  }, [allTickets, orderBy, order])

  const start = (page - 1) * rowsPerPage
  const data = sorted.slice(start, start + rowsPerPage)

  function handleRequestSort(property: keyof Ticket) {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const [rowId, setRowId] = useState<string | null>(null)
  const open = Boolean(anchor)
  const openActions = (id: string, el: HTMLElement) => { setRowId(id); setAnchor(el) }
  const closeActions = () => { setRowId(null); setAnchor(null) }

  return (
    <div className="dash" style={{ padding: 16, display:'grid', gap:16 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}><StatCard title="Total Tickets" value="25,545" color="primary" /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Pending Tickets" value="5,545.00" color="warning" /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Closed Tickets" value="15,545" color="success" /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Deleted Tickets" value="2,545" color="error" /></Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p:2 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <TextField placeholder="Search by ID, Support, or others…" size="small" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Button startIcon={<FilterListIcon />} variant="outlined">Filters</Button>
            <Button startIcon={<CalendarTodayIcon />} variant="outlined">April 11 - April 24</Button>
            <Button variant="contained" color="primary">Create Ticket</Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === 'customer' ? order : false}>
                  <TableSortLabel active={orderBy === 'customer'} direction={orderBy === 'customer' ? order : 'asc'} onClick={() => handleRequestSort('customer')}>Customer Name</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'supportBy' ? order : false}>
                  <TableSortLabel active={orderBy === 'supportBy'} direction={orderBy === 'supportBy' ? order : 'asc'} onClick={() => handleRequestSort('supportBy')}>Support By</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'subject' ? order : false}>
                  <TableSortLabel active={orderBy === 'subject'} direction={orderBy === 'subject' ? order : 'asc'} onClick={() => handleRequestSort('subject')}>Subject</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'startDate' ? order : false}>
                  <TableSortLabel active={orderBy === 'startDate'} direction={orderBy === 'startDate' ? order : 'asc'} onClick={() => handleRequestSort('startDate')}>Start Date</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'dueDate' ? order : false}>
                  <TableSortLabel active={orderBy === 'dueDate'} direction={orderBy === 'dueDate' ? order : 'asc'} onClick={() => handleRequestSort('dueDate')}>Due Date</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'status' ? order : false}>
                  <TableSortLabel active={orderBy === 'status'} direction={orderBy === 'status' ? order : 'asc'} onClick={() => handleRequestSort('status')}>Status</TableSortLabel>
                </TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(t => (
                <TableRow key={t.id} hover sx={{ cursor:'pointer' }} onClick={() => navigate(`/support/${t.id}`)}>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32 }}>{t.customer.split(' ').map(p=>p[0]).slice(0,2).join('')}</Avatar>
                      <Box>
                        <Typography>{t.customer}</Typography>
                        <Typography variant="caption" color="text.secondary">User ID: #{t.id}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{t.supportBy}</TableCell>
                  <TableCell><Typography noWrap sx={{ maxWidth: 200 }}>{t.subject}</Typography></TableCell>
                  <TableCell>{t.startDate}</TableCell>
                  <TableCell>{t.dueDate}</TableCell>
                  <TableCell>
                    {t.status === 'Active' && <Chip label="Active" color="success" variant="outlined" />}
                    {t.status === 'Cancel' && <Chip label="Cancel" color="error" variant="outlined" />}
                    {t.status === 'Completed' && <Chip label="Completed" color="primary" variant="outlined" />}
                    {t.status === 'Pending' && <Chip label="Pending" color="warning" variant="outlined" />}
                  </TableCell>
                  <TableCell onClick={(e) => { e.stopPropagation(); }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); openActions(t.id, e.currentTarget as HTMLElement) }}><MoreVertIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', px:2, py:1.5 }}>
          <Typography variant="body2" color="text.secondary">Showing 1 to {rowsPerPage} of {allTickets.length} results</Typography>
          <Pagination page={page} count={Math.ceil(allTickets.length / rowsPerPage)} onChange={(_, p) => setPage(p)} shape="rounded" />
        </Box>
      </Paper>

      <Menu anchorEl={anchor} open={open} onClose={closeActions} anchorOrigin={{ vertical:'bottom', horizontal:'right' }} transformOrigin={{ vertical:'top', horizontal:'right' }}>
        <MenuItem onClick={closeActions}><VisibilityIcon fontSize="small" style={{ marginRight:8 }} /> View</MenuItem>
        <MenuItem onClick={closeActions}><EditIcon fontSize="small" style={{ marginRight:8 }} /> Edit</MenuItem>
        <MenuItem onClick={closeActions}><DeleteIcon fontSize="small" style={{ marginRight:8 }} /> Delete</MenuItem>
      </Menu>
    </div>
  )
}

