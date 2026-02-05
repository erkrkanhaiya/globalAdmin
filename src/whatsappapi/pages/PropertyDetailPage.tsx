import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/GridLegacy'
import Avatar from '@mui/material/Avatar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HomeIcon from '@mui/icons-material/Home'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BedIcon from '@mui/icons-material/Bed'
import BathtubIcon from '@mui/icons-material/Bathtub'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import ShareIcon from '@mui/icons-material/Share'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock data - replace with actual API call
  const property = {
    name: 'New York Residence',
    type: 'House',
    size: '1400ft',
    bedrooms: 5,
    bathrooms: 3,
    rentSale: 'Sale' as const,
    location: 'France',
    price: '$250,000 USD',
    status: 'Available',
    description: 'Beautiful modern house with spacious rooms and excellent amenities. Perfect for families looking for comfort and luxury. Located in a prime area with easy access to schools, shopping centers, and public transportation.',
    agent: {
      name: 'Sophia Williams',
      email: 'sophia@example.com',
      phone: '(239) 555-0108',
      avatar: 'SW'
    },
    features: ['Swimming Pool', 'Garden', 'Garage', 'Air Conditioning', 'Security System', 'WiFi'],
    yearBuilt: '2018',
    listedDate: '2024-01-15',
    propertyId: 'PROP001'
  }

  const getRentSaleColor = (rentSale: string) => {
    if (rentSale === 'Rent') return 'success'
    if (rentSale === 'Sold') return 'warning'
    return 'warning'
  }

  return (
    <Box sx={{ p: 2, display:'flex', flexDirection:'column', gap:2 }}>
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => navigate('/property')}><ArrowBackIcon /></IconButton>
          <Typography variant="h5" fontWeight={800}>Property / Property Details</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ShareIcon />}>Share</Button>
          <Button variant="outlined" startIcon={<FavoriteBorderIcon />}>Save</Button>
          <Button variant="contained" color="primary">Edit Property</Button>
        </Stack>
      </Box>

      <Paper variant="outlined" sx={{ overflow:'hidden' }}>
        <Box sx={{ height: 400, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500' }}>
          <HomeIcon sx={{ fontSize: 100, opacity: 0.5 }} />
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p:3 }}>
            <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:3 }}>
              <Box>
                <Typography variant="h4" fontWeight={700} sx={{ mb:1 }}>{property.name}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">{property.location}</Typography>
                </Stack>
              </Box>
              <Chip label={property.rentSale} color={getRentSaleColor(property.rentSale)} />
            </Box>

            <Stack direction="row" spacing={2} sx={{ mb:3 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <BedIcon color="action" />
                <Typography variant="body2"><strong>{property.bedrooms}</strong> Bedrooms</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <BathtubIcon color="action" />
                <Typography variant="body2"><strong>{property.bathrooms}</strong> Bathrooms</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <SquareFootIcon color="action" />
                <Typography variant="body2"><strong>{property.size}</strong></Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my:3 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb:2 }}>Description</Typography>
            <Typography variant="body1" paragraph color="text.secondary" sx={{ mb:2 }}>
              {property.description}
            </Typography>

            <Divider sx={{ my:3 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb:2 }}>Property Details</Typography>
            <Grid container spacing={2} sx={{ mb:3 }}>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Property Type</Typography>
                <Typography variant="body2" fontWeight={600}>{property.type}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Size</Typography>
                <Typography variant="body2" fontWeight={600}>{property.size}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Year Built</Typography>
                <Typography variant="body2" fontWeight={600}>{property.yearBuilt}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Bedrooms</Typography>
                <Typography variant="body2" fontWeight={600}>{property.bedrooms}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Bathrooms</Typography>
                <Typography variant="body2" fontWeight={600}>{property.bathrooms}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Property ID</Typography>
                <Typography variant="body2" fontWeight={600}>{property.propertyId}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my:3 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb:2 }}>Features & Amenities</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {property.features.map((feature, idx) => (
                <Chip key={idx} label={feature} variant="outlined" size="small" />
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p:3, mb:2 }}>
            <Box sx={{ textAlign:'center', mb:3 }}>
              <Typography variant="h4" fontWeight={800} color="primary" sx={{ mb:1 }}>{property.price}</Typography>
              <Typography variant="body2" color="text.secondary">Price</Typography>
            </Box>

            <Divider sx={{ my:3 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb:2 }}>Contact Agent</Typography>
            <Stack spacing={2} sx={{ mb:3 }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                <Avatar sx={{ width: 50, height: 50, bgcolor: 'primary.main', fontWeight: 700 }}>{property.agent.avatar}</Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{property.agent.name}</Typography>
                  <Typography variant="caption" color="text.secondary">Real Estate Agent</Typography>
                </Box>
              </Box>
              <Button variant="contained" fullWidth size="large">Contact Now</Button>
            </Stack>

            <Stack spacing={1.5}>
              <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2">{property.agent.email}</Typography>
              </Box>
              <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2">{property.agent.phone}</Typography>
              </Box>
              <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                <CalendarTodayIcon fontSize="small" color="action" />
                <Typography variant="body2">Listed: {property.listedDate}</Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p:3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb:2 }}>Request Information</Typography>
            <Stack spacing={2}>
              <Button variant="outlined" fullWidth>Schedule Viewing</Button>
              <Button variant="outlined" fullWidth>Request Documents</Button>
              <Button variant="outlined" fullWidth>Make an Offer</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

