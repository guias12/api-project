const express = require("express");
const yahooFinance = require("yahoo-finance2").default;
const cors = require("cors");

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Stock data endpoint
app.get("/api/stocks", async (req, res) => {
  try {
    const symbols = [
      'PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'BBDC4.SA',
      'BBAS3.SA', 'B3SA3.SA', 'ABEV3.SA', 'WEGE3.SA',
      'RENT3.SA', 'SUZB3.SA', 'ELET3.SA', 'GGBR4.SA',
      'RAIL3.SA', 'HAPV3.SA', 'LREN3.SA'
    ];
    const quotes = await yahooFinance.quote(symbols);

    const formattedData = quotes.map((stock) => ({
      symbol: stock.symbol.replace(".SA", ""),
      price: stock.regularMarketPrice,
      change: stock.regularMarketChange,
      changePercent: stock.regularMarketChangePercent,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// Commodity data endpoint
app.get("/api/commodities", async (req, res) => {
  try {
    const commoditySymbols = [
      "GC=F",
      "SI=F",
      "CL=F",
      "NG=F",
      "HG=F",
      "ZC=F",
      "ZS=F",
      "KE=F",
      "CC=F",
      "KC=F",
    ];
    const commodities = await yahooFinance.quote(commoditySymbols);

    const formattedData = commodities.map((commodity) => ({
      name: getCommodityName(commodity.symbol),
      price: commodity.regularMarketPrice,
      change: commodity.regularMarketChange,
      changePercent: commodity.regularMarketChangePercent,
      currency: "USD",
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch commodities data" });
  }
});

function getCommodityName(symbol) {
  const map = {
    "GC=F": "Ouro",
    "SI=F": "Prata",
    "CL=F": "Petróleo Bruto",
    "NG=F": "Gás Natural",
    "HG=F": "Cobre",
    "ZC=F": "Milho",
    "ZS=F": "Soja",
    "KE=F": "Trigo",
    "CC=F": "Cacau",
    "KC=F": "Café",
  };
  return map[symbol] || symbol.replace("=F", "");
}

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
