import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import InfoIcon from '@mui/icons-material/Info'
import SellIcon from '@mui/icons-material/Sell'
import ApartmentIcon from '@mui/icons-material/Apartment'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { useUiStore } from '@/store/ui'

export default function Topbar() {
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()
  const toggleSidebar = useUiStore(s => s.toggleSidebar)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null)
  const openNotif = Boolean(notifAnchor)
  const handleNotifOpen = (e: React.MouseEvent<HTMLElement>) => setNotifAnchor(e.currentTarget)
  const handleNotifClose = () => setNotifAnchor(null)

  // Mock notification data
  const notifications = [
    { id: 1, type: 'success', icon: <CheckCircleIcon fontSize="small" />, title: 'Property Sold', message: 'Luxury Penthouse has been sold successfully', time: '5 min ago', category: 'property' },
    { id: 2, type: 'warning', icon: <WarningIcon fontSize="small" />, title: 'Payment Pending', message: '3 property payments are waiting approval', time: '15 min ago', category: 'financial' },
    { id: 3, type: 'info', icon: <PersonIcon fontSize="small" />, title: 'New Agent', message: 'Sophia Williams joined your team', time: '1 hour ago', category: 'agent' },
    { id: 4, type: 'success', icon: <SellIcon fontSize="small" />, title: 'Property Added', message: 'New York Residence added to listings', time: '2 hours ago', category: 'property' },
    { id: 5, type: 'info', icon: <AssignmentIcon fontSize="small" />, title: 'Rent Due', message: '5 properties have rent due this week', time: '3 hours ago', category: 'financial' }
  ]

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'success': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'error': return '#ef4444'
      default: return '#3b82f6'
    }
  }

  const getNotificationBgColor = (type: string) => {
    switch(type) {
      case 'success': return 'success.light'
      case 'warning': return 'warning.light'
      case 'error': return 'error.light'
      default: return 'info.light'
    }
  }

  const handleNotificationClick = (category: string) => {
    handleNotifClose()
    if (category === 'property') navigate('/property')
    if (category === 'financial') navigate('/transaction')
    if (category === 'agent') navigate('/agents')
  }

  const [msgAnchor, setMsgAnchor] = useState<null | HTMLElement>(null)
  const openMsg = Boolean(msgAnchor)
  const handleMsgOpen = (e: React.MouseEvent<HTMLElement>) => setMsgAnchor(e.currentTarget)
  const handleMsgClose = () => setMsgAnchor(null)

  // Mock messages data
  const messages = [
    { id: 1, name: 'Annette Black', preview: 'Hi! I\'m interested in the New York property...', time: '2 min ago', unread: true, avatar: 'A' },
    { id: 2, name: 'Devon Lane', preview: 'Can we schedule a viewing for tomorrow?', time: '15 min ago', unread: true, avatar: 'D' },
    { id: 3, name: 'Ralph Edwards', preview: 'The contract is ready for review', time: '1 hour ago', unread: false, avatar: 'R' },
  ]

  return (
    <AppBar elevation={0} color="transparent" position="static" sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}>
      <Toolbar sx={{ gap: 2 }}>
        <IconButton color="inherit" sx={{ display: { md: 'none' } }} onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        <TextField
          placeholder="Search…  ⌘K"
          size="small"
          fullWidth
          sx={{ maxWidth: 420 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit" onClick={handleMsgOpen}>
          <Badge color="error" variant="dot">
            <ChatBubbleOutlineIcon />
          </Badge>
        </IconButton>
        
        <Menu 
          anchorEl={msgAnchor} 
          open={openMsg} 
          onClose={handleMsgClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: { width: 360, maxHeight: 500, mt: 1 }
          }}
        >
          <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={700}>Messages</Typography>
            <Chip label={messages.filter(m => m.unread).length} size="small" color="error" />
          </Box>
          <Divider />
          <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
            {messages.map((msg, idx) => (
              <Box key={msg.id}>
                <MenuItem 
                  onClick={handleMsgClose}
                  sx={{ py: 1.5, px: 2 }}
                >
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', mr: 1.5, fontWeight: 700 }}>{msg.avatar}</Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={msg.unread ? 700 : 500} noWrap>{msg.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{msg.time}</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }} noWrap>
                      {msg.preview}
                    </Typography>
                  </Box>
                </MenuItem>
                {idx < messages.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
          <Divider />
          <Box sx={{ px: 2, py: 1.5 }}>
            <Button fullWidth variant="outlined" size="small" onClick={() => { handleMsgClose(); navigate('/inbox') }}>View All Messages</Button>
          </Box>
        </Menu>
        <IconButton color="inherit" onClick={handleNotifOpen}>
          <Badge color="error" badgeContent={notifications.length}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
        
        <Menu 
          anchorEl={notifAnchor} 
          open={openNotif} 
          onClose={handleNotifClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: { width: 380, maxHeight: 500, mt: 1 }
          }}
        >
          <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={700}>Notifications</Typography>
            <Chip label={notifications.length} size="small" color="primary" />
          </Box>
          <Divider />
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {notifications.map((notif, idx) => (
              <Box key={notif.id}>
                <MenuItem 
                  onClick={() => handleNotificationClick(notif.category)}
                  sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1.5, px: 2 }}
                >
                  <Stack direction="row" spacing={1.5} width="100%">
                    <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: getNotificationBgColor(notif.type), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                      {notif.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>{notif.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>{notif.message}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {notif.time}
                      </Typography>
                    </Box>
                  </Stack>
                </MenuItem>
                {idx < notifications.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
          <Divider />
          <Box sx={{ px: 2, py: 1.5 }}>
            <Button fullWidth variant="outlined" size="small">View All Notifications</Button>
          </Box>
        </Menu>

        <Box sx={{ display:'flex', alignItems:'center', gap: 1.5 }}>
          <Box sx={{ textAlign:'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" fontWeight={700}>{user?.name || 'Ralph Edwards'}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.email || 'edwards@gmail.com'}</Typography>
          </Box>
          <IconButton onClick={handleMenu} size="small">
            <Avatar alt={user?.name || 'U'} src={undefined} sx={{ width: 36, height: 36 }} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem onClick={() => { handleClose(); navigate('/settings') }}>Profile</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/settings') }}>Settings</MenuItem>
            <MenuItem onClick={() => { handleClose(); handleLogout() }}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

