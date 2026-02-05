import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/GridLegacy'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
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
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import GavelIcon from '@mui/icons-material/Gavel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import HomeIcon from '@mui/icons-material/Home'
import Link from '@mui/material/Link'

type AuctionRequest = {
  id: string
  propertyTitle: string
  propertyAddress: string
  owner: string
  ownerAvatar: string
  submittedDate: string
  reservePrice: number
  status: 'pending' | 'approved' | 'declined'
  auctionDate?: string
  paymentLink?: string
}

function makeRequest(i: number): AuctionRequest {
  const owners = ['Sophia Williams', 'Emma Thompson', 'Michael Brown', 'Olivia Davis', 'James Wilson', 'Isabella Martinez']
  const properties = [
    { title: 'Luxury Penthouse Downtown', address: '123 Park Avenue, New York, NY 10017' },
    { title: 'Modern Beachfront Villa', address: '456 Ocean Drive, Miami Beach, FL 33139' },
    { title: 'Historic Brownstone', address: '789 Washington Street, Boston, MA 02108' },
    { title: 'Mountain View Estate', address: '321 Hilltop Road, Aspen, CO 81611' },
    { title: 'Urban Loft Studio', address: '654 Loft Street, Seattle, WA 98101' },
    { title: 'Suburban Family Home', address: '987 Maple Lane, Austin, TX 78701' }
  ]
  const statuses: AuctionRequest['status'][] = ['pending', 'approved', 'declined']
  
  const prop = properties[i % properties.length]
  const owner = owners[i % owners.length]
  const status = statuses[i % statuses.length]
  
  return {
    id: `AU${String(i + 1).padStart(4, '0')}`,
    propertyTitle: prop.title,
    propertyAddress: prop.address,
    owner,
    ownerAvatar: owner.split(' ').map(n => n[0]).join(''),
    submittedDate: new Date(2024, 11, i + 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    reservePrice: 150000 + (i * 50000),
    status,
    ...(status === 'approved' && {
      auctionDate: new Date(2024, 11, i + 15).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      paymentLink: 'https://pay.example.com/auction/AU0001'
    })
  }
}

type SortableField = 'propertyTitle' | 'owner' | 'submittedDate' | 'reservePrice'

export default function AuctionRequestsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<SortableField>('submittedDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRequest, setSelectedRequest] = useState<AuctionRequest | null>(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false)
  const [auctionDate, setAuctionDate] = useState('')
  const [paymentLink, setPaymentLink] = useState('')
  const [declineReason, setDeclineReason] = useState('')

  const rowsPerPage = 10
  const allRequests = Array.from({ length: 24 }, (_, i) => makeRequest(i))

  const filteredAndSortedRequests = useMemo(() => {
    let filtered = allRequests.filter(req => {
      const matchesSearch = 
        req.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter
      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]
      if (sortField === 'reservePrice') {
        aVal = a.reservePrice
        bVal = b.reservePrice
      }
      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    })

    return filtered
  }, [searchQuery, statusFilter, sortField, sortDirection, allRequests])

  const paginatedRequests = filteredAndSortedRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  )

  const handleSort = (field: SortableField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, request: AuctionRequest) => {
    setAnchorEl(event.currentTarget)
    setSelectedRequest(request)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRequest(null)
  }

  const handleApprove = () => {
    if (!selectedRequest) return
    setApproveDialogOpen(true)
  }

  const handleDecline = () => {
    if (!selectedRequest) return
    setDeclineDialogOpen(true)
  }

  const handleApproveSubmit = () => {
    // Handle approve logic here
    console.log('Approving:', selectedRequest?.id, { auctionDate, paymentLink })
    alert('Auction request approved successfully!')
    handleMenuClose()
    setApproveDialogOpen(false)
    setAuctionDate('')
    setPaymentLink('')
    setSelectedRequest(null)
  }

  const handleDeclineSubmit = () => {
    // Handle decline logic here
    console.log('Declining:', selectedRequest?.id, declineReason)
    alert('Auction request declined successfully!')
    handleMenuClose()
    setDeclineDialogOpen(false)
    setDeclineReason('')
    setSelectedRequest(null)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'warning'
      case 'approved': return 'success'
      case 'declined': return 'error'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'Pending'
      case 'approved': return 'Approved'
      case 'declined': return 'Declined'
      default: return status
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
            Auction Requests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and manage property auction requests
          </Typography>
        </Box>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48 }}>
                <GavelIcon sx={{ color: 'warning.main' }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {allRequests.filter(r => r.status === 'pending').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Pending Requests
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                <CheckCircleIcon sx={{ color: 'success.main' }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {allRequests.filter(r => r.status === 'approved').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Approved
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'error.light', width: 48, height: 48 }}>
                <CancelIcon sx={{ color: 'error.main' }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {allRequests.filter(r => r.status === 'declined').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Declined
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                <HomeIcon sx={{ color: 'primary.main' }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {allRequests.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Requests
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            placeholder="Search properties, owners..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            sx={{ flex: 1 }}
          />
          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            startAdornment={<FilterListIcon sx={{ mr: 1, color: 'action.active' }} />}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="declined">Declined</MenuItem>
          </Select>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'propertyTitle'}
                    direction={sortField === 'propertyTitle' ? sortDirection : 'asc'}
                    onClick={() => handleSort('propertyTitle')}
                  >
                    Property
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'owner'}
                    direction={sortField === 'owner' ? sortDirection : 'asc'}
                    onClick={() => handleSort('owner')}
                  >
                    Owner
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'submittedDate'}
                    direction={sortField === 'submittedDate' ? sortDirection : 'asc'}
                    onClick={() => handleSort('submittedDate')}
                  >
                    Submitted
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'reservePrice'}
                    direction={sortField === 'reservePrice' ? sortDirection : 'asc'}
                    onClick={() => handleSort('reservePrice')}
                  >
                    Reserve Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Auction Details</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {request.propertyTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.propertyAddress}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {request.ownerAvatar}
                      </Avatar>
                      <Typography variant="body2">{request.owner}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CalendarTodayIcon fontSize="small" color="action" />
                      <Typography variant="body2">{request.submittedDate}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <AttachMoneyIcon fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={600}>
                        {request.reservePrice.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(request.status)}
                      color={getStatusColor(request.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {request.status === 'approved' && request.auctionDate && request.paymentLink ? (
                      <Box>
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                          <CalendarTodayIcon fontSize="small" color="success" />
                          <Typography variant="caption" fontWeight={600} color="success.main">
                            {request.auctionDate}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary" component="div" noWrap>
                          <Link href={request.paymentLink} target="_blank" sx={{ fontSize: 'inherit' }}>
                            Payment Link
                          </Link>
                        </Typography>
                      </Box>
                    ) : request.status === 'declined' ? (
                      <Typography variant="caption" color="error" fontStyle="italic">
                        Request declined
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary" fontStyle="italic">
                        Pending approval
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="More actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, request)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination
            count={Math.ceil(filteredAndSortedRequests.length / rowsPerPage)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleApprove} disabled={selectedRequest?.status !== 'pending'}>
          <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
          Approve & Set Auction
        </MenuItem>
        <MenuItem onClick={handleDecline} disabled={selectedRequest?.status !== 'pending'}>
          <CancelIcon fontSize="small" sx={{ mr: 1 }} />
          Decline Request
        </MenuItem>
      </Menu>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Auction Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Auction Date"
              type="date"
              fullWidth
              value={auctionDate}
              onChange={(e) => setAuctionDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Payment Link"
              fullWidth
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
              placeholder="https://pay.example.com/auction/AU0001"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleApproveSubmit}
            disabled={!auctionDate || !paymentLink}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={declineDialogOpen} onClose={() => setDeclineDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Decline Auction Request</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for Decline"
            fullWidth
            multiline
            rows={4}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Please provide a reason for declining this auction request..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeclineDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeclineSubmit}
            disabled={!declineReason.trim()}
          >
            Decline
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

