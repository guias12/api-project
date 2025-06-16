import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, Tab, Box } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FilterControls from "./components/Ui/FilterControls/FilterControls";
import TabPanel from "./components/Ui/TabPanel/TabPanel";
import ExportButton from "./components/Ui/ExportButton/ExportButton";
import TodosComponent from "./components/DataTypes/Todos/Todos";
import MoedasComponent from "./components/DataTypes/Moedas/Moedas";
import CriptomoedasComponent from "./components/DataTypes/Crypto/Crypto";
import AcoesComponent from "./components/DataTypes/Acoes/Acoes";
import CommoditiesComponent from "./components/DataTypes/Commodities/Commodities";

function App() {
  const [dados, setDados] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtrados, setFiltrados] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [rates, setRates] = useState([])

  useEffect(() => {
    const buscarDados = async () => {
      const moedasRes = await axios.get(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      setRates(moedasRes.data.rates)
      const moedas = Object.entries(moedasRes.data.rates)
        .slice(0, 10)
        .map(([nome, valor]) => ({
          nome,
          valor,
          tipo: "moeda",
        }));

      const criptoRes = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page=1"
      );
      const criptos = criptoRes.data.map((c) => ({
        nome: c.name,
        valor: c.current_price,
        tipo: "cripto",
      }));

      const todos = [...moedas, ...criptos];
      setDados(todos);
      setFiltrados(todos);
    };

    buscarDados();
  }, []);

  useEffect(() => {
    let filtragem = [...dados];
    if (filtroTexto.trim() !== "") {
      filtragem = filtragem.filter((item) =>
        item.nome.toLowerCase().includes(filtroTexto.toLowerCase())
      );
    }
    setFiltrados(filtragem);
  }, [filtroTexto, dados]);

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Dados Financeiros", 14, 10);
    autoTable(doc, {
      head: [["Nome", "Valor", "Tipo"]],
      body: filtrados.map((item) => [item.nome, item.valor, item.tipo]),
    });
    doc.save("dados-financeiros.pdf");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Dashboard Financeiro</h2>

      <FilterControls
        filtroTexto={filtroTexto}
        setFiltroTexto={setFiltroTexto}
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Todos" />
          <Tab label="Moedas" />
          <Tab label="Criptomoedas" />
          <Tab label="Ações" />
          <Tab label="Commodities" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TodosComponent data={filtrados} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <MoedasComponent exchangeRates={rates} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <CriptomoedasComponent data={filtrados} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <AcoesComponent data={filtrados} />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <CommoditiesComponent data={filtrados} />
      </TabPanel>

      <ExportButton onClick={exportarPDF} />
    </div>
  );
}

export default App;
