import React, { useEffect, useState } from "react";
import { CircularProgress, Alert } from "@mui/material";
import BarChartComponent from "../../Charts/BarChart/BarChart";
import LineChartComponent from "../../Charts/LineChart/LineChart";

const ChartContainer = ({ children, title }) => (
  <div style={{ marginBottom: 40 }}>
    <h3>{title}</h3>
    {children}
  </div>
);

const AcoesComponent = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3001/api/stocks");
        const data = await response.json();

        // Format data for our charts
        const formattedData = data.map((stock) => ({
          nome: stock.symbol.replace(".SA", ""),
          valor: stock.price,
          tipo: "acao",
          currency: "BRL",
          change: stock.change,
          changePercent: stock.changePercent,
        }));

        setStocks(formattedData);
      } catch (err) {
        console.error("Error fetching stock data:", err);
        setError("Failed to fetch stock data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();

    // Set up interval to refresh data every 5 minutes
    const interval = setInterval(fetchStockData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "40px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" style={{ margin: "20px" }}>
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <ChartContainer title="Cotações Atuais - Ações Brasileiras">
        <BarChartComponent data={stocks} />
      </ChartContainer>

      <ChartContainer title="Variação Percentual">
        <LineChartComponent
          data={stocks.map((stock) => ({
            nome: stock.nome,
            valor: stock.changePercent,
          }))}
        />
      </ChartContainer>

      <ChartContainer title="Detalhes das Ações">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Ação</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                Preço (R$)
              </th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                Variação (R$)
              </th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                Variação (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={index} style={{ border: "1px solid #ddd" }}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {stock.nome}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {stock.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    color: stock.change >= 0 ? "green" : "red",
                  }}
                >
                  {stock.change.toFixed(2)}
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    color: stock.changePercent >= 0 ? "green" : "red",
                  }}
                >
                  {stock.changePercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartContainer>
    </div>
  );
};

export default AcoesComponent;
