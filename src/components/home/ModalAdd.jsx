import React, { useState } from 'react';
import { FormControl, Input, InputLabel, TextField } from '@mui/material';
import { Button, Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import supabase from '../../supabaseClient';


function ModalAdd({ show, handleClose, onKeyAdded, setShouldUpdate }) {
  const [keyName, setKeyName] = useState('');
  const [keyNumber, setKeyNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('chaves')
        .insert([{ nome: keyName, numero: keyNumber, chaveOn: true }]) // adiciona chave com status disponível

      if (error) {
        console.error('Erro ao adicionar chave:', error);
        alert('Erro ao adicionar chave. Tente novamente.');
        return;
      }

      console.log('Chave adicionada com sucesso:', data);

      if (onKeyAdded) {
        onKeyAdded(data[0]); // supabase retorna array
      }

      setShouldUpdate(true);
      setKeyName('');
      setKeyNumber('');
      handleClose();
    } catch (err) {
      console.error('Erro inesperado:', err);
      alert('Erro inesperado ao adicionar chave.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className='text-white'>
      <ModalHeader closeButton>
        <Modal.Title>Adicionar Chave</Modal.Title>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit} className='bg-light p-3 rounded'>
          <Form.Group className="mb-3">
            <TextField
              className="mb-3"
              label="Nome da Chave"
              variant="outlined"
              fullWidth
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              required
            />
            <FormControl fullWidth>
              <InputLabel htmlFor="numeroChave">Número da Chave</InputLabel>
              <Input
                id="numeroChave"
                type="number"
                value={keyNumber}
                onChange={(e) => setKeyNumber(e.target.value)}
                required
              />
            </FormControl>
          </Form.Group>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Adicionar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalAdd;
