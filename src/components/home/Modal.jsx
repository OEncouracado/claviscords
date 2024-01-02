import React, { useState } from 'react'
import { Button, Form, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap'
import "./index.css";
import axios from 'axios';

function CenteredModal({ show, handleClose, modalData, setShouldUpdate }) {
    const [nomePessoa, setNomePessoa] = useState('');
    // console.log(modalData.id)
    // eslint-disable-next-line
    const [token , setToken] = useState(localStorage.getItem('token'));
    const tokenObj = JSON.parse(token);// eslint-disable-next-line
    const { id, nome, Adm } = tokenObj;
    // console.log(id); // 1
    // console.log(nome); // Admin
    // console.log(Adm); // 1
    // console.log(modalData);
    const handleAction = (actionType) => {
        // Faça a solicitação ao endpoint da 
        axios.post('https://hospitalemcor.com.br/claviscord/api/index.php?table=registros', {
            id_chave: modalData.id,
            tipo: actionType,
            nome_pessoa: nomePessoa,
            usuario_id: id,
        })
            .then(response => {
                console.info(response)
                // Handle successful response
            })
            .catch(error => {
                // Handle errors
                console.error('Erro ao processar os dados:', error);
            });
        const atctipo = {
            chaveOn: actionType === 'retirada' ? 0 : 1,
          };
          console.log(atctipo);
          axios.patch(`https://hospitalemcor.com.br/claviscord/api/index.php?table=chaves&id=${modalData.id}`, atctipo)
                .then(response => {
                    console.info(response);
                    
                })
                .catch(error => {});  
        // Fechar a modal
        setShouldUpdate(true);
        setNomePessoa('');
        handleClose();
    };
  return (
    modalData.chaveOn ?
        <Modal className='text-white' show={show} centered>
            <ModalHeader>
                <ModalTitle>Chave: {modalData.nome}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <p className='mb-2'>Número da Chave: {modalData.numero}</p>
                <Form>
                    <Form.Group className='d-flex flex-warp align-items-center'>
                        <Form.Label className='me-2 mt-1'>Solicitante:</Form.Label>
                        <Form.Control value={nomePessoa} onChange={(e) => setNomePessoa(e.target.value)} type='text' placeholder='nome de quem está solicitando a chave' required/>
                    </Form.Group>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button variant='danger' onClick={() => handleAction('retirada')}>Retirar</Button>
            </ModalFooter>
        </Modal>
    :
        <Modal className='text-white' show={show} centered>
            <ModalHeader>
                <ModalTitle>Chave Retirada: {modalData.nome}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <p className='mb-2'>Número da Chave: {modalData.numero}</p>
                <p className='mb-2'> Retirante: Quando Houver retirantes vai aparecer aqui</p>
                <p>Retirada há: 00 dias, 00 horas, 00 minutos.</p>
                <Form>
                    <Form.Group className='d-flex flex-warp align-items-center'>
                        <Form.Label className='me-2 mt-1'>Restituinte:</Form.Label>
                        <Form.Control value={nomePessoa} onChange={(e) => setNomePessoa(e.target.value)} type='text' placeholder='nome de quem está retornando a chave' required />
                    </Form.Group>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button variant='success' onClick={() => handleAction('devolucao')}>Devolver</Button>
            </ModalFooter>
        </Modal>
  )
}

export default CenteredModal
