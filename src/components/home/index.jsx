import React, { useState, useEffect } from 'react';
import chaveImag from "../../images/chave.webp";
import { Pagination } from 'react-bootstrap';
import CryptoJS from 'crypto-js';
import axios from 'axios';

function Claviculario() {
  const [currentPage, setCurrentPage] = useState(1);
  const chavesPerPage = 10;
  const [chaves, setChaves] = useState([]);

  useEffect(() => {
    axios.get('https://hospitalemcor.com.br/claviscord/api/index.php?table=chaves')
      .then(response => {
        try {
          const base64Data = response.data;
          const encryptedData = base64toHex(base64Data);
          const decryptedData = decryptAES(encryptedData, '1234');

          // Verifica se a descriptografia foi bem-sucedida
          if (decryptedData) {
            const jsonData = JSON.parse(decryptedData);
            setChaves(jsonData);
          } else {
            console.error('Erro ao descriptografar os dados.');
          }
        } catch (error) {
          console.error('Erro ao processar os dados:', error);
        }
      })
      .catch(error => {
        console.error('Erro ao obter as chaves:', error);
      });
  }, []);

  const base64toHex = (base64) => {
    const raw = atob(base64);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result;
  }

  const decryptAES = (encryptedData, password) => {
    try {
      var decryptedBytes = CryptoJS.AES.decrypt(encryptedData, password);
      const decryptedD = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return decryptedD;
    } catch (error) {
      console.error('Erro ao descriptografar:', error);
      return null;
    }
  }

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