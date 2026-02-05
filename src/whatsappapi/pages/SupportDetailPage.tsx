import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ReplyIcon from '@mui/icons-material/Reply'
import SendIcon from '@mui/icons-material/Send'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PrintIcon from '@mui/icons-material/Print'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import DownloadIcon from '@mui/icons-material/Download'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import FolderZipIcon from '@mui/icons-material/FolderZip'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import LinkIcon from '@mui/icons-material/Link'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import ImageIcon from '@mui/icons-material/Image'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import BedIcon from '@mui/icons-material/Bed'
import BathtubIcon from '@mui/icons-material/Bathtub'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import HomeIcon from '@mui/icons-material/Home'
import Tooltip from '@mui/material/Tooltip'

export default function SupportDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="dash" style={{ padding: 16 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Paper variant="outlined" sx={{ flex: 1, p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
              <Avatar sx={{ bgcolor: 'primary.main' }}>PP</Avatar>
              <Box>
                <Typography fontWeight={700}>Pretty Pixie</Typography>
                <Typography variant="caption" color="text.secondary">Ticket ID: #{id}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Print"><IconButton><PrintIcon /></IconButton></Tooltip>
              <Tooltip title="Delete"><IconButton color="error"><DeleteIcon /></IconButton></Tooltip>
              <Tooltip title="Info"><IconButton><InfoIcon /></IconButton></Tooltip>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography paragraph>Hello, Support Team!</Typography>
          <Typography paragraph>
            I am writing to introduce you to Pretty Pixie. I know you've been looking hard for a candidate for that Creative Director position and I believe David Boyd fits the position.
          </Typography>
          <Typography paragraph>
            I've attached David Boyd resume and portfolio for your review. You can contact David Boyd at prettypixie@mail.com
          </Typography>

          <Stack direction="row" spacing={2} sx={{ my: 2 }}>
            <Chip icon={<PictureAsPdfIcon />} label="Resume.pdf 350Kb" variant="outlined" clickable deleteIcon={<DownloadIcon />} onDelete={() => {}} />
            <Chip icon={<FolderZipIcon />} label="Portfolio.zip 50MB" variant="outlined" clickable deleteIcon={<DownloadIcon />} onDelete={() => {}} />
          </Stack>

          <Stack spacing={1} sx={{ my: 2 }}>
            <Box sx={{ alignSelf: 'flex-end', bgcolor: 'primary.main', color: 'primary.contrastText', px: 2, py: 1, borderRadius: 2, maxWidth: 360 }}>Hi, What can I help you with?</Box>
            <Box sx={{ alignSelf: 'flex-end', bgcolor: 'primary.main', color: 'primary.contrastText', px: 2, py: 1, borderRadius: 2, maxWidth: 420 }}>Of course, it is available in 38 and several other sizes which are very complete</Box>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>Pretty Pixie is typing...</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            To: <Chip size="small" avatar={<Avatar sx={{ width: 20, height: 20 }}>MD</Avatar>} label="Martin Deo" onDelete={() => {}} />
          </Typography>
          <Paper variant="outlined" sx={{ p: 1.5 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap' }}>
              <Tooltip title="Bold"><IconButton size="small"><FormatBoldIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Italic"><IconButton size="small"><FormatItalicIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Underline"><IconButton size="small"><FormatUnderlinedIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Link"><IconButton size="small"><LinkIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Emoji"><IconButton size="small"><EmojiEmotionsIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Image"><IconButton size="small"><ImageIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Bullet List"><IconButton size="small"><FormatListBulletedIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Numbered List"><IconButton size="small"><FormatListNumberedIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Align Left"><IconButton size="small"><FormatAlignLeftIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Align Center"><IconButton size="small"><FormatAlignCenterIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Align Right"><IconButton size="small"><FormatAlignRightIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Align Justify"><IconButton size="small"><FormatAlignJustifyIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Attach File"><IconButton size="small"><AttachFileIcon fontSize="small" /></IconButton></Tooltip>
            </Stack>
            <TextField placeholder="Type something" fullWidth multiline minRows={3} variant="standard" />
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
              <div />
              <Button variant="contained" endIcon={<SendIcon />}>Send</Button>
            </Stack>
          </Paper>
        </Paper>

        <Paper variant="outlined" sx={{ width: { xs: '100%', md: 360 }, p: 2, position: 'relative' }}>
          <IconButton sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper', zIndex: 1 }} size="small"><CloseIcon /></IconButton>
          <Box sx={{ height: 180, bgcolor: 'grey.300', borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500', position: 'relative', overflow: 'hidden' }}>
            <HomeIcon sx={{ fontSize: 60, opacity: 0.5 }} />
          </Box>
          <Typography fontWeight={800}>Brand New Shopping Mall for buy</Typography>
          <Typography variant="body2" color="text.secondary">2699 Green Valley, Highland Lake, FL</Typography>
          <Stack direction="row" spacing={2} sx={{ my: 1 }}>
            <Stack direction="row" spacing={0.5} alignItems="center"><BedIcon fontSize="small" color="action" /> <Typography variant="body2">3 Beds</Typography></Stack>
            <Stack direction="row" spacing={0.5} alignItems="center"><BathtubIcon fontSize="small" color="action" /> <Typography variant="body2">2 Bathrooms</Typography></Stack>
            <Stack direction="row" spacing={0.5} alignItems="center"><SquareFootIcon fontSize="small" color="action" /> <Typography variant="body2">5×7 m²</Typography></Stack>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Chip icon={<CheckCircleIcon />} label="Active" color="success" size="small" variant="outlined" />
          </Stack>
          <Stack spacing={0.5} sx={{ my: 1 }}>
            <Typography variant="body2" color="text.secondary">Living space</Typography>
            <Typography variant="body1">124 sq ft</Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ my: 1 }}>
            <Typography variant="body2" color="text.secondary">Repair quality</Typography>
            <Typography variant="body1">Modern loft</Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ my: 1 }}>
            <Typography variant="body2" color="text.secondary">Rent price</Typography>
            <Typography variant="body1">$2,700/mo</Typography>
          </Stack>
          <Button fullWidth variant="outlined">View Property Details</Button>
        </Paper>
      </Stack>
    </div>
  )
}

