import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/GridLegacy'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import HomeIcon from '@mui/icons-material/Home'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import DescriptionIcon from '@mui/icons-material/Description'

export default function SubmitAuctionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const propertyId = searchParams.get('propertyId')
  
  const [formData, setFormData] = useState({
    propertyTitle: '',
    propertyAddress: '',
    propertyDescription: '',
    reservePrice: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    area: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Mock function to load property data
  useEffect(() => {
    if (propertyId) {
      // In real app, fetch property details by ID
      // For now, pre-fill with sample data
      setFormData({
        propertyTitle: `Property ${propertyId}`,
        propertyAddress: 'Sample Address',
        propertyDescription: 'Sample property description',
        reservePrice: '150000',
        propertyType: 'house',
        bedrooms: '3',
        bathrooms: '2',
        area: '1400'
      })
    }
  }, [propertyId])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.propertyTitle || !formData.propertyAddress || !formData.reservePrice) {
      setError('Please fill in all required fields')
      return
    }

    // Handle submission logic here
    console.log('Submitting auction request:', formData)
    setSuccess(true)
    setTimeout(() => {
      navigate('/property')
    }, 2000)
  }

  if (success) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }} color="success.main">
            Request Submitted Successfully!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your auction request has been submitted and is pending admin approval. 
            You will be notified once a decision is made.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/property')}>
            Back to Properties
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
          Submit Auction Request
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fill in the property details to submit an auction request
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Property Title */}
                <TextField
                  required
                  label="Property Title"
                  fullWidth
                  value={formData.propertyTitle}
                  onChange={(e) => handleChange('propertyTitle', e.target.value)}
                  placeholder="e.g., Luxury Penthouse Downtown"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />

                {/* Property Address */}
                <TextField
                  required
                  label="Property Address"
                  fullWidth
                  value={formData.propertyAddress}
                  onChange={(e) => handleChange('propertyAddress', e.target.value)}
                  placeholder="e.g., 123 Park Avenue, New York, NY 10017"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />

                {/* Property Description */}
                <TextField
                  label="Property Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.propertyDescription}
                  onChange={(e) => handleChange('propertyDescription', e.target.value)}
                  placeholder="Describe the property, its features, and any notable details..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <DescriptionIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />

                {/* Property Details Grid */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Property Type</InputLabel>
                      <TextField
                        select
                        value={formData.propertyType}
                        onChange={(e) => handleChange('propertyType', e.target.value)}
                        SelectProps={{
                          native: true
                        }}
                      >
                        <option value="">Select Type</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="condo">Condo</option>
                        <option value="studio">Studio</option>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Bedrooms"
                      fullWidth
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleChange('bedrooms', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Bathrooms"
                      fullWidth
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleChange('bathrooms', e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Area (sq ft)"
                      fullWidth
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleChange('area', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      label="Reserve Price"
                      fullWidth
                      type="number"
                      value={formData.reservePrice}
                      onChange={(e) => handleChange('reservePrice', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Photo Upload */}
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Property Photos
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    component="label"
                    fullWidth
                  >
                    Upload Photos
                    <input type="file" hidden multiple accept="image/*" />
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Upload multiple photos of your property (max 10 images)
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => navigate('/property')}>
                    Cancel
                  </Button>
                  <Button variant="contained" type="submit">
                    Submit for Approval
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Info Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Auction Process
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                  1. Submit Request
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fill in your property details and submit for admin review
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                  2. Admin Review
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Our team will review your request within 24-48 hours
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                  3. Approval & Auction Date
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  If approved, you'll receive auction date and payment details
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                  4. Auction Day
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Property goes live for bidding on the scheduled date
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Important Notes
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div">
                • Reserve price must be competitive
                <br />
                • All information must be accurate
                <br />
                • Admin may request additional details
                <br />
                • Auction fees apply upon approval
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

