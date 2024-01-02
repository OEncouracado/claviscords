// eslint-disable-next-line
import axios from "axios"
import { useEffect, useState } from "react"
import  CryptoJS  from 'crypto-js';
import { Pagination, Table } from "react-bootstrap";
import "./index.css"

function Registros(props) {// eslint-disable-next-line
  const [listaRetiradas, setListaRetiradas] = useState([]);
  const [listaDevolucoes, setListaDevolucoes] = useState([]);
  const [itensPerPage, setItensPerPage] = useState(10); // Inicializado com 10 itens por página
  const [currentPageRetiradas, setCurrentPageRetiradas] = useState(1);
  const [currentPageDevolucoes, setCurrentPageDevolucoes] = useState(1);

  const handleItensPerPageChange = (e) => {
    const selectedValue = parseInt(e.target.value, 10);
    setItensPerPage(selectedValue);
    setCurrentPageRetiradas(1); // Reiniciar a página ao alterar a quantidade de itens por página
    setCurrentPageDevolucoes(1);
  };


  const paginateRetiradas = (pageNumber) => setCurrentPageRetiradas(pageNumber);
  const paginateDevolucoes = (pageNumber) => setCurrentPageDevolucoes(pageNumber);

 // ...

const fillEmptyRows = (data, currentPage, itensPerPage) => {
  const startIndex = (currentPage - 1) * itensPerPage;
  const endIndex = currentPage * itensPerPage;

  const filledData = [...data];

  for (let i = data.length; i < endIndex; i++) {
    filledData.push({ id: i, id_chave: '', nome_pessoa: '', data_registro: '' });
  }

  return filledData.slice(startIndex, endIndex);
};

const filteredRetiradas = fillEmptyRows(listaRetiradas, currentPageRetiradas, itensPerPage);
const filteredDevolucoes = fillEmptyRows(listaDevolucoes, currentPageDevolucoes, itensPerPage);

// ...

  const pageNumbersRetiradas = [];
for (let i = 1; i <= Math.ceil(listaRetiradas.length / itensPerPage); i++) {
  pageNumbersRetiradas.push(
    <Pagination.Item key={i} active={i === currentPageRetiradas} onClick={() => paginateRetiradas(i)}>
      {i}
    </Pagination.Item>
  );
}

const pageNumbersDevolucoes = [];
for (let i = 1; i <= Math.ceil(listaDevolucoes.length / itensPerPage); i++) {
  pageNumbersDevolucoes.push(
    <Pagination.Item key={i} active={i === currentPageDevolucoes} onClick={() => paginateDevolucoes(i)}>
      {i}
    </Pagination.Item>
  );
}

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
    axios.get("https://hospitalemcor.com.br/claviscord/api/index.php?table=registros" )
    .then(response => {
      try {
        // Descriptografa os dados
        const decryptedData = decryptAES(response.data, '0123456789ABCDEF0123456789ABCDEF');
        console.log(decryptedData);
        // const decryptedData = decryptAES(response.data, process.env.REACT_APP_API_KEY);
        if (decryptedData && Array.isArray(decryptedData)) {
          // Se decryptedData for um array, você pode configurar as chaves no estado
          setListaRetiradas(decryptedData.filter(registro => registro.tipo === "retirada"));
          setListaDevolucoes(decryptedData.filter(registro => registro.tipo === "devolucao"));
        } else {
          console.log(decryptedData);
          console.error('Erro ao descriptografar os dados ou os dados não são um array.');
        }
      } catch (error) {
        console.error('Erro ao processar os dados:', error);
      }
    })
    .catch(error => {
      console.error('Erro ao obter as chaves:', error);
    });
}
, [])
  if (props.tipo === 'retirada'){
    return (<div className="pai d-flex flex-column justify-content-center align-items-center">
      <div className="lista">
          <div className="mb-1"><label className="me-1" htmlFor="itensPerPage">Itens por página:</label>
          <select id="itensPerPage" value={itensPerPage} onChange={handleItensPerPageChange}>
        {[...Array(10).keys()].map((value) => (
          <option key={(value + 1) * 5} value={(value + 1) * 5}>
            {(value + 1) * 5}
          </option>
        ))}
      </select>
          </div>

          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Chave</th>
                <th>Solicitante</th>
                <th>Horário do Registro</th>
              </tr>
            </thead>
            <tbody>
              {filteredRetiradas.map((item) => (
                <tr key={item.id}>
                  <td>{item.id_chave}</td>
                  <td>{item.nome_pessoa}</td>
                  <td>{item.data_registro}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
          <Pagination className="mt-0">
            {pageNumbersRetiradas}
          </Pagination>
      </div>
    );
  }
  else if(props.tipo === 'devolucao'){
    return (<div className="pai d-flex flex-column justify-content-center align-items-center">
      <div className="lista">
          <div className="mb-1"><label className="me-1" htmlFor="itensPerPage">Itens por página:</label>
          <select id="itensPerPage" value={itensPerPage} onChange={handleItensPerPageChange}>
        {[...Array(10).keys()].map((value) => (
          <option key={(value + 1) * 5} value={(value + 1) * 5}>
            {(value + 1) * 5}
          </option>
        ))}
      </select>
          </div>

          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Chave</th>
                <th>Solicitante</th>
                <th>Horário do Registro</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevolucoes.map((item) => (
                <tr key={item.id}>
                  <td>{item.id_chave}</td>
                  <td>{item.nome_pessoa}</td>
                  <td>{item.data_registro}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
          <Pagination className="mt-0">
            {pageNumbersDevolucoes}
          </Pagination>
      </div>
    );
  }
}

export default Registros
