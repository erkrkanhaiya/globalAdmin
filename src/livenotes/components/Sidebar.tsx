import { NavLink } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'
import DashboardIcon from '@mui/icons-material/DashboardCustomize'
import SparklesIcon from '@mui/icons-material/AutoAwesome'
import PropertyIcon from '@mui/icons-material/Apartment'
import AgentsIcon from '@mui/icons-material/GroupOutlined'
import CustomerIcon from '@mui/icons-material/Face6Outlined'
import SupportIcon from '@mui/icons-material/SupportAgent'
import AnalyticsIcon from '@mui/icons-material/QueryStatsOutlined'
import OrdersIcon from '@mui/icons-material/ReceiptLongOutlined'
import TransactionIcon from '@mui/icons-material/ReceiptOutlined'
import InboxIcon from '@mui/icons-material/InboxOutlined'
import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import GavelIcon from '@mui/icons-material/Gavel'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Logo from '@/assets/logo.svg'
import { useThemeStore } from '@/livenotes/store/theme'
import { useUiStore } from '@/livenotes/store/ui'
import { useLanguageStore } from '@/livenotes/store/language'

const drawerWidth = 260
const collapsedWidth = 72

type Props = { mobileOpen?: boolean; onClose?: () => void }

export default function Sidebar({ mobileOpen = false, onClose }: Props) {
  const mode = useThemeStore(s => s.mode)
  const toggle = useThemeStore(s => s.toggle)
  const collapsed = useUiStore(s => s.sidebarCollapsed)
  const toggleCollapse = useUiStore(s => s.toggleSidebarCollapse)
  const lang = useLanguageStore(s => s.lang)

  // Translation function
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'en': { dashboard: 'Dashboard', discover: 'Discover', property: 'Property', agents: 'Agents', customer: 'Customer', support: 'Support', analytics: 'Analytics', orders: 'Orders', transaction: 'Transaction', inbox: 'Inbox', calendar: 'Calendar', settings: 'Settings' },
      'es': { dashboard: 'Panel', discover: 'Descubrir', property: 'Propiedades', agents: 'Agentes', customer: 'Clientes', support: 'Soporte', analytics: 'Analítica', orders: 'Pedidos', transaction: 'Transacciones', inbox: 'Bandeja de entrada', calendar: 'Calendario', settings: 'Configuración' },
      'fr': { dashboard: 'Tableau de bord', discover: 'Découvrir', property: 'Propriétés', agents: 'Agents', customer: 'Clients', support: 'Support', analytics: 'Analyses', orders: 'Commandes', transaction: 'Transactions', inbox: 'Boîte de réception', calendar: 'Calendrier', settings: 'Paramètres' },
      'it': { dashboard: 'Cruscotto', discover: 'Scoprire', property: 'Proprietà', agents: 'Agenti', customer: 'Clienti', support: 'Supporto', analytics: 'Analisi', orders: 'Ordini', transaction: 'Transazioni', inbox: 'Posta in arrivo', calendar: 'Calendario', settings: 'Impostazioni' },
      'de': { dashboard: 'Instrumententafel', discover: 'Entdecken', property: 'Eigenschaften', agents: 'Agenten', customer: 'Kunden', support: 'Support', analytics: 'Analytik', orders: 'Bestellungen', transaction: 'Transaktionen', inbox: 'Posteingang', calendar: 'Kalender', settings: 'Einstellungen' },
      'ja': { dashboard: 'ダッシュボード', discover: '発見', property: 'プロパティ', agents: 'エージェント', customer: '顧客', support: 'サポート', analytics: '分析', orders: '注文', transaction: '取引', inbox: '受信トレイ', calendar: 'カレンダー', settings: '設定' },
      'zh': { dashboard: '仪表板', discover: '发现', property: '属性', agents: '代理', customer: '客户', support: '支持', analytics: '分析', orders: '订单', transaction: '交易', inbox: '收件箱', calendar: '日历', settings: '设置' },
      'pt': { dashboard: 'Painel', discover: 'Descobrir', property: 'Propriedades', agents: 'Agentes', customer: 'Clientes', support: 'Suporte', analytics: 'Análise', orders: 'Pedidos', transaction: 'Transações', inbox: 'Caixa de entrada', calendar: 'Calendário', settings: 'Configurações' },
      'hi': { dashboard: 'डैशबोर्ड', discover: 'खोजें', property: 'संपत्ति', agents: 'एजेंट', customer: 'ग्राहक', support: 'सहायता', analytics: 'विश्लेषण', orders: 'ऑर्डर', transaction: 'लेनदेन', inbox: 'इनबॉक्स', calendar: 'कैलेंडर', settings: 'सेटिंग्स' },
      'kn': { dashboard: 'ಡ್ಯಾಷ್ಬೋರ್ಡ್', discover: 'ಪತ್ತೆಮಾಡು', property: 'ಆಸ್ತಿಗಳು', agents: 'ಏಜೆಂಟರು', customer: 'ಗ್ರಾಹಕರು', support: 'ಬೆಂಬಲ', analytics: 'ವಿಶ್ಲೇಷಣೆ', orders: 'ಆದೇಶಗಳು', transaction: 'ವಹಿವಾಟುಗಳು', inbox: 'ಇನ್ಬಾಕ್ಸ್', calendar: 'ಕ್ಯಾಲೆಂಡರ್', settings: 'ಸೆಟ್ಟಿಂಗ್ಗಳು' },
      'ta': { dashboard: 'டாஷ்போர்டு', discover: 'கண்டுபிடி', property: 'பண்புகள்', agents: 'முகவர்கள்', customer: 'வாடிக்கையாளர்கள்', support: 'ஆதரவு', analytics: 'பகுப்பாய்வு', orders: 'ஆர்டர்கள்', transaction: 'பரிவர்த்தனைகள்', inbox: 'இன்பாக்ஸ்', calendar: 'காலெண்டர்', settings: 'அமைப்புகள்' },
      'bn': { dashboard: 'ড্যাশবোর্ড', discover: 'খুঁজুন', property: 'সম্পত্তি', agents: 'এজেন্ট', customer: 'গ্রাহক', support: 'সমর্থন', analytics: 'বিশ্লেষণ', orders: 'অর্ডার', transaction: 'লেনদেন', inbox: 'ইনবক্স', calendar: 'ক্যালেন্ডার', settings: 'সেটিংস' },
      'mr': { dashboard: 'डॅशबोर्ड', discover: 'शोधा', property: 'मालमत्ता', agents: 'एजंट', customer: 'ग्राहक', support: 'आधार', analytics: 'विश्लेषण', orders: 'ऑर्डर', transaction: 'व्यवहार', inbox: 'इनबॉक्स', calendar: 'कॅलेंडर', settings: 'सेटिंग्ज' },
      'ml': { dashboard: 'ഡാഷ്‌ബോർഡ്', discover: 'കണ്ടെത്തുക', property: 'പ്രോപ്പർട്ടികൾ', agents: 'ഏജൻറുകൾ', customer: 'ഉപഭോക്താക്കൾ', support: 'പിന്തുണ', analytics: 'വിശകലനം', orders: 'ഓർഡറുകൾ', transaction: 'ഇടപാടുകൾ', inbox: 'ഇൻബോക്സ്', calendar: 'കലണ്ടർ', settings: 'ക്രമീകരണങ്ങൾ' },
      'te': { dashboard: 'డ్యాష్‌బోర్డ్', discover: 'కనుగొను', property: 'ఆస్తులు', agents: 'ఏజెంట్లు', customer: 'కస్టమర్లు', support: 'మద్దతు', analytics: 'విశ్లేషణ', orders: 'ఆర్డర్లు', transaction: 'లావాదేవీలు', inbox: 'ఇన్‌బాక్స్', calendar: 'క్యాలెండర్', settings: 'సెట్టింగ్‌లు' },
      'or': { dashboard: 'ଡ୍ୟାସବୋର୍ଡ', discover: 'ଖୋଜନ୍ତୁ', property: 'ସମ୍ପତ୍ତି', agents: 'ଏଜେଣ୍ଟ', customer: 'ଗ୍ରାହକ', support: 'ସମର୍ଥନ', analytics: 'ବିଶ୍ଳେଷଣ', orders: 'ଅର୍ଡର୍', transaction: 'କାରବାର', inbox: 'ଇନ୍ବକ୍ସ', calendar: 'କ୍ୟାଲେଣ୍ଡର', settings: 'ସେଟିଂ' },
      'as': { dashboard: 'ড্যাশবৰ্ড', discover: 'উদ্ঘাটন', property: 'সম্পত্তি', agents: 'এজেন্ট', customer: 'গ্ৰাহক', support: 'সমৰ্থন', analytics: 'বিশ্লেষণ', orders: 'অৰ্ডাৰ', transaction: 'কাৰ্যসমূহ', inbox: 'ইনবক্স', calendar: 'কেলেণ্ডাৰ', settings: 'ছেটিংছ' },
      'pa': { dashboard: 'ਡੈਸ਼ਬੋਰਡ', discover: 'ਲੱਭੋ', property: 'ਸੰਪੱਤੀਆਂ', agents: 'ਏਜੰਟ', customer: 'ਗ੍ਰਾਹਕ', support: 'ਸਹਾਇਤਾ', analytics: 'ਵਿਸ਼ਲੇਸ਼ਣ', orders: 'ਆਰਡਰ', transaction: 'ਲੈਣ-ਦੇਣ', inbox: 'ਇਨਬਾਕਸ', calendar: 'ਕੈਲੰਡਰ', settings: 'ਸੈਟਿੰਗਾਂ' },
      'gu': { dashboard: 'ડેશબોર્ડ', discover: 'શોધો', property: 'મિલકત', agents: 'એજન્ટ', customer: 'ગ્રાહકો', support: 'સહાય', analytics: 'વિશ્લેષણ', orders: 'ઓર્ડર', transaction: 'વ્યવહારો', inbox: 'ઇનબોક્સ', calendar: 'કેલેન્ડર', settings: 'સેટિંગ્સ' }
    }
    return translations[lang]?.[key.toLowerCase()] || key
  }

  const mainItems = [
    { to: '/dashboard', label: t('Dashboard'), icon: <DashboardIcon /> },
    { to: '/discover', label: t('Discover'), icon: <SparklesIcon /> },
    { to: '/property', label: t('Property'), icon: <PropertyIcon /> },
    { to: '/auction-requests', label: 'Auction Requests', icon: <GavelIcon /> },
    { to: '/agents', label: t('Agents'), icon: <AgentsIcon /> },
    { to: '/customer', label: t('Customer'), icon: <CustomerIcon /> },
    { to: '/support', label: t('Support'), icon: <SupportIcon /> },
    { to: '/analytics', label: t('Analytics'), icon: <AnalyticsIcon /> },
    { to: '/orders', label: t('Orders'), icon: <OrdersIcon /> },
    { to: '/transaction', label: t('Transaction'), icon: <TransactionIcon /> }
  ]
  const appItems = [
    { to: '/inbox', label: t('Inbox'), icon: <InboxIcon /> },
    { to: '/calendar', label: t('Calendar'), icon: <CalendarIcon /> }
  ]

  const content = (
    <>
      <Box sx={{ display:'flex', alignItems:'center', justifyContent: collapsed ? 'center' : 'space-between', px: collapsed ? 1 : 2, py:2 }}>
        {!collapsed && <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
          <img src={Logo} alt="logo" width={32} height={32} />
          <Typography variant="h6" fontWeight={800}>60Yard</Typography>
        </Box>}
        {collapsed && <img src={Logo} alt="logo" width={32} height={32} />}
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right">
          <IconButton size="small" onClick={toggleCollapse} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      {!collapsed && <Typography variant="overline" sx={{ px:2, pt:1, color:'text.secondary' }}>MAIN</Typography>}
      <List>
        {mainItems.map(item => (
          <ListItem key={item.to} disablePadding>
            <Tooltip title={collapsed ? item.label : ''} placement="right">
              <ListItemButton component={NavLink} to={item.to} sx={{ '&.active': { bgcolor: 'action.selected' }, mx: collapsed ? 0.5 : 1, borderRadius:2, justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 1 : 2 }}>
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      {!collapsed && <Typography variant="overline" sx={{ px:2, pt:1, color:'text.secondary' }}>APPS</Typography>}
      <List>
        {appItems.map(item => (
          <ListItem key={item.to} disablePadding>
            <Tooltip title={collapsed ? item.label : ''} placement="right">
              <ListItemButton component={NavLink} to={item.to} sx={{ '&.active': { bgcolor: 'action.selected' }, mx: collapsed ? 0.5 : 1, borderRadius:2, justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 1 : 2 }}>
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow:1 }} />
      <Divider />
      <List>
        <ListItem disablePadding>
          <Tooltip title={collapsed ? t('Settings') : ''} placement="right">
            <ListItemButton component={NavLink} to="/settings" sx={{ '&.active': { bgcolor: 'action.selected' }, mx: collapsed ? 0.5 : 1, borderRadius:2, justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 1 : 2 }}>
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}><SettingsIcon /></ListItemIcon>
              {!collapsed && <ListItemText primary={t('Settings')} />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ display:'flex', alignItems:'center', justifyContent: collapsed ? 'center' : 'space-between', px: collapsed ? 1 : 2, py:1.5 }}>
        {collapsed ? (
          <Tooltip title="Dark Mode" placement="right">
            <IconButton onClick={toggle} size="small">{mode === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />}</IconButton>
          </Tooltip>
        ) : (
          <>
            <Box sx={{ display:'flex', alignItems:'center', gap:1, color:'text.secondary' }}>
              {mode === 'dark' ? <Brightness4Icon fontSize="small" /> : <Brightness7Icon fontSize="small" />}
              <Typography variant="body2">Dark Mode</Typography>
            </Box>
            <Switch checked={mode === 'dark'} onChange={toggle} />
          </>
        )}
      </Box>
    </>
  )

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, [`& .MuiDrawer-paper`]: { width: drawerWidth } }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ 
          display: { xs: 'none', md: 'block' }, 
          width: collapsed ? collapsedWidth : drawerWidth, 
          flexShrink: 0,
          transition: 'width 0.3s ease',
          [`& .MuiDrawer-paper`]: { 
            width: collapsed ? collapsedWidth : drawerWidth, 
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            overflowX: 'hidden'
          } 
        }}
        open
      >
        {content}
      </Drawer>
    </>
  )
}

