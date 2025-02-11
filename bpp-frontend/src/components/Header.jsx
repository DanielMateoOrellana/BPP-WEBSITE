import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import { MenuRounded } from '@mui/icons-material';

const Header = ({ toggleSidebar }) => {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
        
        {/* Sección izquierda: Botón de menú */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" aria-label="open drawer" onClick={toggleSidebar} edge="start">
            <MenuRounded />
          </IconButton>
        </Box>

        {/* Sección central: Texto "Bosque Mágico" + Logo del Bosque (GRANDE) */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap' }}
          >
            Bosque Mágico
          </Typography>
          <Box
            component="img"
            src="/images/bosque.jpg"
            alt="Logo Bosque"
            sx={{ height: 60, width: 'auto', ml: 2 }} // 📌 MÁS GRANDE
          />
        </Box>

        {/* Sección derecha: Logo de ESPOL */}
        <Box>
          <Box
            component="img"
            src="/images/Espol_Logo_2023.png"
            alt="Logo ESPOL"
            sx={{ height: 40, width: 'auto' }}
          />
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Header;
