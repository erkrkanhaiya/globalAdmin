import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Pagination from '@mui/material/Pagination'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FilterListIcon from '@mui/icons-material/FilterList'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ChatIcon from '@mui/icons-material/ChatBubbleOutline'
import DeleteIcon from '@mui/icons-material/DeleteOutline'

type Customer = {
  id: string
  name: string
  contact: string
  type: 'Residential' | 'Commercial'
  interested: string
  lastConnected: string
  status: 'Interested' | 'Under Review'
}

function makeCustomer(i: number, status: Customer['status']): Customer {
  const names = ['Michael A. Miner','Annette Black','Devon Lane','Ralph Edwards','Guy Hawkins','Eleanor Pena','Leslie Alexander','Darlene Robertson','Jerome Bell','Cameron William']
  const phones = ['(808) 555-0111','(702) 555-0122','(209) 555-0104','(480) 555-0103','(308) 555-0121','(303) 555-0105','(319) 555-0115','(252) 555-0126','(505) 555-0125','(208) 555-0112']
  const types: Array<Customer['type']> = ['Residential','Commercial']
  const props = ['123 Maple ST, 456 Oak Ave','3517 W. Gray St. Utica','3891 Ranchview Dr. Richardson','6391 Elgin St. Celina, Delaware','8502 Preston Rd. Inglewood','2715 Ash Dr. San Jose','1901 Thornridge Shiloh, Hawaii','Cir. Shiloh, Hawaii']
  return {
    id: `c${i}`,
    name: names[i % names.length],
    contact: phones[i % phones.length],
    type: types[i % 2],
    interested: props[i % props.length],
    lastConnected: new Date(2025, 0, 20 + (i % 12)).toLocaleDateString('en-GB'),
    status
  }
}

export default function CustomerPage() {
  const navigate = useNavigate()
  const allData = useMemo<Customer[]>(() => {
    const list: Customer[] = []
    for (let i = 0; i < 20; i++) {
      list.push(makeCustomer(i, i % 3 === 0 ? 'Under Review' : 'Interested'))
    }
    return list
  }, [])

  const [page, setPage] = useState(2)
  const rowsPerPage = 10
  const [orderBy, setOrderBy] = useState<keyof Customer>('name')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const sorted = useMemo(() => {
    return [...allData].sort((a, b) => {
      const av = a[orderBy]
      const bv = b[orderBy]
      if (typeof av === 'string' && typeof bv === 'string') {
        return order === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return 0
    })
  }, [allData, orderBy, order])

  const start = (page - 1) * rowsPerPage
  const pageData = sorted.slice(start, start + rowsPerPage)

  function handleRequestSort(property: keyof Customer) {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  // actions menu
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const openMenu = Boolean(menuAnchor)
  function handleOpenMenu(id: string, el: HTMLElement) { setActiveId(id); setMenuAnchor(el) }
  function handleCloseMenu() { setMenuAnchor(null); setActiveId(null) }

  function handleAction(action: 'view' | 'edit' | 'message' | 'delete') {
    // Replace with real logic/hooks
    console.log(action, activeId)
    handleCloseMenu()
    if (action === 'view' && activeId) navigate(`/customer/${activeId}`)
    if (action === 'message') navigate('/inbox')
    if (action === 'delete') alert('Customer deleted (mock).')
  }

  return (
    <div className="dash" style={{ padding: 16, display:'grid', gap:16 }}>
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div className="title">Customer</div>
        </div>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button startIcon={<FilterListIcon />} variant="outlined" size="small">Filter</Button>
          <Select size="small" defaultValue="last-month">
            <MenuItem value="last-month">Last Month</MenuItem>
            <MenuItem value="this-month">This Month</MenuItem>
          </Select>
          <Button variant="contained" color="primary">+ Add Customer</Button>
        </Stack>
      </Box>

      <Paper variant="outlined" sx={{ p: 0 }}>
        <Box sx={{ px:2, py:1.5, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Typography fontWeight={700}>All Customer List</Typography>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox /></TableCell>
                <TableCell sortDirection={orderBy === 'name' ? order : false}>
                  <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleRequestSort('name')}>Customer Name</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'contact' ? order : false}>
                  <TableSortLabel active={orderBy === 'contact'} direction={orderBy === 'contact' ? order : 'asc'} onClick={() => handleRequestSort('contact')}>Contact</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'type' ? order : false}>
                  <TableSortLabel active={orderBy === 'type'} direction={orderBy === 'type' ? order : 'asc'} onClick={() => handleRequestSort('type')}>Properties Type</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'interested' ? order : false}>
                  <TableSortLabel active={orderBy === 'interested'} direction={orderBy === 'interested' ? order : 'asc'} onClick={() => handleRequestSort('interested')}>Interested Properties</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'lastConnected' ? order : false}>
                  <TableSortLabel active={orderBy === 'lastConnected'} direction={orderBy === 'lastConnected' ? order : 'asc'} onClick={() => handleRequestSort('lastConnected')}>Last connected</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'status' ? order : false}>
                  <TableSortLabel active={orderBy === 'status'} direction={orderBy === 'status' ? order : 'asc'} onClick={() => handleRequestSort('status')}>Status</TableSortLabel>
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageData.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell padding="checkbox"><Checkbox /></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32 }}>{c.name.split(' ').map(p=>p[0]).slice(0,2).join('')}</Avatar>
                      <Typography>{c.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{c.contact}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Typography noWrap title={c.interested}>{c.interested}</Typography>
                  </TableCell>
                  <TableCell>{c.lastConnected}</TableCell>
                  <TableCell>{c.status === 'Interested' ? <Chip label="Interested" color="success" variant="outlined" /> : <Chip label="Under Review" color="warning" variant="outlined" />}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="More actions">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(c.id, e.currentTarget)}><MoreVertIcon /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', px:2, py:1.5 }}>
          <Typography variant="body2" color="text.secondary">Page {page} of {Math.ceil(allData.length / rowsPerPage)}</Typography>
          <Pagination page={page} count={Math.ceil(allData.length / rowsPerPage)} onChange={(_, p) => setPage(p)} shape="rounded" />
        </Box>
      </Paper>

      <Menu anchorEl={menuAnchor} open={openMenu} onClose={handleCloseMenu} anchorOrigin={{ vertical:'bottom', horizontal:'right' }} transformOrigin={{ vertical:'top', horizontal:'right' }}>
        <MenuItem onClick={() => handleAction('view')}><VisibilityIcon fontSize="small" style={{ marginRight:8 }} /> View</MenuItem>
        <MenuItem onClick={() => handleAction('edit')}><EditIcon fontSize="small" style={{ marginRight:8 }} /> Edit</MenuItem>
        <MenuItem onClick={() => handleAction('message')}><ChatIcon fontSize="small" style={{ marginRight:8 }} /> Message</MenuItem>
        <MenuItem onClick={() => handleAction('delete')}><DeleteIcon fontSize="small" style={{ marginRight:8 }} /> Delete</MenuItem>
      </Menu>
    </div>
  )
}

