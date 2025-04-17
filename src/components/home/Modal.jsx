import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap'
import "./index.css";
import supabase from '../../supabaseClient';

function CenteredModal({ show, handleClose, modalData, setShouldUpdate }) {
  const [nomePessoa, setNomePessoa] = useState('');
  const [ultimoRegistro, setUltimoRegistro] = useState('');
  const [tempoDecorrido, setTempoDecorrido] = useState('');

  const token = localStorage.getItem('token');
  const tokenObj = JSON.parse(token);
  const { id: usuario_id } = tokenObj;

  useEffect(() => {
    const fetchUltimaRetirada = async () => {
      if (modalData && !modalData.chaveOn) {
        const { data, error } = await supabase
          .from('registros')
          .select('*')
          .eq('tipo', 'retirada')
          .eq('id_chave', modalData.id)
          .order('data_registro', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Erro ao buscar registro:', error);
        } else if (data && data.length > 0) {
          const registro = data[0];
          setUltimoRegistro(registro);

          const dataRegistro = new Date(registro.data_registro);
          const agora = new Date();
          const diffMs = agora - dataRegistro;

          const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const horas = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

          setTempoDecorrido(`${dias} dias, ${horas} horas, ${minutos} minutos`);
        }
      }
    };

    fetchUltimaRetirada();
  }, [modalData, show]);

  const handleAction = async (actionType) => {
    // Insere registro
    const { error: insertError } = await supabase
      .from('registros')
      .insert({
        id_chave: modalData.id,
        tipo: actionType,
        nome_pessoa: nomePessoa,
        usuario_id,
      });

    if (insertError) {
      console.error('Erro ao registrar ação:', insertError);
      return;
    }

    // Atualiza status da chave
    const { error: updateError } = await supabase
      .from('chaves')
      .update({ chaveOn: actionType === 'retirada' ? false : true })
      .eq('id', modalData.id);

    if (updateError) {
      console.error('Erro ao atualizar chave:', updateError);
      return;
    }

    // Finaliza
    setShouldUpdate(true);
    setNomePessoa('');
    handleClose();
  };

  return (
    <Modal className='text-white' show={show} onHide={handleClose} centered>
      <ModalHeader closeButton>
        <ModalTitle>
          {modalData.chaveOn ? `Chave: ${modalData.nome}` : `Chave Retirada: ${modalData.nome}`}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p className='mb-2'>Número da Chave: {modalData.numero}</p>
        {!modalData.chaveOn && (
          <>
            <p className='mb-2'>Retirante: {ultimoRegistro ? ultimoRegistro.nome_pessoa : 'Sem informações'}</p>
            <p>Retirada há: {tempoDecorrido || '00 dias, 00 horas, 00 minutos'}</p>
          </>
        )}
        <Form>
          <Form.Group className='d-flex flex-warp align-items-center'>
            <Form.Label className='me-2 mt-1'>
              {modalData.chaveOn ? 'Solicitante:' : 'Restituinte:'}
            </Form.Label>
            <Form.Control
              value={nomePessoa}
              onChange={(e) => setNomePessoa(e.target.value)}
              type='text'
              placeholder={`nome de quem está ${modalData.chaveOn ? 'retirando' : 'devolvendo'} a chave`}
              required
            />
          </Form.Group>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          variant={modalData.chaveOn ? 'danger' : 'success'}
          onClick={() => handleAction(modalData.chaveOn ? 'retirada' : 'devolucao')}
        >
          {modalData.chaveOn ? 'Retirar' : 'Devolver'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default CenteredModal;
