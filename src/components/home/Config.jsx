import { Button, FormControl, FormGroup, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Snackbar, Alert, Box } from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios'
import AdminUserManagement from './AdminPanel';

function Config() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Novos estados para o Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const usuario = JSON.parse(localStorage.getItem('token'));

  // Handlers para mostrar/esconder senha
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {event.preventDefault();};
  const handleMouseUpPassword = (event) => {event.preventDefault();};
  const handleClickShowPasswordNew = () => setShowPasswordNew((show) => !show);
  const handleMouseDownPasswordNew = (event) => {event.preventDefault();};
  const handleMouseUpPasswordNew = (event) => {event.preventDefault();};

  // Novo handler para fechar o Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    // Validações básicas
    if (!currentPassword || !newPassword) {
      setSnackbarMessage('Por favor, preencha todos os campos');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (newPassword.length < 6) {
      setSnackbarMessage('A nova senha deve ter pelo menos 6 caracteres');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        'https://hospitalemcor.com.br/claviscord/api/index.php?table=usuarios', 
        {
          id: usuario.id,
          senhaAtual: currentPassword,
          senhaNova: newPassword
        }
      );

      // Sucesso: mostra mensagem de sucesso
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Limpa campos após sucesso
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      // Erro: mostra mensagem de erro
      setSnackbarMessage(error.response?.data?.message || 'Erro desconhecido');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="bg-light rounded d-flex flex-column justify-content-center align-items-center m-5 p-3">
      <FormGroup>
        <TextField 
          label='Usuário' 
          defaultValue={usuario.nome}
          slotProps={{
            input: {
              readOnly: true,
            },
          }} 
        />
        <FormControl className='mt-3' variant="outlined">
          <InputLabel htmlFor="outlined-adornment-current-password">Senha Atual</InputLabel>
          <OutlinedInput
            id="outlined-adornment-current-password"
            type={showPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'hide the password' : 'display the password'}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <i className="fas fa-eye"/> : <i className="fas fa-eye-slash"></i>}
                </IconButton>
              </InputAdornment>
            }
            label="Senha Atual"
          />
        </FormControl>
        <FormControl className='mt-3' variant="outlined">
          <InputLabel htmlFor="outlined-adornment-new-password">Nova Senha</InputLabel>
          <OutlinedInput
            id="outlined-adornment-new-password"
            type={showPasswordNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPasswordNew ? 'hide the password' : 'display the password'}
                  onClick={handleClickShowPasswordNew}
                  onMouseDown={handleMouseDownPasswordNew}
                  onMouseUp={handleMouseUpPasswordNew}
                  edge="end"
                >
                  {showPasswordNew ? <i className="fas fa-eye"/> : <i className="fas fa-eye-slash"></i>}
                </IconButton>
              </InputAdornment>
            }
            label="Nova Senha"
          />
        </FormControl>
        <Button 
          className='mt-3' 
          variant='contained' 
          onClick={handleSubmit}
        >
          Confirmar
        </Button>

        {/* Seção de administração visível apenas para ADM */}
        {usuario.Adm === 1 && (
          <Box 
          sx={{
            mt: 4,
            border: 'solid grey 0.1rem',
            borderRadius: "0.5rem",
            padding: "0.5rem",
            paddingTop:"0.7rem",
            width: '100%',
            color: 'text.primary' // Substitui "text-dark" e utiliza o tema do MUI
          }}
        >
          <h6 className='bg-primary text-white py-1 rounded'>Opções de Administração</h6>
            <Box sx={{
            mt: 4,
            border: 'solid grey 0.1rem',
            borderRadius: "0.5rem",
            padding: "0.5rem",
            width: '100%',
            color: 'text.primary' // Substitui "text-dark" e utiliza o tema do MUI
          }}
          >
            <AdminUserManagement />
          </Box>
        </Box>
        )}

        {/* Componente Snackbar para feedback */}
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity} 
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </FormGroup>
    </div>
  )
}

export default Config