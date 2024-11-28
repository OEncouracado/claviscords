import React, { useState, useEffect } from 'react';
import chaveImag from "../../images/chave.webp";
import { Form, InputGroup, Pagination,} from 'react-bootstrap';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { BsSearch } from 'react-icons/bs';
import "../../index.css"
import CenteredModal from './Modal';
import ModalAdd from './ModalAdd';
import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';


function Claviculario({ shouldUpdate, setShouldUpdate }) {
  const [currentPage, setCurrentPage] = useState(1);
  const chavesPerPage = 10;
  const [chaves, setChaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para armazenar o valor da caixa de pesquisa
  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [modalData, setModalData] = useState([]);
  


  useEffect(() => {
    if (shouldUpdate || !chaves.length) {axios.get("https://hospitalemcor.com.br/claviscord/api/index.php?table=chaves")
      .then(response => {
        try {
          // Descriptografa os dados
          const decryptedData = decryptAES(response.data, '0123456789ABCDEF0123456789ABCDEF');
          // const decryptedData = decryptAES(response.data, process.env.REACT_APP_API_KEY);
          if (decryptedData && Array.isArray(decryptedData)) {
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
  }
  , [shouldUpdate, chaves]);

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

  const filteredChaves = chaves.filter((chave) =>
  chave.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
  chave.numero.toString().includes(searchTerm)
);


  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const indexOfLastChave = currentPage * chavesPerPage;
  const indexOfFirstChave = indexOfLastChave - chavesPerPage;
  const currentChaves = filteredChaves.slice(indexOfFirstChave, indexOfLastChave);

  

  const renderChaves = () => {
    return currentChaves.map(chave => (
        <div 
          key={chave.id}  // Add a unique key here
          onClick={() => handleShow(chave)} 
          className="framechave d-flex flex-column align-items-center border p-1 m-1 "
        >
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

  const handleClose = () => {
    setShow();
    renderChaves();
  };
  
  const handleShow = (chave) => {
    setShow(true);
    setModalData(chave);
  }

  const modalAddShow = () => {
    setShowAdd(true)
  }
  const modalAddClose = () => {
    setShowAdd(false)
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(chaves.length / chavesPerPage); i++) {
    pageNumbers.push(
      <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
        {i}
      </Pagination.Item>
    );
  }

  return (<>
    <div className="pai d-flex flex-column justify-content-center align-items-center" >
       <div className=" position-relative d-flex justify-content-evenly align-items-center w-100 searchboxitems rounded">
       <div className='w-75'>
          <TextField
            className="bg-light"
            variant="filled"
            placeholder="Digite para pesquisar..."
            name="searchField"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)} // Atualiza o estado com o valor digitado
            onKeyPress={handleSearchKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            fullWidth // Opcional: Ajusta o campo para ocupar todo o espaço disponível
          />
        </div>
          {/* <InputGroup.Text className='w-75'>
            <Form.Control
              type="search"
              placeholder="Digite para pesquisar..."
              className="form-control-transparent me-1"
              value={searchTerm}
              onKeyPress={handleSearchKeyPress}
              onChange={(event) => setSearchTerm(event.target.value)} // Atualiza o estado com o valor digitado na caixa de pesquisa
            />
            <BsSearch />
          </InputGroup.Text> */}
          <i 
          className="fas fa-plus-circle ms-3"
          style={{cursor:"pointer"}}
          color={showAdd ? "dark" : "light"}
          onClick={()=> modalAddShow()}/>
        </div>
        
      <div className="d-flex flex-wrap">
        {renderChaves()}
      </div>
      <Pagination className="mt-1">
        {pageNumbers}
      </Pagination>
    </div>
    
    <CenteredModal show={show} handleClose={handleClose} modalData={modalData} setShouldUpdate={setShouldUpdate}/>
    <ModalAdd show={showAdd} handleClose={modalAddClose} setShouldUpdate={setShouldUpdate} />
    </>
  );


  
}

export default Claviculario;