import { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/GridLegacy'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CardActions from '@mui/material/CardActions'
import StarIcon from '@mui/icons-material/Star'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BedIcon from '@mui/icons-material/Bed'
import BathtubIcon from '@mui/icons-material/Bathtub'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

type Property = {
  id: string
  name: string
  image: string
  rating: number
  reviews: number
  location: string
  beds: number
  baths: number
  area: string
  priceRange: string
}

const properties: Property[] = [
  {
    id: '1',
    name: 'Willow Brook Valley',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    rating: 4.5,
    reviews: 187,
    location: '1668 Lincoln Drive, USA',
    beds: 4,
    baths: 2,
    area: '1400ft',
    priceRange: '$80,675-$86,564'
  },
  {
    id: '2',
    name: 'Serent Residence',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    rating: 4.5,
    reviews: 187,
    location: '1668 Lincoln Drive, USA',
    beds: 4,
    baths: 2,
    area: '1400ft',
    priceRange: '$80,675-$86,564'
  },
  {
    id: '3',
    name: 'Riverbend Retreat',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    rating: 4.5,
    reviews: 187,
    location: '1668 Lincoln Drive, USA',
    beds: 4,
    baths: 2,
    area: '1400ft',
    priceRange: '$80,675-$86,564'
  },
  {
    id: '4',
    name: 'Tranquil Meadows',
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
    rating: 4.5,
    reviews: 187,
    location: '1668 Lincoln Drive, USA',
    beds: 4,
    baths: 2,
    area: '1400ft',
    priceRange: '$80,675-$86,564'
  },
  {
    id: '5',
    name: 'Hearthstone Mansion',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    rating: 4.5,
    reviews: 187,
    location: '1668 Lincoln Drive, USA',
    beds: 4,
    baths: 2,
    area: '1400ft',
    priceRange: '$80,675-$86,564'
  },
  {
    id: '6',
    name: 'Dreamweaver House',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    rating: 4.5,
    reviews: 187,
    location: '1668 Lincoln Drive, USA',
    beds: 4,
    baths: 2,
    area: '1400ft',
    priceRange: '$80,675-$86,564'
  }
]

export default function DiscoverPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Discover
        </Typography>
        <Button
          variant="contained"
          color="warning"
          startIcon={<FileDownloadIcon />}
          sx={{ 
            bgcolor: '#ff6b35',
            '&:hover': { bgcolor: '#e55a2b' }
          }}
        >
          Export
        </Button>
      </Box>

      {/* Property Grid */}
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <Card
              elevation={hoveredCard === property.id ? 8 : 0}
              onMouseEnter={() => setHoveredCard(property.id)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  '& .property-image': {
                    transform: 'scale(1.05)'
                  }
                }
              }}
            >
              <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={property.image}
                  alt={property.name}
                  className="property-image"
                  sx={{
                    transition: 'transform 0.3s',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  {property.name}
                </Typography>
                
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <StarIcon fontSize="small" sx={{ color: '#ff6b35' }} />
                  <Typography variant="body2" fontWeight={600}>
                    {property.rating} ({property.reviews})
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 2 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {property.location}
                  </Typography>
                </Stack>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                    Facilities
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      icon={<BedIcon />}
                      label={`${property.beds} Bed`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<BathtubIcon />}
                      label={`${property.baths} Bath`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<SquareFootIcon />}
                      label={property.area}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                    Price Range
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">
                    {property.priceRange}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<OpenInNewIcon />}
                  sx={{
                    bgcolor: '#ff6b35',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#e55a2b'
                    }
                  }}
                >
                  Open Map
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
