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
import  CryptoJS  from 'crypto-js';
import { Pagination } from 'react-bootstrap';

function AdminChavesManagement({shouldUpdate}) {
  const [chaves, setChaves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const chavesPerPage = 10;
  const [openDialog,setOpenDialog] = useState(false);
  const [currentChave, setCurrentChave] = useState({
    nome: '', 
    numero: '',
  });

  // Função para descriptografar dados
  const decryptAES = (encryptedData, password) => {
    try {
      const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
      const ciphertext = CryptoJS.enc.Base64.parse(encryptedData.data);
      const key = CryptoJS.enc.Utf8.parse(password);
  
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        key,
        { 
          iv: iv, 
          mode: CryptoJS.mode.CBC, 
          padding: CryptoJS.pad.Pkcs7 
        }
      );
      
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Decryption Error:', error);
      console.error('Encrypted Data:', encryptedData);
      return null;
    }}


    const indexOfLastChave = currentPage * chavesPerPage;
    const indexOfFirstChave = indexOfLastChave - chavesPerPage;
    const currentChaves = chaves.slice(indexOfFirstChave, indexOfLastChave);

  // Buscar Chaves
  useEffect(() => {
    axios.get("https://hospitalemcor.com.br/claviscord/api/index.php?table=chaves")
      .then(response => {
        try {
          // Descriptografa os dados
          const decryptedData = decryptAES(response.data, '0123456789ABCDEF0123456789ABCDEF');
          // const decryptedData = decryptAES(response.data, process.env.REACT_APP_API_KEY);
          if (decryptedData) {
            // Se decryptedData for um array, você pode configurar as chaves no estado
            setChaves(decryptedData);
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
  , [shouldUpdate]);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(chaves.length / chavesPerPage); i++) {
    pageNumbers.push(
      <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
        {i}
      </Pagination.Item>
    );
  }

   // Abrir diálogo para editar usuário
   const handleEditChave = (chave) => {
    setCurrentChave({
      ...chave,
      senha: '' // Limpar senha por segurança
    });
    setOpenDialog(true);
  };
  const handleDeleteChave = async (chaveID) => {
    try {
      await axios.delete(
        `https://hospitalemcor.com.br/claviscord/api/index.php?table=chaves&id=${chaveID}`
      );
      axios.get("https://hospitalemcor.com.br/claviscord/api/index.php?table=chaves")
          .then(response => {
            const decryptedData = decryptAES(response.data, '0123456789ABCDEF0123456789ABCDEF');
            if (decryptedData) {
              setChaves(decryptedData);
            }
          });
      // setSnackbar({
      //   open: true,
      //   message: 'Usuário deletado',
      //   severity: 'success'
      // });

     // Recarregar lista de usuários
    } catch(error) {
      const errorMessage = decryptAES(error.response.data, '0123456789ABCDEF0123456789ABCDEF');
      console.error('Erro ao salvar usuário:', errorMessage);
      // setSnackbar({
      //   open: true,
      //   message: errorMessage?.message || 'Erro ao salvar usuário',
      //   severity: 'error'
      // });
    };
  
  };

    return(
      <div className="mx-2 p-4 pt-2 border rounded">
        <h4>Gerenciamento de Chaves</h4>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Número</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentChaves.map((chave) => (
                <TableRow key={chave.id}>
                  <TableCell>{chave.id}</TableCell>
                  <TableCell>{chave.nome}</TableCell>
                  <TableCell>{chave.numero}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={chave.chaveOn === 0}
                      title={chave.chaveOn === 0 ? "Chave Retirada":"Chave Disponível"}
                      color="secondary" 
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => {handleEditChave(chave)}}
                    >
                      <i class="fas fa-pencil-alt    "></i>
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      onClick={() => {handleDeleteChave(chave.id)}}
                    >
                      <i class="fas fa-trash    "></i>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              
            </TableBody>
          </Table>
         
        </TableContainer>
        <Pagination className="mt-1">
        {pageNumbers}
      </Pagination>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Editar Chave
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={currentChave.nome}
            onChange={(e) => setCurrentChave({
              ...currentChave, 
              nome: e.target.value
            })}
          />
          <TextField
            margin="dense"
            label="Número"
            type="number"
            fullWidth
            value={currentChave.numero}
            onChange={(e) => setCurrentChave({
              ...currentChave, 
              numero: e.target.value
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button  color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      </div>
      
    );
};

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
      const ciphertext = CryptoJS.enc.Base64.parse(encryptedData.data);
      const key = CryptoJS.enc.Utf8.parse(password);
  
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        key,
        { 
          iv: iv, 
          mode: CryptoJS.mode.CBC, 
          padding: CryptoJS.pad.Pkcs7 
        }
      );
      
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Decryption Error:', error);
      console.error('Encrypted Data:', encryptedData);
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
          // const decryptedData = decryptAES(response.data, process.env.REACT_APP_API_KEY);
          if (decryptedData) {
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
  const handleSaveUser = () => { 
    // Construa o objeto com a conversão explícita
    const userData = {
      ...(isEditing ? { id: currentUser.id } : {}), // Adiciona ID apenas quando estiver editando
      adm: currentUser.adm ? 1 : 0, // Conversão explícita para número
      nome: currentUser.nome,
      senha: currentUser.senha,
    };
  
    axios.post('https://hospitalemcor.com.br/claviscord/api/index.php?table=usuarios', userData)
      .then(response => {
        console.info('Resposta do servidor:', response);
  
        setSnackbar({
          open: true,
          message: isEditing ? 'Usuário atualizado' : 'Usuário criado',
          severity: 'success'
        });
  
        // Recarregar lista de usuários após criar/editar
        axios.get("https://hospitalemcor.com.br/claviscord/api/index.php?table=usuarios")
          .then(response => {
            const decryptedData = decryptAES(response.data, '0123456789ABCDEF0123456789ABCDEF');
            if (decryptedData) {
              setUsers(decryptedData);
            }
          });
  
        setOpenDialog(false);
      })
      .catch(error => {
        const errorMessage = decryptAES(error.response.data, '0123456789ABCDEF0123456789ABCDEF');
        console.error('Erro ao salvar usuário:', errorMessage);
        setSnackbar({
          open: true,
          message: errorMessage?.message || 'Erro ao salvar usuário',
          severity: 'error'
        });
      });
  };
  
  // Deletar usuário
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(
        `https://hospitalemcor.com.br/claviscord/api/index.php?table=usuarios&id=${userId}`
      );
      axios.get("https://hospitalemcor.com.br/claviscord/api/index.php?table=usuarios")
          .then(response => {
            const decryptedData = decryptAES(response.data, '0123456789ABCDEF0123456789ABCDEF');
            if (decryptedData) {
              setUsers(decryptedData);
            }
          });
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
    <div className="p-4 pt-2 border rounded">
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

export {AdminUserManagement, AdminChavesManagement}