import React from 'react'
import { Button, Form, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap'
import "./index.css";

function CenteredModal(props) {
    const {modalData} = props;
  return (
    modalData.chaveOn ?
        <Modal className='text-white' show={props.show} onHide={props.handleClose} centered>
            <ModalHeader>
                <ModalTitle>Chave: {modalData.nome}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <p className='mb-2'>Chave Numero: {modalData.numero}</p>
                <Form>
                    <Form.Group className='d-flex flex-warp align-items-center'>
                        <Form.Label className='me-2 mt-1'>Solicitante:</Form.Label>
                        <Form.Control type='text' placeholder='nome de quem está solicitando a chave' />
                    </Form.Group>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button variant='danger'>Retirar</Button>
            </ModalFooter>
        </Modal>
    :
        <Modal className='text-white' show={props.show} onHide={props.handleClose} centered>
            <ModalHeader>
                <ModalTitle>Chave Retirada: {modalData.nome}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <p className='mb-2'>Chave Numero: {modalData.numero}</p>
                <p className='mb-2'> Retirante: Quando Houver retirantes vai aparecer aqui</p>
                <p>Retirada há: 00 dias, 00 horas, 00 minutos.</p>
                <Form>
                    <Form.Group className='d-flex flex-warp align-items-center'>
                        <Form.Label className='me-2 mt-1'>Restituinte:</Form.Label>
                        <Form.Control type='text' placeholder='nome de quem está retornando a chave' />
                    </Form.Group>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button variant='success'>Devolver</Button>
            </ModalFooter>
        </Modal>
  )
}

export default CenteredModal
