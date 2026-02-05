import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Box from '@mui/material/Box'
import { useUiStore } from '@/restaurant/store/ui'

const drawerWidth = 260

export default function AppLayout() {
  const mobileOpen = useUiStore(s => s.sidebarOpen)
  const close = useUiStore(s => s.closeSidebar)
  return (
    <Box sx={{ display:'flex' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={close} />
      <Box component="main" sx={{ flexGrow:1 }}>
        <Topbar />
        <Outlet />
      </Box>
    </Box>
  )
}

