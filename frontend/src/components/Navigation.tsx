import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

export default function Navigation() {
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em)`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  })); 
  const pages = ['Friends', 'Chat', 'Profile'];
  const navigate = useNavigate(); 

  return (
    <div className='w-screen space-y-24'>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar className='bg-slate-700'>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate(`/`)}>
                Instalite
              </Typography>
                {pages.map((page) => (
                  <Button color="inherit" onClick={() => navigate(`/${page.toLowerCase()}`)}>{page}</Button>
                ))}
                <Search>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
            </Toolbar>
          </AppBar>
        </Box>
    </div>
  )
}

