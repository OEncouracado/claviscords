import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import "./index.css";
import supabase from "../../supabaseClient";
import { Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

function Registros2({ shouldUpdate, setShouldUpdate }) {
  const [dados, setDados] = useState([]);
  const [chaves, setChaves] = useState([]);
  const [filtroAno, setFiltroAno] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroChave, setFiltroChave] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [ordemData, setOrdemData] = useState("recente");
  const { user } = useAuth();
  const usuario = user.email || { nome: "Usuário Desconhecido" }; // Precisa ser ajustado para pegar o nome do usuário logado, se disponível. Verificar como se altera o nome do usuário no sistema do Supabase.
  // const usuario = user || { nome: "Usuário Desconhecido" };// Precisa ser ajustado para pegar o nome do usuário logado, se disponível. Verificar como se altera o nome do usuário no sistema do Supabase.

  useEffect(() => {
    const fetchChaves = async () => {
      const { data, error } = await supabase.from("chaves").select("*");
      if (error) console.error("Erro ao buscar chaves:", error);
      else setChaves(data);
    };

    const fetchRegistros = async () => {
      const { data, error } = await supabase
        .from("registros")
        .select("*")
        .order("data_registro", { ascending: false });
      if (error) console.error("Erro ao buscar registros:", error);
      else setDados(data);
    };

    if (shouldUpdate || !chaves.length) {
      fetchChaves();
      fetchRegistros();
      if (setShouldUpdate) setShouldUpdate(false);
    }
  }, [shouldUpdate, setShouldUpdate, chaves.length]);

  const getNumeroChave = (idChave) => {
    const chave = chaves.find((c) => c.id === idChave);
    return chave ? chave.numero : "Desconhecido";
  };

  const getNomeChave = (idChave) => {
    const chave = chaves.find((c) => c.id === idChave);
    return chave ? chave.nome : "Desconhecido";
  };

  const aplicarFiltros = () => {
    return dados
      .filter((item) => {
        const dataRegistro = new Date(item.data_registro);
        if (filtroAno && dataRegistro.getFullYear() !== parseInt(filtroAno))
          return false;
        if (filtroMes && dataRegistro.getMonth() + 1 !== parseInt(filtroMes))
          return false;
        if (filtroChave && !item.id_chave.toString().includes(filtroChave))
          return false;
        if (
          filtroNome &&
          !item.nome_pessoa.toLowerCase().includes(filtroNome.toLowerCase())
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        const dataA = new Date(a.data_registro);
        const dataB = new Date(b.data_registro);
        return ordemData === "recente" ? dataB - dataA : dataA - dataB;
      });
  };

  // Função para exportar os dados filtrados para PDF
  const exportToPDF = () => {
    const dadosFiltrados = aplicarFiltros();
    const title = "Relatório de Registros";
    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const fontSize = 10;
    const lineHeight = 20;
    const tableTop = 100;

    doc.setFontSize(16);
    doc.text(title, margin, 60, { align: "left" });

    doc.setFontSize(10);
    doc.text(
      `Data: ${new Date().toLocaleString()} , Usuário: ${usuario}`,
      margin,
      80,
      { align: "left" }
    );

    const headers = ["Nº", "Nome", "Solicitante", "Horário do Registro"];
    const columnsWidth = [
      pageWidth * 0.1,
      pageWidth * 0.2,
      pageWidth * 0.4,
      pageWidth * 0.3,
    ];

    const addPage = () => {
      doc.addPage();
      doc.setFontSize(10);
      doc.text(title + " (Continuação)", margin, 60, { align: "left" });
      return tableTop;
    };

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    headers.forEach((header, i) => {
      doc.text(
        header,
        margin + columnsWidth.slice(0, i).reduce((a, b) => a + b, 0),
        tableTop
      );
    });

    doc.setFontSize(fontSize);
    doc.setFont(undefined, "normal");

    let currentY = tableTop + lineHeight;
    dadosFiltrados.forEach((item, index) => {
      if (currentY > pageHeight - margin) {
        currentY = addPage() + lineHeight;
      }

      const rowData = [
        getNumeroChave(item.id_chave).toString(),
        getNomeChave(item.id_chave).toString(),
        item.nome_pessoa,
        new Date(item.data_registro).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      ];

      rowData.forEach((text, colIndex) => {
        const x =
          margin + columnsWidth.slice(0, colIndex).reduce((a, b) => a + b, 0);
        const maxWidth = columnsWidth[colIndex] - 5; // pequeno padding pra não colar na borda
        const lines = doc.splitTextToSize(text, maxWidth);

        doc.text(lines, x, currentY);
      });

      let maxLines = 1;

      rowData.forEach((text, colIndex) => {
        const maxWidth = columnsWidth[colIndex] - 5;
        const lines = doc.splitTextToSize(text, maxWidth);
        if (lines.length > maxLines) maxLines = lines.length;
      });

      rowData.forEach((text, colIndex) => {
        const x =
          margin + columnsWidth.slice(0, colIndex).reduce((a, b) => a + b, 0);
        const maxWidth = columnsWidth[colIndex] - 5;
        const lines = doc.splitTextToSize(text, maxWidth);

        doc.text(lines, x, currentY);
      });

      doc.setDrawColor(200);
      doc.line(
        margin,
        currentY + maxLines * fontSize + 5,
        pageWidth - margin,
        currentY + maxLines * fontSize + 5
      );

      currentY += maxLines * fontSize + 20;
    });

    doc.setFontSize(10);
    doc.text(
      `Total de Registros: ${dadosFiltrados.length}`,
      margin,
      pageHeight - 20,
      { align: "left" }
    );

    doc.save(`${title}_${new Date().toLocaleDateString()}.pdf`);
  };

  // const exportToPDF = () => {
  //   const usuario = user || { nome: "Usuário Desconhecido" };
  //   const dadosFiltrados = aplicarFiltros();
  //   const doc = new jsPDF();
  //   const title = "Relatório de Registros";

  //   doc.setFontSize(16);
  //   doc.text(title, 20, 20);
  //   doc.setFontSize(10);
  //   doc.text(`Data: ${new Date().toLocaleString()} | Usuário: ${usuario.nome}`, 20, 30);

  //   const headers = ["Chave", "Nome", "Solicitante", "Horário do Registro"];
  //   const rows = dadosFiltrados.map((item) => [
  //     getNumeroChave(item.id_chave),
  //     getNomeChave(item.id_chave),
  //     item.nome_pessoa,
  //     new Date(item.data_registro).toLocaleString("pt-BR"),
  //   ]);

  //   doc.autoTable({
  //     head: [headers],
  //     body: rows,
  //     startY: 40,
  //   });

  //   doc.save(`${title}_${new Date().toLocaleDateString()}.pdf`);
  // };

  const columns = [
    { field: "idChave", headerName: "Chave", width: 150 },
    { field: "nomeChave", headerName: "Nome", width: 200 },
    { field: "tipoRegistro", headerName: "Tipo", width: 200 },
    { field: "nomePessoa", headerName: "Solicitante", width: 200 },
    { field: "data_registro", headerName: "Horário do Registro", width: 200 },
  ];

  return (
    <div className="container">
      <div className="filtros mb-3 d-flex flex-wrap justify-content-between">
        <input
          type="text"
          placeholder="Filtrar por Ano"
          value={filtroAno}
          onChange={(e) => setFiltroAno(e.target.value)}
          className="form-control m-1"
          style={{ width: "150px" }}
        />
        <select
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
          className="form-control m-1"
          style={{ width: "150px" }}
        >
          <option value="">Todos os Meses</option>
          {[...Array(12)].map((_, index) => (
            <option key={index} value={index + 1}>
              {new Date(0, index).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filtrar por Chave"
          value={filtroChave}
          onChange={(e) => setFiltroChave(e.target.value)}
          className="form-control m-1"
          style={{ width: "150px" }}
        />
        <input
          type="text"
          placeholder="Filtrar por Nome"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          className="form-control m-1"
          style={{ width: "150px" }}
        />
        <select
          value={ordemData}
          onChange={(e) => setOrdemData(e.target.value)}
          className="form-control m-1"
          style={{ width: "150px" }}
        >
          <option value="recente">Mais Recente</option>
          <option value="antiga">Mais Antiga</option>
        </select>
        <Button variant="primary" onClick={exportToPDF}>
          Exportar PDF
        </Button>
      </div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={aplicarFiltros()
            .filter((row) => row && row.id_chave !== undefined)
            .map((row) => ({
              ...row,
              id: row.id_registro || row.id,
              idChave: getNumeroChave(row.id_chave),
              nomeChave: getNomeChave(row.id_chave),
              tipoRegistro: row.tipo === "devolucao" ? "Devolução" : "Retirada",
              nomePessoa: row.nome_pessoa,
              data_registro: new Date(row.data_registro).toLocaleString(
                "pt-BR",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ),
            }))}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          columns={columns}
          pageSize={[10, 20, 50]}
          pageSizeOptions={[10, 20, 50]}
          autoHeight
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
    </div>
  );
}

export default Registros2;
