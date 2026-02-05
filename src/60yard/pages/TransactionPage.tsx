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
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Pagination from '@mui/material/Pagination'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MoreVertIcon from '@mui/icons-material/MoreVert'

type Transaction = {
  id: string
  sender: string
  date: string
  amount: string
  cardType: 'Visa' | 'MasterCard'
  cardLast4: string
  recipient: string
  status: 'Completed' | 'Cancel'
}

function makeTransaction(i: number): Transaction {
  const names = ['Michael A.', 'Annette Bla...', 'Ralph Edwa...', 'Devon Lane', 'Guy Hawkins', 'Eleanor Pena', 'Leslie Alexander', 'Wade Warren', 'Darlene Robert...']
  const recipients = ['Leslie Alexander', 'Wade Warren', 'Darlene Robertson', 'Jerome Bell', 'Cameron William', 'Savannah Nguyen']
  const amounts = ['$45,842', '$35,842', '$28,500', '$52,100', '$19,250', '$38,900']
  const cardTypes: Transaction['cardType'][] = ['Visa', 'MasterCard']
  const statuses: Transaction['status'][] = ['Completed', 'Cancel']
  
  return {
    id: `TXN-201${String(i).padStart(2, '0')}`,
    sender: names[i % names.length],
    date: new Date(2025, 0, 20 + (i % 12)).toLocaleDateString('en-GB'),
    amount: amounts[i % amounts.length],
    cardType: cardTypes[i % 2],
    cardLast4: '7878',
    recipient: recipients[i % recipients.length],
    status: statuses[i % 2]
  }
}

export default function TransactionPage() {
  const navigate = useNavigate()
  const allData = useMemo<Transaction[]>(() => Array.from({ length: 40 }, (_, i) => makeTransaction(i)), [])
  const [page, setPage] = useState(2)
  const rowsPerPage = 10
  const [orderBy, setOrderBy] = useState<keyof Transaction>('id')
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
  const data = sorted.slice(start, start + rowsPerPage)

  function handleRequestSort(property: keyof Transaction) {
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
      <Paper variant="outlined" sx={{ p:2 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <TextField placeholder="Search by ID, Sender, or others…" size="small" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Button startIcon={<FilterListIcon />} variant="outlined">Filters</Button>
            <Button startIcon={<CalendarTodayIcon />} variant="outlined">April 11 - April 24</Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox /></TableCell>
                <TableCell sortDirection={orderBy === 'id' ? order : false}>
                  <TableSortLabel active={orderBy === 'id'} direction={orderBy === 'id' ? order : 'asc'} onClick={() => handleRequestSort('id')}>Transaction ID</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'sender' ? order : false}>
                  <TableSortLabel active={orderBy === 'sender'} direction={orderBy === 'sender' ? order : 'asc'} onClick={() => handleRequestSort('sender')}>Sender</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'date' ? order : false}>
                  <TableSortLabel active={orderBy === 'date'} direction={orderBy === 'date' ? order : 'asc'} onClick={() => handleRequestSort('date')}>Date</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'amount' ? order : false}>
                  <TableSortLabel active={orderBy === 'amount'} direction={orderBy === 'amount' ? order : 'asc'} onClick={() => handleRequestSort('amount')}>Amount</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'cardType' ? order : false}>
                  <TableSortLabel active={orderBy === 'cardType'} direction={orderBy === 'cardType' ? order : 'asc'} onClick={() => handleRequestSort('cardType')}>Payment Method</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'recipient' ? order : false}>
                  <TableSortLabel active={orderBy === 'recipient'} direction={orderBy === 'recipient' ? order : 'asc'} onClick={() => handleRequestSort('recipient')}>Recipient</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'status' ? order : false}>
                  <TableSortLabel active={orderBy === 'status'} direction={orderBy === 'status' ? order : 'asc'} onClick={() => handleRequestSort('status')}>Status</TableSortLabel>
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell padding="checkbox"><Checkbox /></TableCell>
                  <TableCell><Typography variant="body2" fontWeight={600}>{t.id}</Typography></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32 }}>{t.sender.split(' ').map(p=>p[0]).slice(0,2).join('')}</Avatar>
                      <Typography>{t.sender}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell><Typography fontWeight={700}>{t.amount}</Typography></TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 32, height: 20, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', bgcolor: t.cardType === 'Visa' ? '#1434CB' : '#EB001B' }}>
                          {t.cardType === 'Visa' ? 'VISA' : 'MC'}
                        </Box>
                        <Typography variant="body2">{t.cardType} Card****{t.cardLast4}</Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">Card Payment</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{t.recipient}</TableCell>
                  <TableCell>
                    {t.status === 'Completed' ? (
                      <Chip label="Completed" color="success" size="small" sx={{ bgcolor: '#ecfdf3', color: '#027a48', fontWeight: 700 }} />
                    ) : (
                      <Chip label="Cancel" color="error" size="small" sx={{ bgcolor: '#fef3f2', color: '#b42318', fontWeight: 700 }} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => openActions(t.id, e.currentTarget)}><MoreVertIcon /></IconButton>
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

      <Menu anchorEl={anchor} open={open} onClose={closeActions} anchorOrigin={{ vertical:'bottom', horizontal:'right' }} transformOrigin={{ vertical:'top', horizontal:'right' }}>
        <MenuItem onClick={() => { closeActions(); if (rowId) navigate(`/transaction/${rowId}`) }}>View Details</MenuItem>
        <MenuItem onClick={closeActions}>Download Receipt</MenuItem>
        <MenuItem onClick={closeActions}>Refund</MenuItem>
      </Menu>
    </div>
  )
}

