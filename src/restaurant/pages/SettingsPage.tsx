import { useState } from 'react'
import { useAuthStore } from '@/restaurant/store/auth'
import { useLanguageStore } from '@/restaurant/store/language'
import { api } from '@/restaurant/api/client'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Grid from '@mui/material/GridLegacy'
import PersonIcon from '@mui/icons-material/Person'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PeopleIcon from '@mui/icons-material/People'
import BusinessIcon from '@mui/icons-material/Business'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import TuneIcon from '@mui/icons-material/Tune'
import DeleteIcon from '@mui/icons-material/Delete'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import LockIcon from '@mui/icons-material/Lock'
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import CheckIcon from '@mui/icons-material/Check'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import { useNavigate } from 'react-router-dom'

type TabPanelProps = {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

type LanguageOption = {
  id: string
  name: string
  code: string
  country: string
  flag: string
  langCode: string
}

type NotificationSetting = {
  id: string
  title: string
  description: string
  enabled: boolean
}

export default function SettingsPage() {
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  const languageStore = useLanguageStore()
  const [activeTab, setActiveTab] = useState(0)
  const [activeSubMenu, setActiveSubMenu] = useState(0)
  
  // Initialize selected language based on current language store
  const getInitialLanguageId = () => {
    const currentLang = languageStore.lang
    const langMap: Record<string, string> = {
      'en': 'USA',
      'fr': 'FR',
      'es': 'ES',
      'it': 'IT',
      'de': 'DE',
      'ja': 'JP',
      'zh': 'CN',
      'pt': 'BR',
      'hi': 'HI',
      'kn': 'KN',
      'ta': 'TA',
      'bn': 'BN',
      'mr': 'MR',
      'ml': 'ML',
      'te': 'TE',
      'or': 'OR',
      'as': 'AS',
      'pa': 'PA',
      'gu': 'GU'
    }
    return langMap[currentLang] || 'USA'
  }
  
  const [selectedLanguage, setSelectedLanguage] = useState(getInitialLanguageId())
  const [searchQuery, setSearchQuery] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    { id: 'order_confirm', title: 'Order Confirmation', description: 'Sent automatically to the customer after they place their order.', enabled: true },
    { id: 'order_edited', title: 'Order Edited', description: 'Sent to the customer after their order is edited (if you select this option).', enabled: true },
    { id: 'order_cancelled', title: 'Order Cancelled', description: 'Sent automatically to the customer if their order is cancelled (if you select this option).', enabled: false },
    { id: 'payment_error', title: 'Payment Error', description: 'Sent automatically to the customer if their payment can\'t be processed during checkout.', enabled: true },
    { id: 'customer_invite', title: 'Customer Account invite', description: 'Sent automatically to the customer after they place their order.', enabled: true },
    { id: 'contact_customer', title: 'Contact Customer', description: 'Sent automatically to the customer if their order is cancelled (if you select this option).', enabled: false },
    { id: 'password_reset', title: 'Account Password Reset', description: 'Sent automatically to the customer if their payment can\'t be processed during checkout.', enabled: true },
    { id: 'email_marketing', title: 'Email Marketing', description: 'Sent automatically to the customer after they place their order.', enabled: true }
  ])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    setActiveSubMenu(0)
  }

  const handleSubMenuChange = (index: number) => {
    setActiveSubMenu(index)
  }

  const handleNotificationToggle = (id: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    )
  }

  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const handlePasswordUpdate = async () => {
    setPasswordError(null)
    setPasswordSuccess(false)

    if (!oldPassword || !newPassword) {
      setPasswordError('Please fill in all password fields')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    setUpdatingPassword(true)
    try {
      const response = await api.patch('/user/change-password', {
        oldPassword,
        newPassword
      })

      if (response.data?.status === 'success' || response.status === 200) {
        setPasswordSuccess(true)
        setOldPassword('')
        setNewPassword('')
        setTimeout(() => setPasswordSuccess(false), 3000)
      } else {
        throw new Error(response.data?.message || 'Password update failed')
      }
    } catch (err: any) {
      console.error('Password update error:', err)
      console.error('Error details:', {
        response: err?.response?.data,
        status: err?.response?.status,
        token: localStorage.getItem('admin_token_v1') ? 'Present' : 'Missing',
      })
      
      // Extract error message from different error types
      let errorMessage = 'Failed to update password'
      
      if (err?.response) {
        // Server responded with error
        const status = err.response.status
        
        if (status === 401) {
          // Authentication error
          const serverMessage = err.response.data?.message || 'Authentication failed'
          if (serverMessage.includes('token') || serverMessage.includes('authorized')) {
            errorMessage = 'Your session has expired. Please log out and log in again.'
          } else {
            errorMessage = serverMessage
          }
        } else if (status === 400) {
          errorMessage = err.response.data?.message || 'Invalid request. Please check your input.'
        } else {
          errorMessage = err.response.data?.message || 
                        err.response.data?.error || 
                        `Server error: ${status} ${err.response.statusText}`
        }
      } else if (err?.request) {
        // Request made but no response (network error)
        errorMessage = 'Cannot connect to server. Please make sure the server is running on port 5001.'
      } else if (err?.message) {
        // Error message from interceptor or other source
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      setPasswordError(errorMessage)
    } finally {
      setUpdatingPassword(false)
    }
  }

  const handleNotificationsUpdate = () => {
    alert('Notification settings updated successfully!')
  }

  const subMenus = [
    { icon: <PersonIcon />, label: 'Profile Settings' },
    { icon: <CreditCardIcon />, label: 'Financial & Payment' },
    { icon: <PeopleIcon />, label: 'Tenant Management' },
    { icon: <BusinessIcon />, label: 'Property Management' },
    { icon: <AssignmentIcon />, label: 'Lease management' },
    { icon: <SettingsIcon />, label: 'System' },
    { icon: <NotificationsIcon />, label: 'Notifications' },
    { icon: <TuneIcon />, label: 'Preference' }
  ]

  const languages: LanguageOption[] = [
    { id: 'USA', name: 'English', code: 'USA', country: 'United States', flag: '🇺🇸', langCode: 'en' },
    { id: 'GBR', name: 'English', code: 'GBR', country: 'United Kingdom', flag: '🇬🇧', langCode: 'en' },
    { id: 'FR', name: 'France', code: 'FR', country: 'France', flag: '🇫🇷', langCode: 'fr' },
    { id: 'ES', name: 'Spain', code: 'ES', country: 'Spain', flag: '🇪🇸', langCode: 'es' },
    { id: 'IT', name: 'Italy', code: 'IT', country: 'Italy', flag: '🇮🇹', langCode: 'it' },
    { id: 'DE', name: 'Germany', code: 'DE', country: 'Germany', flag: '🇩🇪', langCode: 'de' },
    { id: 'JP', name: 'Japan', code: 'JP', country: 'Japan', flag: '🇯🇵', langCode: 'ja' },
    { id: 'CN', name: 'China', code: 'CN', country: 'China', flag: '🇨🇳', langCode: 'zh' },
    { id: 'BR', name: 'Portugal', code: 'BR', country: 'Brazil', flag: '🇧🇷', langCode: 'pt' },
    { id: 'GR', name: 'Greece', code: 'GR', country: 'Greece', flag: '🇬🇷', langCode: 'en' },
    { id: 'SG', name: 'Singapore', code: 'SG', country: 'Singapore', flag: '🇸🇬', langCode: 'en' },
    { id: 'NL', name: 'Netherlands', code: 'NL', country: 'Netherlands', flag: '🇳🇱', langCode: 'en' },
    { id: 'IN', name: 'India', code: 'IN', country: 'India', flag: '🇮🇳', langCode: 'en' },
    { id: 'HI', name: 'हिंदी (Hindi)', code: 'HI', country: 'India', flag: '🇮🇳', langCode: 'hi' },
    { id: 'KN', name: 'ಕನ್ನಡ (Kannada)', code: 'KN', country: 'India', flag: '🇮🇳', langCode: 'kn' },
    { id: 'TA', name: 'தமிழ் (Tamil)', code: 'TA', country: 'India', flag: '🇮🇳', langCode: 'ta' },
    { id: 'BN', name: 'বাংলা (Bangla)', code: 'BN', country: 'India', flag: '🇮🇳', langCode: 'bn' },
    { id: 'MR', name: 'मराठी (Marathi)', code: 'MR', country: 'India', flag: '🇮🇳', langCode: 'mr' },
    { id: 'ML', name: 'മലയാളം (Malayalam)', code: 'ML', country: 'India', flag: '🇮🇳', langCode: 'ml' },
    { id: 'TE', name: 'తెలుగు (Telugu)', code: 'TE', country: 'India', flag: '🇮🇳', langCode: 'te' },
    { id: 'OR', name: 'ଓଡ଼ିଆ (Odia)', code: 'OR', country: 'India', flag: '🇮🇳', langCode: 'or' },
    { id: 'AS', name: 'অসমীয়া (Assamese)', code: 'AS', country: 'India', flag: '🇮🇳', langCode: 'as' },
    { id: 'PA', name: 'ਪੰਜਾਬੀ (Punjabi)', code: 'PA', country: 'India', flag: '🇮🇳', langCode: 'pa' },
    { id: 'GU', name: 'ગુજરાતી (Gujarati)', code: 'GU', country: 'India', flag: '🇮🇳', langCode: 'gu' }
  ]

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLanguageSave = () => {
    const selectedLang = languages.find(l => l.id === selectedLanguage)
    if (selectedLang) {
      languageStore.setLang(selectedLang.langCode as any)
      alert('Language saved! The app will now use the selected language.')
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>Settings</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="General Settings" />
          <Tab label="Company Settings" />
          <Tab label="Privacy & Security" />
          <Tab label="Integrations" />
        </Tabs>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left Sidebar */}
        <Paper variant="outlined" sx={{ width: 280, p: 2, height: 'fit-content' }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>General Settings</Typography>
          <List>
            {subMenus.map((menu, idx) => (
              <ListItem
                key={idx}
                onClick={() => handleSubMenuChange(idx)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 1,
                  bgcolor: activeSubMenu === idx ? 'action.hover' : 'transparent',
                  mb: 0.5,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: activeSubMenu === idx ? 'primary.main' : 'inherit' }}>
                  {menu.icon}
                </ListItemIcon>
                <ListItemText primary={menu.label} />
                {activeSubMenu === idx && <Box sx={{ color: 'primary.main' }}>›</Box>}
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <TabPanel value={activeTab} index={0}>
            {activeSubMenu === 0 && (
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Account</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Real-time information and activities of your property.
                </Typography>

                {/* Profile Header */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32, fontWeight: 700 }}>
                    {user?.name?.split(' ').map(p => p[0]).join('') || 'U'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700}>{user?.name || 'Sophia Williams'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || 'sophiawilliams@gmail.com'}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<CloudUploadIcon />} size="small">
                      Upload new picture
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} size="small">
                      Delete
                    </Button>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Personal Information */}
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Personal Information</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      fullWidth
                      defaultValue="Sophia"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      defaultValue="Williams"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Contact email"
                      fullWidth
                      defaultValue={user?.email || 'sophiawilliams@gmail.com'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      fullWidth
                      defaultValue="247-00 24574"
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Password */}
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Password</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Give me correct password and change password
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Old Password"
                      fullWidth
                      type={showOldPassword ? 'text' : 'password'}
                      size="small"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      InputProps={{
                        startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} fontSize="small" />,
                        endAdornment: (
                          <IconButton size="small" onClick={() => setShowOldPassword(!showOldPassword)}>
                            {showOldPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="New Password"
                      fullWidth
                      type={showNewPassword ? 'text' : 'password'}
                      size="small"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      InputProps={{
                        startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} fontSize="small" />,
                        endAdornment: (
                          <IconButton size="small" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
                {passwordError && (
                  <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                    {passwordError}
                  </Typography>
                )}
                {passwordSuccess && (
                  <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                    Password updated successfully!
                  </Typography>
                )}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button 
                    variant="text" 
                    color="error" 
                    onClick={() => { 
                      setOldPassword(''); 
                      setNewPassword(''); 
                      setPasswordError(null); 
                      setPasswordSuccess(false) 
                    }}
                    disabled={updatingPassword}
                  >
                    No! Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handlePasswordUpdate}
                    disabled={updatingPassword}
                  >
                    {updatingPassword ? 'Updating...' : 'Yes! Update'}
                  </Button>
                </Stack>

                <Divider sx={{ my: 4 }} />

                {/* Account Security */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Account security</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your Account security.
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<LogoutIcon />} onClick={() => navigate('/login')}>
                      Log out
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                      Delete
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            )}

            {activeSubMenu === 1 && (
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Financial & Payment</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your payment methods and financial settings.
                </Typography>
              </Paper>
            )}

            {activeSubMenu === 2 && (
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Tenant Management</Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure tenant-related settings and preferences.
                </Typography>
              </Paper>
            )}

            {activeSubMenu === 3 && (
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Property Management</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage property settings and configurations.
                </Typography>
              </Paper>
            )}

            {activeSubMenu >= 4 && (
              <Paper variant="outlined" sx={{ p: 3 }}>
                {activeSubMenu === 6 && (
                  <>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Notifications</Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {/* Notifications Section */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Notifications</Typography>
                      {notificationSettings.slice(0, 4).map((setting) => (
                        <Box key={setting.id} sx={{ mb: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                                {setting.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {setting.description}
                              </Typography>
                            </Box>
                            <Switch
                              checked={setting.enabled}
                              onChange={() => handleNotificationToggle(setting.id)}
                              sx={{ ml: 2 }}
                            />
                          </Stack>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Customer Section */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Customer</Typography>
                      {notificationSettings.slice(4, 7).map((setting) => (
                        <Box key={setting.id} sx={{ mb: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                                {setting.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {setting.description}
                              </Typography>
                            </Box>
                            <Switch
                              checked={setting.enabled}
                              onChange={() => handleNotificationToggle(setting.id)}
                              sx={{ ml: 2 }}
                            />
                          </Stack>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Email Marketing Section */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Email Marketing</Typography>
                      {notificationSettings.slice(7).map((setting) => (
                        <Box key={setting.id} sx={{ mb: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                                {setting.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {setting.description}
                              </Typography>
                            </Box>
                            <Switch
                              checked={setting.enabled}
                              onChange={() => handleNotificationToggle(setting.id)}
                              sx={{ ml: 2 }}
                            />
                          </Stack>
                        </Box>
                      ))}
                    </Box>

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button variant="text" color="error">
                        No! Cancel
                      </Button>
                      <Button variant="contained" color="primary" onClick={handleNotificationsUpdate}>
                        Yes! Update
                      </Button>
                    </Stack>
                  </>
                )}

                {activeSubMenu === 7 && (
                  <>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Languages</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      These social profiles will appear on your website
                    </Typography>

                    <TextField
                      placeholder="Search your country based languages"
                      fullWidth
                      size="small"
                      sx={{ mb: 3 }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} fontSize="small" />
                      }}
                    />

                    <Stack spacing={1} sx={{ mb: 3, maxHeight: 400, overflow: 'auto' }}>
                      {filteredLanguages.map((lang) => (
                        <Paper
                          key={lang.id}
                          variant="outlined"
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            borderColor: selectedLanguage === lang.id ? 'primary.main' : 'divider',
                            bgcolor: selectedLanguage === lang.id ? 'primary.light' : 'transparent',
                            '&:hover': { bgcolor: 'action.hover' },
                            transition: 'all 0.2s'
                          }}
                          onClick={() => setSelectedLanguage(lang.id)}
                        >
                          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Typography variant="h6">{lang.flag}</Typography>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {lang.name} ({lang.code})
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {lang.country}
                                </Typography>
                              </Box>
                            </Stack>
                            {selectedLanguage === lang.id && (
                              <CheckIcon color="primary" />
                            )}
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button variant="text" color="error" onClick={() => setSelectedLanguage(getInitialLanguageId())}>
                        No! Cancel
                      </Button>
                      <Button variant="contained" color="primary" onClick={handleLanguageSave}>
                        Save Change
                      </Button>
                    </Stack>
                  </>
                )}

                {activeSubMenu !== 6 && activeSubMenu !== 7 && (
                  <>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{subMenus[activeSubMenu].label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Configure your settings and preferences.
                    </Typography>
                  </>
                )}
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Company Settings</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage company-wide settings and configurations.
              </Typography>
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Privacy & Security</Typography>
              <Typography variant="body2" color="text.secondary">
                Configure your privacy and security settings.
              </Typography>
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Integrations</Typography>
              <Typography variant="body2" color="text.secondary">
                Connect external services and manage integrations.
              </Typography>
            </Paper>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  )
}
