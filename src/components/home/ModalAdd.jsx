import React, { useState } from 'react';
import { FormControl, Input, InputLabel, TextField } from '@mui/material';
import axios from 'axios';
import { Button, Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';

function ModalAdd({ show, handleClose, onKeyAdded,setShouldUpdate }) {
  const [keyName, setKeyName] = useState('');
  const [keyNumber, setKeyNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://hospitalemcor.com.br/claviscord/api/index.php?table=chaves', { 
            nome: keyName,
            numero: keyNumber
         }
      );
      
      console.log('Chave adicionada com sucesso:', response.data);
      
      // Optional callback to update parent component
      if (onKeyAdded) {
        onKeyAdded(response.data.data);
      }
      
      // Reset form and close modal
      setShouldUpdate(true);
      setKeyName('');
      setKeyNumber('');
      handleClose();
    } catch (error) {
      console.error('Erro ao adicionar chave:', error);
      alert('Erro ao adicionar chave. Tente novamente.');
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
            
            <FormControl >
                <InputLabel  htmlFor="numeroChave">Número da Chave</InputLabel>
                <Input
                variant='outlined'
                    id="numeroChave" 
                    type="number" 
                    fullWidth
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