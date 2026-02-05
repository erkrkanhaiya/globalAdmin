import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Grid from '@mui/material/GridLegacy'
import DownloadIcon from '@mui/icons-material/Download'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import PersonIcon from '@mui/icons-material/Person'
import DescriptionIcon from '@mui/icons-material/Description'
import FacebookIcon from '@mui/icons-material/Facebook'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import TwitterIcon from '@mui/icons-material/Twitter'
import ChatIcon from '@mui/icons-material/Chat'
import BedIcon from '@mui/icons-material/Bed'
import BathtubIcon from '@mui/icons-material/Bathtub'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import HomeIcon from '@mui/icons-material/Home'

export default function AgentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock data - replace with actual API call
  const agent = {
    name: 'Sophia Williams',
    email: 'sophiawilliams@gmail.com',
    age: '34',
    city: 'New York city',
    state: 'New York',
    country: 'USA',
    agency: 'Universe Realtors',
    license: 'LC-5758-2028-3944',
    textNumber: 'TC-9275-PC-55685',
    servicesArea: 'Lincoln Drive Harrisburg',
    totalProperty: 243,
    propertySold: 120,
    propertyRent: 123,
    totalPropertyPercent: 23,
    propertySoldPercent: 54,
    propertyRentPercent: 46
  }

  return (
    <Box sx={{ p: 2, display:'flex', flexDirection:'column', gap:2 }}>
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Typography variant="h5" fontWeight={800}>Agent / Agent Details</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/agents/new')}>+ Add Agent</Button>
      </Box>

      <Paper variant="outlined" sx={{ overflow:'hidden' }}>
        <Box sx={{ height: 320, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500' }}>
          <HomeIcon sx={{ fontSize: 80, opacity: 0.5 }} />
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p:3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb:2 }}>Agent Details</Typography>
            
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb:1 }}>About Michael:</Typography>
            <Typography variant="body1" paragraph sx={{ mb:2 }}>
              Sophia Williams is a dedicated and knowledgeable property agent who brings a wealth of experience to every transaction. With a commitment to excellence and a deep understanding of the real estate market, Sophia ensures her clients receive personalized service tailored to their unique needs. Her expertise spans residential and commercial properties, making her a trusted advisor for buyers, sellers, and investors alike. Known for her strong negotiation skills and attention to detail, Sophia consistently delivers results that exceed expectations.
            </Typography>
            <Button variant="outlined" sx={{ textTransform:'none', bgcolor:'action.hover', borderColor:'primary.main', color:'primary.main' }}>View More {'>'}</Button>

            <Divider sx={{ my:3 }} />

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb:2 }}>Agency Information</Typography>
            <Stack spacing={1.5} sx={{ mb:3 }}>
              <Typography variant="body2"><strong>Agency:</strong> {agent.agency}</Typography>
              <Typography variant="body2"><strong>Agency License:</strong> {agent.license}</Typography>
              <Typography variant="body2"><strong>Text Number:</strong> {agent.textNumber}</Typography>
              <Typography variant="body2"><strong>Services Area:</strong> {agent.servicesArea}</Typography>
            </Stack>

            <Divider sx={{ my:3 }} />

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb:2 }}>Property Status</Typography>
            <Grid container spacing={2} sx={{ mb:3 }}>
              <Grid item xs={4}>
                <Paper variant="outlined" sx={{ p:2, bgcolor:'grey.50', textAlign:'center' }}>
                  <Box sx={{ position:'relative', display:'inline-flex', mb:1 }}>
                    <CircularProgress variant="determinate" value={agent.totalPropertyPercent} size={100} thickness={4} sx={{ color: 'warning.main', transform: 'rotate(-90deg)' }} />
                    <Box sx={{ position:'absolute', top:0, left:0, bottom:0, right:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Typography variant="h6" fontWeight={700} color="warning.main">{agent.totalPropertyPercent}%</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb:0.5 }}>Total Property</Typography>
                  <Typography variant="h6" fontWeight={700}>{agent.totalProperty}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper variant="outlined" sx={{ p:2, bgcolor:'grey.50', textAlign:'center' }}>
                  <Box sx={{ position:'relative', display:'inline-flex', mb:1 }}>
                    <CircularProgress variant="determinate" value={agent.propertySoldPercent} size={100} thickness={4} sx={{ color: 'success.main', transform: 'rotate(-90deg)' }} />
                    <Box sx={{ position:'absolute', top:0, left:0, bottom:0, right:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Typography variant="h6" fontWeight={700} color="success.main">{agent.propertySoldPercent}%</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb:0.5 }}>Property sold</Typography>
                  <Typography variant="h6" fontWeight={700}>{agent.propertySold}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper variant="outlined" sx={{ p:2, bgcolor:'grey.50', textAlign:'center' }}>
                  <Box sx={{ position:'relative', display:'inline-flex', mb:1 }}>
                    <CircularProgress variant="determinate" value={agent.propertyRentPercent} size={100} thickness={4} sx={{ color: 'primary.main', transform: 'rotate(-90deg)' }} />
                    <Box sx={{ position:'absolute', top:0, left:0, bottom:0, right:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Typography variant="h6" fontWeight={700} color="primary.main">{agent.propertyRentPercent}%</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb:0.5 }}>Property Rent</Typography>
                  <Typography variant="h6" fontWeight={700}>{agent.propertyRent}</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my:3 }} />

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb:2 }}>Property Files</Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', p:1.5, bgcolor:'action.hover', borderRadius:1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PictureAsPdfIcon sx={{ color:'#ef4444' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Property-File.pdf</Typography>
                    <Typography variant="caption" color="text.secondary">2.5MB</Typography>
                  </Box>
                </Stack>
                <IconButton size="small"><DownloadIcon /></IconButton>
              </Box>
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', p:1.5, bgcolor:'action.hover', borderRadius:1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PersonIcon sx={{ color:'#ff7a45' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Client-list.pdf</Typography>
                    <Typography variant="caption" color="text.secondary">2.5MB</Typography>
                  </Box>
                </Stack>
                <IconButton size="small"><DownloadIcon /></IconButton>
              </Box>
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', p:1.5, bgcolor:'action.hover', borderRadius:1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <DescriptionIcon sx={{ color:'#2563eb' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Area-sqft.pdf</Typography>
                    <Typography variant="caption" color="text.secondary">2.5MB</Typography>
                  </Box>
                </Stack>
                <IconButton size="small"><DownloadIcon /></IconButton>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p:2, mb:2 }}>
            <Stack alignItems="center" spacing={2}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>SW</Avatar>
              <Box sx={{ textAlign:'center', width:'100%' }}>
                <Typography variant="h6" fontWeight={700}>{agent.name}</Typography>
                <Typography variant="body2" color="text.secondary">{agent.email}</Typography>
              </Box>
              
              <Divider sx={{ width:'100%' }} />
              
              <Box sx={{ width:'100%' }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb:1, display:'block' }}>Social Media</Typography>
                <Stack direction="row" spacing={1} justifyContent="center">
                  <IconButton size="small" sx={{ bgcolor:'action.hover' }}><FacebookIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ bgcolor:'action.hover' }}><WhatsAppIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ bgcolor:'action.hover' }}><TwitterIcon fontSize="small" /></IconButton>
                </Stack>
              </Box>

              <Divider sx={{ width:'100%' }} />

              <Stack spacing={2} sx={{ width:'100%' }}>
                <TextField label="Age" value={agent.age} size="small" fullWidth />
                <TextField label="City" value={agent.city} size="small" fullWidth />
                <TextField label="State" value={agent.state} size="small" fullWidth />
                <TextField label="Country" value={agent.country} size="small" fullWidth />
              </Stack>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p:2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb:2 }}>Active list</Typography>
            <Stack spacing={2}>
              {[1, 2].map((i) => (
                <Card key={i} variant="outlined" sx={{ display:'flex' }}>
                  <Box sx={{ width: 120, bgcolor:'grey.300', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <HomeIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                  </Box>
                  <CardContent sx={{ flex:1, p:1.5, '&:last-child': { pb:1.5 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb:0.5 }}>
                      <Typography variant="h6" fontWeight={700}>$2200</Typography>
                      <Chip label="For Rent +" color="warning" size="small" />
                    </Stack>
                    <Stack direction="row" spacing={1.5} sx={{ mt:1 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <BedIcon fontSize="small" color="action" />
                        <Typography variant="caption">3 Beds</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <BathtubIcon fontSize="small" color="action" />
                        <Typography variant="caption">2 Bath</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <SquareFootIcon fontSize="small" color="action" />
                        <Typography variant="caption">200 sqft</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

