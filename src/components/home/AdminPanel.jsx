import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Snackbar, 
  Alert,
  IconButton,
  Switch
} from '@mui/material';
import axios from 'axios';
import { CryptoJS } from 'crypto-js';

function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    nome: '',
    senha: '',
    adm: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Função para descriptografar dados
  const decryptAES = (encryptedData, password) => {
    try {
      const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
      const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedData.data); // Modificação aqui
        console.log('encryptedBytes :>> ', encryptedBytes);
      const decryptedBytes = CryptoJS.AES.decrypt(
          { ciphertext: encryptedBytes },
          CryptoJS.enc.Utf8.parse(password),
          { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );

      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText); // Modificação aqui
    } catch (error) {
      console.error('Erro ao descriptografar:', error);
      return null;
    }
  };

  // Buscar usuários
  useEffect(() => {
    axios.get("https://hospitalemcor.com.br/claviscord/api/index.php?table=usuarios")
      .then(response => {
        try {
          // Descriptografa os dados
          const decryptedData = decryptAES(response.data, '0123456789ABCDEF0123456789ABCDEF');
          console.log(response.data.data);
          // const decryptedData = decryptAES(response.data, process.env.REACT_APP_API_KEY);
          if (decryptedData && Array.isArray(decryptedData)) {
            // Se decryptedData for um array, você pode configurar as chaves no estado
            setUsers(decryptedData);
          } else {
            console.error('Erro ao descriptografar os dados ou os dados não são um array.');
          }
        } catch (error) {
          console.error('Erro ao processar os dados:', error);
        }
      })
      .catch(error => {
        console.error('Erro ao obter as chaves:', error);
      });}
  , []);


  // Abrir diálogo para novo usuário
  const handleOpenNewUserDialog = () => {
    setCurrentUser({
      nome: '',
      senha: '',
      adm: false
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Abrir diálogo para editar usuário
  const handleEditUser = (user) => {
    setCurrentUser({
      ...user,
      senha: '' // Limpar senha por segurança
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Salvar usuário (novo ou editado)
  const handleSaveUser = async () => {
    try {
      const endpoint = isEditing 
        ? `https://hospitalemcor.com.br/claviscord/api/index.php?method=PUT&table=usuarios&id=${currentUser.id}`
        : 'https://hospitalemcor.com.br/claviscord/api/index.php?table=usuarios';
      
      const payload = {
        ...currentUser,
        // Incluir apenas senha se for preenchida
        ...(currentUser.senha ? { senha: currentUser.senha } : {})
      };

      await axios.post(endpoint, payload);

      setSnackbar({
        open: true,
        message: isEditing ? 'Usuário atualizado' : 'Usuário criado',
        severity: 'success'
      });

     // Recarregar lista de usuários
      setOpenDialog(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao salvar usuário',
        severity: 'error'
      });
    }
  };

  // Deletar usuário
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(
        `https://hospitalemcor.com.br/claviscord/api/index.php?table=usuarios&id=${userId}`
      );

      setSnackbar({
        open: true,
        message: 'Usuário deletado',
        severity: 'success'
      });

     // Recarregar lista de usuários
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao deletar usuário',
        severity: 'error'
      });
    }
  };

  return (
    <div className="p-4">
      <h4>Gerenciamento de Usuários</h4>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpenNewUserDialog}
        className="mb-3"
      >
        Novo Usuário
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Administrador</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.nome}</TableCell>
                <TableCell>
                  <Switch 
                    checked={user.adm === 1} 
                    color="primary" 
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEditUser(user)}
                  >
                    <i class="fas fa-pencil-alt    "></i>
                  </IconButton>
                  <IconButton 
                    color="secondary" 
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <i class="fas fa-trash    "></i>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para criar/editar usuário */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={currentUser.nome}
            onChange={(e) => setCurrentUser({
              ...currentUser, 
              nome: e.target.value
            })}
          />
          <TextField
            margin="dense"
            label="Senha"
            type="password"
            fullWidth
            value={currentUser.senha}
            onChange={(e) => setCurrentUser({
              ...currentUser, 
              senha: e.target.value
            })}
            helperText={isEditing ? 'Deixe em branco para manter a senha atual' : ''}
          />
          <Switch
            checked={currentUser.adm === 1}
            onChange={(e) => setCurrentUser({
              ...currentUser, 
              adm: e.target.checked ? 1 : 0
            })}
          />
          <span>Administrador</span>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveUser} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AdminUserManagement;