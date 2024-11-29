// eslint-disable-next-line
import axios from "axios"
import { useEffect, useState } from "react"
import CryptoJS from 'crypto-js';
import { Pagination, Table, Button } from "react-bootstrap";
import jsPDF from 'jspdf';
import "./index.css"

function Registros({tipo,shouldUpdate,setShouldUpdate}) {
  const [listaRetiradas, setListaRetiradas] = useState([]);
  const [listaDevolucoes, setListaDevolucoes] = useState([]);
  const [itensPerPage, setItensPerPage] = useState(10);
  const [currentPageRetiradas, setCurrentPageRetiradas] = useState(1);
  const [currentPageDevolucoes, setCurrentPageDevolucoes] = useState(1);

  // Novos estados para filtros
  const [filtroAno, setFiltroAno] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroChave, setFiltroChave] = useState('');
  const [filtroNome, setFiltroNome] = useState('');
  const [ordemData, setOrdemData] = useState('recente');

  // Função para exportar PDF
  const exportToPDF = () => {
    // Determinar os dados e título corretos com base no tipo
    const usuario = JSON.parse(localStorage.getItem('token'));
    const dadosFiltrados = tipo === 'retirada' ? dadosFiltradosRetiradas : dadosFiltradosDevolucoes;
    const title = tipo === 'retirada' 
      ? 'Relatório de Retiradas' 
      : 'Relatório de Devoluções';

    // Criar novo documento PDF
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4'
    });

    // Configurações de estilo para o PDF
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const fontSize = 10;
    const lineHeight = 20;
    const tableTop = 100;

    // Adicionar título
    doc.setFontSize(16);
    doc.text(title, margin, 60, { align: 'left' });
    
    // Adicionar data do relatório
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleString()} , Usuário: ${usuario.nome}`, margin, 80, { align: 'left' });

    // Configurar cabeçalho da tabela
    const headers = ['Chave', 'Solicitante', 'Horário do Registro'];
    const columnsWidth = [
      pageWidth * 0.2,   // Chave
      pageWidth * 0.4,   // Solicitante
      pageWidth * 0.3    // Horário
    ];

    // Função para adicionar nova página
    const addPage = () => {
      doc.addPage();
      doc.setFontSize(10);
      doc.text(title + ' (Continuação)', margin, 60, { align: 'left' });
      return tableTop;
    };

    // Renderizar cabeçalho
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    headers.forEach((header, i) => {
      doc.text(
        header, 
        margin + columnsWidth.slice(0, i).reduce((a, b) => a + b, 0), 
        tableTop
      );
    });

    // Renderizar linhas
    doc.setFontSize(fontSize);
    doc.setFont(undefined, 'normal');
    
    let currentY = tableTop + lineHeight;
    dadosFiltrados.forEach((item, index) => {
      // Verificar se precisa de nova página
      if (currentY > pageHeight - margin) {
        currentY = addPage() + lineHeight;
      }

      // Renderizar células
      const rowData = [
        item.id_chave.toString(),
        item.nome_pessoa,
        item.data_registro
      ];

      rowData.forEach((text, colIndex) => {
        doc.text(
          text, 
          margin + columnsWidth.slice(0, colIndex).reduce((a, b) => a + b, 0), 
          currentY
        );
      });

      // Adicionar linha horizontal
      doc.setDrawColor(200);
      doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5);

      currentY += lineHeight;
    });

    // Adicionar rodapé com total de registros
    doc.setFontSize(10);
    doc.text(`Total de Registros: ${dadosFiltrados.length}`, 
      margin, 
      pageHeight - 20, 
      { align: 'left' }
    );

    // Salvar PDF
    doc.save(`${title}_${new Date().toLocaleDateString()}.pdf`);
  };

  const handleItensPerPageChange = (e) => {
    const selectedValue = parseInt(e.target.value, 10);
    setItensPerPage(selectedValue);
    setCurrentPageRetiradas(1);
    setCurrentPageDevolucoes(1);
  };

  const paginateRetiradas = (pageNumber) => setCurrentPageRetiradas(pageNumber);
  const paginateDevolucoes = (pageNumber) => setCurrentPageDevolucoes(pageNumber);

  // Função de filtro principal
  const aplicarFiltros = (dados) => {
    return dados
      .filter(item => {
        const dataRegistro = new Date(item.data_registro);
        
        // Filtro por Ano
        if (filtroAno && dataRegistro.getFullYear() !== parseInt(filtroAno)) return false;
        
        // Filtro por Mês
        if (filtroMes && (dataRegistro.getMonth() + 1) !== parseInt(filtroMes)) return false;
        
        // Filtro por Chave
        if (filtroChave && !item.id_chave.toString().includes(filtroChave)) return false;
        
        // Filtro por Nome
        if (filtroNome && !item.nome_pessoa.toLowerCase().includes(filtroNome.toLowerCase())) return false;
        
        return true;
      })
      .sort((a, b) => {
        const dataA = new Date(a.data_registro);
        const dataB = new Date(b.data_registro);
        
        // Ordem das datas
        return ordemData === 'recente' 
          ? dataB.getTime() - dataA.getTime() 
          : dataA.getTime() - dataB.getTime();
      });
  };

  const fillEmptyRows = (data, currentPage, itensPerPage) => {
    const startIndex = (currentPage - 1) * itensPerPage;
    const endIndex = currentPage * itensPerPage;

    const filledData = [...data];

    for (let i = data.length; i < endIndex; i++) {
      filledData.push({ id: i, id_chave: '', nome_pessoa: '', data_registro: '' });
    }

    return filledData.slice(startIndex, endIndex);
  };

  // Aplicar filtros nos dados
  const dadosFiltradosRetiradas = aplicarFiltros(listaRetiradas);
  const dadosFiltradosDevolucoes = aplicarFiltros(listaDevolucoes);

  // Calcular paginação para dados filtrados
  const filteredRetiradas = fillEmptyRows(dadosFiltradosRetiradas, currentPageRetiradas, itensPerPage);
  const filteredDevolucoes = fillEmptyRows(dadosFiltradosDevolucoes, currentPageDevolucoes, itensPerPage);

  // Gerar números de página
  const pageNumbersRetiradas = [];
  for (let i = 1; i <= Math.ceil(dadosFiltradosRetiradas.length / itensPerPage); i++) {
    pageNumbersRetiradas.push(
      <Pagination.Item key={i} active={i === currentPageRetiradas} onClick={() => paginateRetiradas(i)}>
        {i}
      </Pagination.Item>
    );
  }

  const pageNumbersDevolucoes = [];
  for (let i = 1; i <= Math.ceil(dadosFiltradosDevolucoes.length / itensPerPage); i++) {
    pageNumbersDevolucoes.push(
      <Pagination.Item key={i} active={i === currentPageDevolucoes} onClick={() => paginateDevolucoes(i)}>
        {i}
      </Pagination.Item>
    );
  }

  // Componente de Filtros
  const ComponenteFiltros = () => (
    <div className="filtros mb-3 d-flex flex-wrap justify-content-between">
      <input 
        type="text" 
        placeholder="Filtrar por Ano" 
        value={filtroAno}
        onChange={(e) => setFiltroAno(e.target.value)}
        className="form-control m-1"
        style={{width: '150px'}}
      />
      
      <select 
        value={filtroMes} 
        onChange={(e) => setFiltroMes(e.target.value)}
        className="form-control m-1"
        style={{width: '150px'}}
      >
        <option value="">Todos os Meses</option>
        {[...Array(12)].map((_, index) => (
          <option key={index} value={index + 1}>
            {new Date(0, index).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>
      
      <input 
        type="text" 
        placeholder="Filtrar por Chave" 
        value={filtroChave}
        onChange={(e) => setFiltroChave(e.target.value)}
        className="form-control m-1"
        style={{width: '150px'}}
      />
      
      <input 
        type="text" 
        placeholder="Filtrar por Nome" 
        value={filtroNome}
        onChange={(e) => setFiltroNome(e.target.value)}
        className="form-control m-1"
        style={{width: '150px'}}
      />
      
      <select 
        value={ordemData} 
        onChange={(e) => setOrdemData(e.target.value)}
        className="form-control m-1"
        style={{width: '150px'}}
      >
        <option value="recente">Mais Recente</option>
        <option value="antiga">Mais Antiga</option>
      </select>
    </div>
  );

  const decryptAES = (encryptedData, password) => {
    try {
      const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
      const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedData.data);

      const decryptedBytes = CryptoJS.AES.decrypt(
          { ciphertext: encryptedBytes },
          CryptoJS.enc.Utf8.parse(password),
          { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );

      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Erro ao descriptografar:', error);
      return null;
    }
  };

  useEffect(() => {
    // Apenas recarregar os dados se shouldUpdate for true
    if (shouldUpdate) {
      const fetchData = async () => {
        try {
          const response = await axios.get("https://hospitalemcor.com.br/claviscord/api/index.php?table=registros");
          const decryptedData = decryptAES(response.data, '0123456789ABCDEF0123456789ABCDEF');
          if (decryptedData && Array.isArray(decryptedData)) {
            setListaRetiradas(decryptedData.filter(registro => registro.tipo === "retirada"));
            setListaDevolucoes(decryptedData.filter(registro => registro.tipo === "devolucao"));
          }
        } catch (error) {
          console.error('Erro ao obter os dados:', error);
        }
      };
      fetchData();
    }
  }, [shouldUpdate,setListaRetiradas,setListaDevolucoes,setShouldUpdate]);

  useEffect(() => {
    axios.get("https://hospitalemcor.com.br/claviscord/api/index.php?table=registros")
    .then(response => {
      try {
        const decryptedData = decryptAES(response.data, '0123456789ABCDEF0123456789ABCDEF');
        if (decryptedData && Array.isArray(decryptedData)) {
          setListaRetiradas(decryptedData.filter(registro => registro.tipo === "retirada"));
          setListaDevolucoes(decryptedData.filter(registro => registro.tipo === "devolucao"));
        } else {
          console.error('Erro ao descriptografar os dados ou os dados não são um array.');
        }
      } catch (error) {
        console.error('Erro ao processar os dados:', error);
      }
    })
    .catch(error => {
      console.error('Erro ao obter as chaves:', error);
    });
  }, []);

  if (tipo === 'retirada') {
    return (
      <div className="pai d-flex flex-column justify-content-center align-items-center">
        <div className="lista">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <label className="me-1" htmlFor="itensPerPage">Itens por página:</label>
              <select 
                id="itensPerPage" 
                value={itensPerPage} 
                onChange={handleItensPerPageChange}
              >
                {[...Array(10).keys()].map((value) => (
                  <option key={(value + 1) * 5} value={(value + 1) * 5}>
                    {(value + 1) * 5}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="primary" onClick={exportToPDF}>
              Exportar PDF
            </Button>
          </div>

          <ComponenteFiltros />

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
  else if (tipo === 'devolucao') {
    return (
      <div className="pai d-flex flex-column justify-content-center align-items-center">
        <div className="lista">
        <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
            <label className="me-1" htmlFor="itensPerPage">Itens por página:</label>
            <select 
              id="itensPerPage" 
              value={itensPerPage} 
              onChange={handleItensPerPageChange}
            >
              {[...Array(10).keys()].map((value) => (
                <option key={(value + 1) * 5} value={(value + 1) * 5}>
                  {(value + 1) * 5}
                </option>
              ))}
            </select>
            </div>
            <Button variant="primary" onClick={exportToPDF}>
              Exportar PDF
            </Button>
          </div>

          <ComponenteFiltros />

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

export default Registros;