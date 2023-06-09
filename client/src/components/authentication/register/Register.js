import {createTheme, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {useState} from "react";
import Box from "@mui/material/Box";
import {ThemeProvider} from "@emotion/react";

// change default theme by createTheme() method
// equals to using css
const theme = createTheme({
    typography: {
        body2: {
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 1s ease-in-out',
            '&:hover': {
                textDecoration: 'underline'
            }
        }
    }
})

const Register = ({setShowRegister}) => {
    // js code
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const register = () => {
        // call API
        console.log({email, password, confirmPassword})
    }


    // html code
    return (
        <ThemeProvider theme={theme}>
            {/* register form */}
            <Grid container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
            >
                <Grid item>
                    <Typography variant='h5'>Register</Typography>
                </Grid>
                {/* Email input */}
                <Grid item sx={{width: '300px'}}>
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        onChange={e=>setEmail(e.target.value)}
                        fullWidth
                    />
                </Grid>

                {/* password input */}
                <Grid item sx={{width: '300px'}}>
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            fullWidth
                            label="Password"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={()=> setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Grid>

                {/* password confirmation input */}
                <Grid item sx={{width: '300px'}}>
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                            fullWidth
                            label="Password"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={()=> setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Grid>

                {/* register button */}
                <Grid item sx={{width: '300px'}}>
                    <Grid container spacing={2} alignItems='flex-end'>
                        <Grid item>
                            <Button variant="contained" onClick={()=>register()}>Register</Button>
                        </Grid>
                        <Grid item>
                            <Typography
                                variant="body2"
                                color='primary'
                                onClick={()=>setShowRegister(false)}
                            >
                                Login
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default Register
