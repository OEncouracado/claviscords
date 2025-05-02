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
  Switch,
} from "@mui/material";
import { Pagination } from "react-bootstrap";
import supabase from "../../supabaseClient";

function AdminChavesManagement({ shouldUpdate, updateShouldUpdate }) {
  const [chaves, setChaves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const chavesPerPage = 10;
  const [openDialog, setOpenDialog] = useState(false);
  const [currentChave, setCurrentChave] = useState({
    id: "",
    nome: "",
    numero: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const indexOfLastChave = currentPage * chavesPerPage;
  const indexOfFirstChave = indexOfLastChave - chavesPerPage;
  const currentChaves = chaves.slice(indexOfFirstChave, indexOfLastChave);

  useEffect(() => {
    const fetchChaves = async () => {
      const { data, error } = await supabase.from("chaves").select("*");
      if (error) {
        console.error("Erro ao buscar chaves:", error.message);
        return;
      }
      setChaves(data);
    };

    fetchChaves();
  }, [shouldUpdate]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(chaves.length / chavesPerPage); i++) {
    pageNumbers.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => paginate(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  const handleEditChave = (chave) => {
    setCurrentChave({ ...chave });
    setOpenDialog(true);
  };

  const handleDeleteChave = async (chaveID) => {
    const { error } = await supabase.from("chaves").delete().eq("id", chaveID);
    if (error) {
      console.error("Erro ao deletar chave:", error.message);
      setSnackbar({
        open: true,
        message: "Erro ao deletar chave",
        severity: "error",
      });
      return;
    }

    const { data } = await supabase.from("chaves").select("*");
    setChaves(data);
    setSnackbar({
      open: true,
      message: "Chave deletada com sucesso",
      severity: "success",
    });
  };

  const handleSaveChave = async () => {
    const { error } = await supabase
      .from("chaves")
      .update({
        nome: currentChave.nome,
        numero: currentChave.numero,
      })
      .eq("id", currentChave.id);

    if (error) {
      console.error("Erro ao atualizar chave:", error.message);
      setSnackbar({
        open: true,
        message: "Erro ao atualizar chave",
        severity: "error",
      });
      return;
    }

    const { data } = await supabase.from("chaves").select("*");
    setChaves(data);
    setSnackbar({
      open: true,
      message: "Chave atualizada com sucesso",
      severity: "success",
    });
    setOpenDialog(false);
  };

  return (
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
                    title={
                      chave.chaveOn === 0
                        ? "Chave Retirada"
                        : "Chave Disponível"
                    }
                    color="secondary"
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditChave(chave)}
                  >
                    <i className="fas fa-pencil-alt" />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteChave(chave.id)}
                  >
                    <i className="fas fa-trash" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination className="mt-1">{pageNumbers}</Pagination>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Chave</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={currentChave.nome}
            onChange={(e) =>
              setCurrentChave({ ...currentChave, nome: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Número"
            type="number"
            fullWidth
            value={currentChave.numero}
            onChange={(e) =>
              setCurrentChave({ ...currentChave, numero: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveChave} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

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

function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    nome: "",
    senha: "",
    adm: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("usuarios").select("*");
    if (error) {
      console.error("Erro ao buscar usuários:", error.message);
      return;
    }
    setUsers(data);
  };

  // Buscar usuários
  useEffect(() => {
    fetchUsers();
  }, []);
  // Abrir diálogo para novo usuário
  const handleOpenNewUserDialog = () => {
    setCurrentUser({
      nome: "",
      senha: "",
      adm: false,
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Abrir diálogo para editar usuário
  const handleEditUser = (user) => {
    setCurrentUser({
      ...user,
      senha: "", // Limpar senha por segurança
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Salvar usuário (novo ou editado)
  const handleSaveUser = async () => {
    const userData = {
      ...(isEditing ? { id: currentUser.id } : {}), // Adiciona ID apenas quando estiver editando
      adm: currentUser.adm, // Conversão explícita para número
      nome: currentUser.nome,
      senha: currentUser.senha,
    };
    await supabase
      .from("usuarios")
      .upsert(userData, { returning: "minimal" }) // Retorna apenas o ID
      .then(({ data, error }) => {
        if (error) {
          console.error("Erro ao salvar usuário:", error.message);
          setSnackbar({
            open: true,
            message: "Erro ao salvar usuário",
            severity: "error",
          });
          return;
        }
        setSnackbar({
          open: true,
          message: isEditing ? "Usuário atualizado" : "Usuário criado",
          severity: "success",
        });
        // Recarregar lista de usuários após criar/editar
        fetchUsers();
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error("Erro ao salvar usuário:", error.message);
        setSnackbar({
          open: true,
          message: "Erro ao salvar usuário",
          severity: "error",
        });
      });
  };

  // Deletar usuário
  const handleDeleteUser = async (userId) => {
    try {
      const { error } = await supabase
        .from("usuarios")
        .delete()
        .eq("id", userId);

      if (error) {
        throw error;
      }

      const { data, error: fetchError } = await supabase
        .from("usuarios")
        .select("*");

      if (fetchError) {
        throw fetchError;
      }

      setUsers(data);
      setSnackbar({
        open: true,
        message: "Usuário deletado",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error.message);
      setSnackbar({
        open: true,
        message: "Erro ao deletar usuário",
        severity: "error",
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
                    checked={user.adm === true}
                    color="primary"
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditUser(user)}
                  >
                    <i className="fas fa-pencil-alt    "></i>
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <i className="fas fa-trash    "></i>
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
          {isEditing ? "Editar Usuário" : "Novo Usuário"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={currentUser.nome}
            onChange={(e) =>
              setCurrentUser({
                ...currentUser,
                nome: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Senha"
            type="password"
            fullWidth
            value={currentUser.senha}
            onChange={(e) =>
              setCurrentUser({
                ...currentUser,
                senha: e.target.value,
              })
            }
            helperText={
              isEditing ? "Deixe em branco para manter a senha atual" : ""
            }
          />
          <Switch
            checked={currentUser.adm === true}
            onChange={(e) =>
              setCurrentUser({
                ...currentUser,
                adm: e.target.checked,
              })
            }
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