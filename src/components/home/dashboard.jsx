import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import supabase from "../../supabaseClient";


const Dashboard = ({ shouldUpdate, updateShouldUpdate }) => {
const [chaves, setChaves] = useState([]);

    useEffect(() => {
        const fetchChaves = async () => {
          const { data, error } = await supabase.from("chaves").select("*");
          if (error) {
            console.error("Erro ao buscar chaves:", error.message);
            return;
          }
          setChaves(data);
        };
    
        fetchChaves();
      }, [shouldUpdate]);

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {field: "keyNumber", headerName: "Número da Chave", width: 150 },
        { field: "keyName", headerName: "Nome da Chave", width: 150 },
        { field: "status", headerName: "Status", width: 120 }
    ];

    const rows = chaves.map((chave, index) => ({
        id: chave.id || index + 1,
        keyNumber: chave.numero || `00${index + 1}`,
        keyName: chave.nome || `Chave ${String.fromCharCode(65 + index)}`,
        status: chave.chaveOn ? "devolvida" : "Em uso" || "Indefinido",
    }));

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Painel de Movimentação de Chaves
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total de Chaves</Typography>
                            <Typography variant="h4">3</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Chaves Ativas</Typography>
                            <Typography variant="h4">2</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Chaves Inativas</Typography>
                            <Typography variant="h4">1</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                < Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Movimentações de Chaves
                        </Typography>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={50}
                            autoHeight
                        />
                
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;