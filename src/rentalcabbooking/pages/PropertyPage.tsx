import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Pagination from '@mui/material/Pagination'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import BedIcon from '@mui/icons-material/Bed'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import BusinessIcon from '@mui/icons-material/Business'
import AssignmentIcon from '@mui/icons-material/Assignment'
import GavelIcon from '@mui/icons-material/Gavel'
import Link from '@mui/material/Link'

type Property = {
  id: string
  name: string
  type: string
  size: string
  rentSale: 'Rent' | 'Sale' | 'Sold'
  bedrooms: number
  location: string
  price: string
}

function makeProperty(i: number): Property {
  const names = ['New York', 'Washington Residence', 'London Residence', 'Grand Resort Villa', 'House Residence', 'Paris Square', 'Canada Residence', 'Luxury Penthouse', 'Duplex Bungalow', 'Modern Apartment']
  const types = ['House', 'Villa', 'House', 'Villa', 'House', 'Villa', 'Villa', 'House', 'Bungalow', 'Apartment']
  const sizes = ['1400ft', '1600ft', '1600ft', '1600ft', '1400ft', '1200ft', '2400ft', '2200ft', '2200ft', '1000ft']
  const rentSales: Array<Property['rentSale']> = ['Sale', 'Rent', 'Rent', 'Sold', 'Rent', 'Sold', 'Rent', 'Sale', 'Rent', 'Sale']
  const bedrooms = [5, 3, 4, 5, 3, 3, 6, 6, 6, 2]
  const locations = ['France', 'Canada', 'England', 'Canada', 'France', 'German', 'Portugal', 'Thailand', 'America', 'Spain']
  const prices = ['$250,00 USD', '$87,00 USD', '$200,00 USD', '$350,00 USD', '$350,00 USD', '$250,00 USD', '$150,00 USD', '$540,00 USD', '$1500 USD', '$180,00 USD']
  
  return {
    id: `p${i}`,
    name: names[i % names.length],
    type: types[i % types.length],
    size: sizes[i % sizes.length],
    rentSale: rentSales[i % rentSales.length],
    bedrooms: bedrooms[i % bedrooms.length],
    location: locations[i % locations.length],
    price: prices[i % prices.length]
  }
}

type StatCardProps = {
  title: string
  value: string
  trend: number
  icon: React.ReactNode
}

function StatCard({ title, value, trend, icon }: StatCardProps) {
  const isPositive = trend > 0
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: isPositive ? 'success.light' : 'error.light', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          {icon}
        </Box>
        {isPositive ? <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: 18 }} /> : <ArrowDownwardIcon sx={{ color: 'error.main', fontSize: 18 }} />}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{title}</Typography>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>{value}</Typography>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="caption" color={isPositive ? 'success.main' : 'error.main'} fontWeight={600}>
          {Math.abs(trend)}% Last week
        </Typography>
      </Stack>
      <Link href="#" underline="hover" sx={{ mt: 1, display: 'block', fontSize: '0.875rem', color: 'primary.main', fontWeight: 500 }}>
        Show more →
      </Link>
    </Paper>
  )
}

export default function PropertyPage() {
  const navigate = useNavigate()
  const allData = useMemo<Property[]>(() => {
    const list: Property[] = []
    for (let i = 0; i < 100; i++) {
      list.push(makeProperty(i))
    }
    return list
  }, [])

  const [page, setPage] = useState(2)
  const rowsPerPage = 10
  const [orderBy, setOrderBy] = useState<keyof Property>('name')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<string[]>([])

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

  function handleRequestSort(property: keyof Property) {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = pageData.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleSelectRow = (id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  // actions menu
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const openMenu = Boolean(menuAnchor)
  function handleOpenMenu(id: string, el: HTMLElement) { setActiveId(id); setMenuAnchor(el) }
  function handleCloseMenu() { setMenuAnchor(null); setActiveId(null) }

  function handleAction(action: 'view' | 'edit' | 'delete' | 'auction') {
    console.log(action, activeId)
    handleCloseMenu()
    if (action === 'view' && activeId) navigate(`/property/${activeId}`)
    if (action === 'delete') alert('Property deleted (mock).')
    if (action === 'auction' && activeId) {
      // Navigate to auction submission with property ID
      navigate(`/submit-auction?propertyId=${activeId}`)
    }
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const getRentSaleColor = (rentSale: Property['rentSale']) => {
    if (rentSale === 'Rent') return 'success'
    if (rentSale === 'Sold') return 'warning'
    return 'warning'
  }

  return (
    <div className="dash" style={{ padding: 16, display:'grid', gap:16 }}>
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Typography variant="h5" fontWeight={800}>Property</Typography>
        <Button variant="contained" color="primary">+ Add Property</Button>
      </Box>

      <Box sx={{ display:'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        <StatCard title="Total Income" value="$12,7812.12" trend={12} icon={<ShoppingBagIcon />} />
        <StatCard title="Total Properties" value="15,780 Unit" trend={-8} icon={<BusinessIcon />} />
        <StatCard title="Unit Sold" value="893 Unit" trend={-16} icon={<AssignmentIcon />} />
        <StatCard title="Unit Rent" value="490 Unit" trend={12} icon={<AssignmentIcon />} />
      </Box>

      <Paper variant="outlined" sx={{ p: 0 }}>
        <Box sx={{ px: 2, py: 1.5, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Typography fontWeight={700}>All Properties List</Typography>
          <Select size="small" defaultValue="last-month">
            <MenuItem value="last-month">Last Month</MenuItem>
            <MenuItem value="this-month">This Month</MenuItem>
          </Select>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < pageData.length}
                    checked={pageData.length > 0 && selected.length === pageData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Properties Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'type'}
                    direction={orderBy === 'type' ? order : 'asc'}
                    onClick={() => handleRequestSort('type')}
                  >
                    Properties Type
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'size'}
                    direction={orderBy === 'size' ? order : 'asc'}
                    onClick={() => handleRequestSort('size')}
                  >
                    Size
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'rentSale'}
                    direction={orderBy === 'rentSale' ? order : 'asc'}
                    onClick={() => handleRequestSort('rentSale')}
                  >
                    Rent/Sale
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'bedrooms'}
                    direction={orderBy === 'bedrooms' ? order : 'asc'}
                    onClick={() => handleRequestSort('bedrooms')}
                  >
                    Bedrooms
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'location'}
                    direction={orderBy === 'location' ? order : 'asc'}
                    onClick={() => handleRequestSort('location')}
                  >
                    Location
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'price'}
                    direction={orderBy === 'price' ? order : 'asc'}
                    onClick={() => handleRequestSort('price')}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageData.map((row) => {
                const isItemSelected = isSelected(row.id)
                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => handleSelectRow(row.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300' }}>N</Avatar>
                        <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.size}</TableCell>
                    <TableCell>
                      <Chip label={row.rentSale} color={getRentSaleColor(row.rentSale)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <BedIcon fontSize="small" color="action" />
                        <span>{row.bedrooms}</span>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(row.id, e.currentTarget)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', px: 2, py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Page {page} of {Math.ceil(sorted.length / rowsPerPage)}
          </Typography>
          <Pagination count={Math.ceil(sorted.length / rowsPerPage)} page={page} onChange={(_, p) => setPage(p)} />
        </Box>
      </Paper>

      <Menu anchorEl={menuAnchor} open={openMenu} onClose={handleCloseMenu}>
        <MenuItem onClick={() => handleAction('view')}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem onClick={() => handleAction('auction')}>
          <GavelIcon fontSize="small" sx={{ mr: 1 }} />
          Submit for Auction
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </div>
  )
}
