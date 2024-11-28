import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap'
import "./index.css";
import axios from 'axios';
import  CryptoJS  from 'crypto-js';

function CenteredModal({ show, handleClose, modalData, setShouldUpdate }) {
    const [nomePessoa, setNomePessoa] = useState('');
    const [ultimoRegistro, setUltimoRegistro] = useState('');
    const [tempoDecorrido, setTempoDecorrido] = useState('');

    // eslint-disable-next-line
    const [token , setToken] = useState(localStorage.getItem('token'));
    const tokenObj = JSON.parse(token);
    // eslint-disable-next-line
    const { id, nome, Adm } = tokenObj;
    const decryptAES = (encryptedData, password) => {
        try {
          const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
          const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedData.data); // Modificação aqui
    
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

      useEffect(() => {
        if (modalData && !modalData.chaveOn) {
            axios.get(`https://hospitalemcor.com.br/claviscord/api/index.php?table=registros&tipo=retirada`)
                .then(response => {
                    try {
                        const decryptedData = decryptAES(response.data, '0123456789ABCDEF0123456789ABCDEF');
                        if (decryptedData && decryptedData.length > 0) {
                            // Pega o último registro (último elemento do array)
                            const retiradas = decryptedData.filter(item => item.tipo === "retirada");
                            const registrosChave = retiradas.filter(item => item.id_chave === modalData.id);
                            // const registro = decryptedData[decryptedData.length - 1];
                            const registro = registrosChave[registrosChave.length - 1];
                            setUltimoRegistro(registro);

                            const dataRegistro = new Date(registro.data_registro);
                            const agora = new Date();
                            const diffMs = agora - dataRegistro;
                            
                            const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                            const horas = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                            setTempoDecorrido(`${dias} dias, ${horas} horas, ${minutos} minutos`);
                        }
                    } catch (error) {
                        console.error('Erro ao processar os dados:', error);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar último registro:', error);
                });
        }
    }, [modalData,show]);
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
                .catch(error => {
                    console.error('Erro ao processar os dados:', error);
                });  
        // Fechar a modal
        setShouldUpdate(true);
        setNomePessoa('');
        handleClose();
    };

  return (
    modalData.chaveOn ?
        <Modal className='text-white' show={show} onHide={handleClose} centered>
            <ModalHeader closeButton>
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
        <Modal className='text-white' show={show} onHide={handleClose} centered>
            <ModalHeader closeButton>
                <ModalTitle>Chave Retirada: {modalData.nome}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <p className='mb-2'>Número da Chave: {modalData.numero}</p>
                <p className='mb-2'>Retirante: {ultimoRegistro ? ultimoRegistro.nome_pessoa : 'Sem informações'}</p>
                <p>Retirada há: {tempoDecorrido || '00 dias, 00 horas, 00 minutos'}</p>
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
