import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, CircularProgress, Alert } from "@mui/material";
import TabPanel from "./components/Ui/TabPanel/TabPanel";
import ExportButton from "./components/Ui/ExportButton/ExportButton";
import MoedasComponent from "./components/DataTypes/Moedas/Moedas";
import CriptomoedasComponent from "./components/DataTypes/Crypto/Crypto";
import AcoesComponent from "./components/DataTypes/Acoes/Acoes";
import CommoditiesComponent from "./components/DataTypes/Commodities/Commodities";
import { TOP_CURRENCIES, TOP_CRYPTOS } from "./constants/constants";

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    currencies: [],
    cryptos: [],
    stocks: [],
    commodities: [],
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [currenciesRes, cryptosRes, stocksRes, commoditiesRes] =
          await Promise.all([
            fetch("https://api.exchangerate-api.com/v4/latest/USD"),
            fetch(
              `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${TOP_CRYPTOS.join(
                ","
              )}`
            ),
            fetch("http://localhost:3001/api/stocks"),
            fetch("http://localhost:3001/api/commodities"),
          ]);

        if (
          !currenciesRes.ok ||
          !cryptosRes.ok ||
          !stocksRes.ok ||
          !commoditiesRes.ok
        ) {
          throw new Error("Failed to fetch some data");
        }

        const currenciesData = await currenciesRes.json();
        const cryptosData = await cryptosRes.json();
        const stocksData = await stocksRes.json();
        const commoditiesData = await commoditiesRes.json();

        setData({
          currencies: Object.entries(currenciesData.rates)
            .filter(([code]) => TOP_CURRENCIES[code])
            .map(([code, rate]) => ({
              code,
              name: TOP_CURRENCIES[code],
              rate,
              type: "currency",
            })),
          cryptos: cryptosData.map((crypto) => ({
            id: crypto.id,
            symbol: crypto.symbol.toUpperCase(),
            name: crypto.name,
            price: crypto.current_price,
            change: crypto.price_change_24h,
            changePercent: crypto.price_change_percentage_24h,
            type: "crypto",
          })),
          stocks: stocksData.map((stock) => ({
            symbol: stock.symbol,
            name: stock.name,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changePercent,
            type: "stock",
          })),
          commodities: commoditiesData.map((item) => ({
            symbol: item.symbol,
            name: item.name,
            price: item.price,
            change: item.change,
            changePercent: item.changePercent,
            type: "commodity",
          })),
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load financial data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 60 * 1000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (newValue) => {
    const map = {
      Currencies: 0,
      Cryptocurrencies: 1,
      Stocks: 2,
      Commodities: 3,
    };

    const tab = map[newValue.target.textContent];
    setTabValue(tab);
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "40px" }}
      >
        <CircularProgress size={60} />
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
    <div style={{ padding: 20 }}>
      <h2>Financial Dashboard</h2>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Currencies" />
          <Tab label="Cryptocurrencies" />
          <Tab label="Stocks" />
          <Tab label="Commodities" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <MoedasComponent data={data.currencies} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <CriptomoedasComponent data={data.cryptos} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <AcoesComponent data={data.stocks} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <CommoditiesComponent data={data.commodities} />
      </TabPanel>

      <ExportButton
        data={
          tabValue === 0
            ? data.currencies
            : tabValue === 1
            ? data.cryptos
            : tabValue === 2
            ? data.stocks
            : data.commodities
        }
        tabIndex={tabValue}
      />
    </div>
  );
}

export default App;
