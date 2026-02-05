import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Grid from '@mui/material/GridLegacy'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { CloudUpload as CloudUploadIcon, Facebook as FacebookIcon, WhatsApp as WhatsAppIcon, Twitter as TwitterIcon, Chat as ChatIcon, Home as HomeIcon } from '@mui/icons-material'

export default function AddAgentPage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ p: 2, display:'flex', flexDirection:'column', gap:2 }}>
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Typography variant="h5" fontWeight={800}>Agent / Add Agent</Typography>
        <Button variant="contained" color="primary">+ Add Agent</Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p:3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb:3 }}>About Agent</Typography>
            
            <Stack spacing={2} sx={{ mb:3 }}>
              <TextField label="Agent Name" defaultValue="Sophia Williams" fullWidth />
              <TextField label="Agent ID Number" defaultValue="1ERP24578fd" fullWidth />
              <TextField type="email" label="Email" defaultValue="sophiawilliams@gmail.com" fullWidth />
              <TextField 
                multiline 
                rows={4} 
                label="Description" 
                defaultValue="Sophia Williams is a dedicated and knowledgeable property agent committed to helping clients find their perfect home or investment. With a keen eye for detail, market expertise, and a passion for real estate, Sophia consistently delivers exceptional results. Her strong communication skills, negotiation expertise, and commitment to client satisfaction make her an invaluable partner in your property journey."
                fullWidth 
              />
            </Stack>

            <Typography variant="h6" fontWeight={700} sx={{ mb:2 }}>Add Agent Photo</Typography>
            <Box 
              sx={{ 
                border: '2px dashed', 
                borderColor: 'grey.300', 
                borderRadius: 2, 
                p: 4, 
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'grey.50' }
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Drag & Drop here Or <span style={{ color: 'var(--primary)' }}>Click to browse</span>
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ mt:3 }}>
              <TextField label="Agent Number" defaultValue="(239) 555-0108" fullWidth />
              <TextField label="Properties Number" defaultValue="#124587451" fullWidth />
              <TextField label="Agent Address" defaultValue="1901 Thornridge Cir. Shiloh, Hawaii 81063" fullWidth />
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select defaultValue="USA" label="Country">
                  <MenuItem value="USA">USA</MenuItem>
                  <MenuItem value="Canada">Canada</MenuItem>
                  <MenuItem value="UK">UK</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt:3 }}>
              <Button variant="outlined" onClick={() => navigate('/agents')}>Cancel</Button>
              <Button variant="contained" color="primary">Save</Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ overflow:'hidden' }}>
            <Box sx={{ height: 200, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500' }}>
              <HomeIcon sx={{ fontSize: 80, opacity: 0.5 }} />
            </Box>
            <Box sx={{ position: 'relative', textAlign: 'center', pb: 2 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mx: 'auto', mt: -4, mb: 2 }}>SW</Avatar>
              <Typography variant="h6" fontWeight={700}>Sophia Williams</Typography>
              <Typography variant="body2" color="text.secondary">sophiawilliams@gmail.com</Typography>
              
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ my: 2 }}>
                <IconButton size="small" sx={{ bgcolor:'action.hover' }}><FacebookIcon fontSize="small" /></IconButton>
                <IconButton size="small" sx={{ bgcolor:'action.hover' }}><WhatsAppIcon fontSize="small" /></IconButton>
                <IconButton size="small" sx={{ bgcolor:'action.hover' }}><TwitterIcon fontSize="small" /></IconButton>
                <IconButton size="small" sx={{ bgcolor:'action.hover' }}><ChatIcon fontSize="small" /></IconButton>
              </Stack>

              <Divider sx={{ mx: 2, mb: 2 }} />
              
              <Stack spacing={2} sx={{ px: 2 }}>
                <TextField label="Age" defaultValue="34" size="small" fullWidth />
                <TextField label="City" defaultValue="New York city" size="small" fullWidth />
                <TextField label="State" defaultValue="New York" size="small" fullWidth />
                <TextField label="Country" defaultValue="USA" size="small" fullWidth />
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

