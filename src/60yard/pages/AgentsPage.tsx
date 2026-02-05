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
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FilterListIcon from '@mui/icons-material/FilterList'

type Agent = {
  id: string
  name: string
  address: string
  contact: string
  experienceYears: number
  date: string
  status: 'Active' | 'Inactive'
}

function makeAgent(i: number, status: 'Active' | 'Inactive'): Agent {
  const names = ['Michael A. Miner','Annette Black','Devon Lane','Ralph Edwards','Guy Hawkins','Eleanor Pena','Leslie Alexander','Darlene Robertson','Jerome Bell','Cameron William','Savannah Nguyen','Kathryn Murphy']
  const addresses = ['3891 Ranchview Dr. Richardson','2972 Westheimer Rd. Santa','8502 Preston Rd. Inglewood','Manchester, Kentucky 39495','6391 Elgin St. Celina, Delaware 10299','4140 Parker Rd. Allentown, New','3517 W. Gray St. Utica','New Jersey 45463','South Dakota 83475','2118 Thornridge Cir. Syracuse','Cir. Shiloh, Hawaii 81063','4517 Washington Ave.']
  const phones = ['(808) 555-0111','(702) 555-0122','(209) 555-0104','(480) 555-0103','(308) 555-0121','(303) 555-0105','(319) 555-0115','(252) 555-0126','(505) 555-0125','(208) 555-0112','(907) 555-0101','(207) 555-0119']
  return {
    id: `a${i}`,
    name: names[i % names.length],
    address: addresses[i % addresses.length],
    contact: phones[i % phones.length],
    experienceYears: 3 + (i % 5) + (i % 3),
    date: new Date(2025, 0, 20 + (i % 12)).toLocaleDateString('en-GB'),
    status
  }
}

export default function AgentsPage() {
  const navigate = useNavigate()
  const allData = useMemo<Agent[]>(() => {
    const list: Agent[] = []
    for (let i = 0; i < 20; i++) {
      list.push(makeAgent(i, i % 3 === 0 ? 'Inactive' : 'Active'))
    }
    return list
  }, [])

  const [page, setPage] = useState(1)
  const rowsPerPage = 10
  const [orderBy, setOrderBy] = useState<keyof Agent>('name')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const sorted = useMemo(() => {
    return [...allData].sort((a, b) => {
      const av = a[orderBy]
      const bv = b[orderBy]
      if (typeof av === 'string' && typeof bv === 'string') {
        return order === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      if (typeof av === 'number' && typeof bv === 'number') {
        return order === 'asc' ? av - bv : bv - av
      }
      return 0
    })
  }, [allData, orderBy, order])

  const start = (page - 1) * rowsPerPage
  const pageData = sorted.slice(start, start + rowsPerPage)

  function handleRequestSort(property: keyof Agent) {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <div className="dash" style={{ padding: 16, display:'grid', gap:16 }}>
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div className="title">Agent</div>
        </div>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button startIcon={<FilterListIcon />} variant="outlined" size="small">Filter</Button>
          <Select size="small" defaultValue="last-month">
            <MenuItem value="last-month">Last Month</MenuItem>
            <MenuItem value="this-month">This Month</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={() => navigate('/agents/new')}>+ Add Agent</Button>
        </Stack>
      </Box>

      <Paper variant="outlined" sx={{ p: 0 }}>
        <Box sx={{ px:2, py:1.5, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Typography fontWeight={700}>All Agent List</Typography>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox /></TableCell>
                <TableCell sortDirection={orderBy === 'name' ? order : false}>
                  <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleRequestSort('name')}>Agent Name</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'address' ? order : false}>
                  <TableSortLabel active={orderBy === 'address'} direction={orderBy === 'address' ? order : 'asc'} onClick={() => handleRequestSort('address')}>Address</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'contact' ? order : false}>
                  <TableSortLabel active={orderBy === 'contact'} direction={orderBy === 'contact' ? order : 'asc'} onClick={() => handleRequestSort('contact')}>Contact</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'experienceYears' ? order : false}>
                  <TableSortLabel active={orderBy === 'experienceYears'} direction={orderBy === 'experienceYears' ? order : 'asc'} onClick={() => handleRequestSort('experienceYears')}>Experience</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'date' ? order : false}>
                  <TableSortLabel active={orderBy === 'date'} direction={orderBy === 'date' ? order : 'asc'} onClick={() => handleRequestSort('date')}>Date</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'status' ? order : false}>
                  <TableSortLabel active={orderBy === 'status'} direction={orderBy === 'status' ? order : 'asc'} onClick={() => handleRequestSort('status')}>Status</TableSortLabel>
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageData.map((a) => (
                <TableRow key={a.id} hover sx={{ cursor:'pointer' }} onClick={() => navigate(`/agents/${a.id}`)}>
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}><Checkbox /></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32 }}>{a.name.split(' ').map(p=>p[0]).slice(0,2).join('')}</Avatar>
                      <Typography>{a.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{a.address}</TableCell>
                  <TableCell>{a.contact}</TableCell>
                  <TableCell>{String(a.experienceYears).padStart(2,'0')} Years</TableCell>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.status === 'Active' ? <Chip label="Active" color="success" variant="outlined" /> : <Chip label="Inactive" color="warning" variant="outlined" />}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}><IconButton size="small"><MoreVertIcon /></IconButton></TableCell>
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
    </div>
  )
}

