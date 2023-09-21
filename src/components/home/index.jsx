import React, { useState } from 'react';
import chaveImag from "../../images/chave.webp"; // eslint-disable-next-line
import { Button, Pagination } from 'react-bootstrap';

function Claviculario() {
  const [currentPage, setCurrentPage] = useState(1);
  const chavesPerPage = 10;

  const [chaves, setChaves] = useState([]);

  // const [chaves, setChaves] = useState([
  //   { id: 1, numero: 1, nome: 'GARAGEM', chaveOn: true },
  //   { id: 2, numero: 2, nome: 'LIXEIRA EXTERNA', chaveOn: true },
  //   { id: 3, numero: 3, nome: 'PORTA DE GRADE (NEOVIDA)', chaveOn: true },
  //   { id: 4, numero: 4, nome: 'RECEPÇÃO DO AMBULATÓRIO', chaveOn: true },
  //   { id: 5, numero: 5, nome: 'SALA DO ELETROCARDIOGRAMA', chaveOn: true },
  //   { id: 6, numero: 6, nome: 'FARMÁCIA / ESTOQUE', chaveOn: true },
  //   { id: 7, numero: 7, nome: 'COMPRESSOR', chaveOn: true },
  //   { id: 8, numero: 8, nome: 'BANHEIRO FEMININO (FUNC.)', chaveOn: true },
  //   { id: 9, numero: 9, nome: 'VESTIÁRIO', chaveOn: true },
  //   { id: 10, numero: 10, nome: 'S.A.M.E. (ARQUIVO)', chaveOn: true },
  //   { id: 11, numero: 11, nome: 'MANUTENÇÃO AUTOCLAVE', chaveOn: true },
  //   { id: 12, numero: 12, nome: 'C.M.E.', chaveOn: true },
  //   { id: 13, numero: 13, nome: 'BANHEIRO MASCULINO', chaveOn: true },
  //   { id: 14, numero: 14, nome: 'PORTA DA RAMPA (1º 2º ANDAR)', chaveOn: true },
  //   { id: 15, numero: 15, nome: 'CENTRO CIRÚRGICO', chaveOn: true },
  //   { id: 16, numero: 16, nome: 'PORTA DOS FUNDOS (Enf. 107', chaveOn: true },
  //   { id: 17, numero: 17, nome: 'PORTÃO DE FERRO', chaveOn: true },
  //   { id: 18, numero: 18, nome: 'PORTA DE ALUMÍNIO (CORREDOR', chaveOn: true },
  //   { id: 19, numero: 19, nome: 'CENTRAL TELEFÔNICA', chaveOn: true },
  //   { id: 20, numero: 20, nome: 'BLINDEX RECEPÇÃO SOCIAL', chaveOn: true },
  //   { id: 21, numero: 21, nome: 'LIXO INFECTANTE', chaveOn: true },
  //   { id: 22, numero: 22, nome: 'PORTA EMBAIXO DA ESCADA', chaveOn: true },
  //   { id: 23, numero: 23, nome: 'CONSULTÓRIO 01 (EMERGÊNCIA)', chaveOn: true },
  //   { id: 24, numero: 24, nome: 'ESTOQUE DA HOTELARIA', chaveOn: true },
  //   { id: 25, numero: 25, nome: 'SALA DE MEDICAÇÕES (EMERGÊNCIA)', chaveOn: true },
  //   { id: 26, numero: 26, nome: 'QUADRO ELÉTRICO (RECEPÇÃO', chaveOn: true },
  //   { id: 27, numero: 27, nome: 'BLINDEX DE ACESSO AO', chaveOn: true },
  //   { id: 28, numero: 28, nome: 'QUALIDADE / NUTRIÇÃO', chaveOn: true },
  //   { id: 29, numero: 29, nome: 'COZINHA', chaveOn: true },
  //   { id: 30, numero: 30, nome: 'SALA DE COLETA (EXAMES', chaveOn: true },
  //   { id: 31, numero: 31, nome: 'CONSULTÓRIO 101', chaveOn: true },
  //   { id: 32, numero: 32, nome: 'REFEITÓRIO', chaveOn: true },
  //   { id: 33, numero: 33, nome: 'COPINHA', chaveOn: true },
  //   { id: 34, numero: 34, nome: 'BANHEIRO 1º ANDAR', chaveOn: true },
  //   { id: 35, numero: 35, nome: 'MANUTENÇÃO', chaveOn: true },
  //   { id: 36, numero: 36, nome: 'PORTA DE ALUMÍNIO (CORREDOR', chaveOn: true },
  //   { id: 37, numero: 37, nome: 'PORTÃO (CORREDOR DO', chaveOn: true },
  //   { id: 38, numero: 38, nome: 'ROUPARIA', chaveOn: true },
  //   { id: 39, numero: 39, nome: 'AUDITÓRIO', chaveOn: true },
  //   { id: 40, numero: 40, nome: 'CONSULTÓRIO 204 (EM FRENTE', chaveOn: true },
  //   { id: 41, numero: 41, nome: 'HIPODERMIA / TRIAGEM', chaveOn: true },
  //   { id: 42, numero: 42, nome: 'BANHEIRO 2º ANDAR', chaveOn: true },
  //   { id: 43, numero: 43, nome: 'EXPURGO (CORREDOR DA TC)', chaveOn: true },
  //   { id: 44, numero: 44, nome: 'VESTIÁRIO MASCULINO', chaveOn: true },
  //   { id: 45, numero: 45, nome: 'PORTÃO DO AMBULATÓRIO', chaveOn: true },
  //   { id: 46, numero: 46, nome: 'COPA AO LADO DO', chaveOn: true },
  //   { id: 47, numero: 47, nome: 'PORTA EMBAIXO DA RAMPA', chaveOn: true }
  // ]);
  const toggleChave = (id) => {
    setChaves(chaves.map(chave =>
      chave.id === id ? { ...chave, chaveOn: !chave.chaveOn } : chave
    ));
  };

  const indexOfLastChave = currentPage * chavesPerPage;
  const indexOfFirstChave = indexOfLastChave - chavesPerPage;
  const currentChaves = chaves.slice(indexOfFirstChave, indexOfLastChave);

  const renderChaves = () => {
    return currentChaves.map(chave => (
      <div onClick={() => toggleChave(chave.id)} className="framechave d-flex flex-column align-items-center border p-1 m-1 " key={chave.id}>
            <p className='m-0'>{chave.numero}</p>
            <img
              className={chave.chaveOn ? 'chavetamanho' : 'chavetamanhosem'}
              src={chaveImag}
              alt={`chave ${chave.id}`}
            />
            <p className='nomeChave m-0'>{chave.nome}</p>
          </div>
    ));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(chaves.length / chavesPerPage); i++) {
    pageNumbers.push(
      <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
        {i}
      </Pagination.Item>
    );
  }

  return (
    <div className="pai d-flex flex-column justify-content-center align-items-center">
      <div className="d-flex flex-wrap">
        {renderChaves()}
      </div>
      <Pagination className="mt-4">
        {pageNumbers}
      </Pagination>
    </div>
  );
}

export default Claviculario;