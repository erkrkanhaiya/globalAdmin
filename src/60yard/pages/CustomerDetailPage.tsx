import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/GridLegacy'
import TextField from '@mui/material/TextField'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BusinessIcon from '@mui/icons-material/Business'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import HomeIcon from '@mui/icons-material/Home'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

export default function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock data - replace with actual API call
  const customer = {
    name: 'Michael A. Miner',
    contact: '(808) 555-0111',
    type: 'Residential',
    status: 'Interested',
    lastConnected: '2025-01-20',
    propertiesInterested: [
      { id: 1, name: 'New York Residence', price: '$250,000', status: 'Viewing Scheduled' },
      { id: 2, name: 'Washington Villa', price: '$350,000', status: 'Interested' }
    ],
    totalProperties: 15,
    budget: '$200,000 - $400,000',
    preferredAreas: ['New York', 'Washington', 'London'],
    notes: 'Looking for a family home with at least 4 bedrooms. Prefers modern architecture with good schools nearby. Budget is flexible for the right property.',
    email: 'michael.miner@email.com',
    address: '123 Maple ST, New York, NY 10001',
    company: 'Tech Corp Inc.',
    timeline: [
      { date: '2025-01-20', action: 'Property viewing scheduled', property: 'New York Residence' },
      { date: '2025-01-18', action: 'Inquiry sent', property: 'Washington Villa' },
      { date: '2025-01-15', action: 'Account created', property: '' }
    ]
  }

  const getStatusColor = (status: string) => {
    if (status === 'Interested') return 'success'
    if (status === 'Under Review') return 'warning'
    return 'default'
  }

  return (
    <Box sx={{ p: 2, display:'flex', flexDirection:'column', gap:2 }}>
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => navigate('/customer')}><ArrowBackIcon /></IconButton>
          <Typography variant="h5" fontWeight={800}>Customer / Customer Details</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined">Message</Button>
          <Button variant="contained" color="primary">Edit Customer</Button>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p:3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb:3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32, fontWeight: 700 }}>
                {customer.name.split(' ').map(p => p[0]).join('')}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb:0.5 }}>{customer.name}</Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb:1 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">{customer.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">{customer.contact}</Typography>
                </Stack>
              </Box>
              <Chip label={customer.status} color={getStatusColor(customer.status)} />
            </Stack>

            <Divider sx={{ my:3 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb:2 }}>Customer Information</Typography>
            <Grid container spacing={2} sx={{ mb:3 }}>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Customer Type</Typography>
                <Typography variant="body2" fontWeight={600}>{customer.type}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Total Properties</Typography>
                <Typography variant="body2" fontWeight={600}>{customer.totalProperties}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Budget Range</Typography>
                <Typography variant="body2" fontWeight={600}>{customer.budget}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Company</Typography>
                <Typography variant="body2" fontWeight={600}>{customer.company}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Address</Typography>
                <Typography variant="body2" fontWeight={600}>{customer.address}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my:3 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb:2 }}>Preferred Areas</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {customer.preferredAreas.map((area, idx) => (
                <Chip key={idx} label={area} variant="outlined" icon={<LocationOnIcon />} />
              ))}
            </Stack>

            <Divider sx={{ my:3 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb:2 }}>Notes</Typography>
            <TextField multiline rows={4} fullWidth defaultValue={customer.notes} variant="outlined" />
          </Paper>

          <Paper variant="outlined" sx={{ p:3, mt:2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb:2 }}>Interested Properties</Typography>
            <Stack spacing={1.5}>
              {customer.propertiesInterested.map((prop) => (
                <Paper key={prop.id} variant="outlined" sx={{ p:2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <HomeIcon fontSize="small" color="action" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>{prop.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{prop.price}</Typography>
                    </Box>
                    <Chip label={prop.status} size="small" />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p:2, mb:2 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb:1, display:'block' }}>Customer Type</Typography>
                <Chip icon={<BusinessIcon />} label={customer.type} variant="outlined" />
              </Box>
              <Button variant="contained" fullWidth>Schedule Viewing</Button>
              <Button variant="outlined" fullWidth>Send Property List</Button>
              <Button variant="outlined" fullWidth>Add Note</Button>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p:2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb:2 }}>Activity Timeline</Typography>
            <Stack spacing={2}>
              {customer.timeline.map((item, idx) => (
                <Box key={idx}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                      <Typography variant="body2" fontWeight={600}>{item.action}</Typography>
                      {item.property && <Typography variant="caption" color="text.secondary">{item.property}</Typography>}
                    </Box>
                  </Stack>
                  {idx < customer.timeline.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

