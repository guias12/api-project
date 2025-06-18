const express = require("express");
const yahooFinance = require("yahoo-finance2").default;
const cors = require("cors");

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

app.get("/api/stocks", async (req, res) => {
  try {
    const symbols = [
      "PETR4.SA",
      "VALE3.SA",
      "ITUB4.SA",
      "BBDC4.SA",
      "BBAS3.SA",
      "B3SA3.SA",
      "ABEV3.SA",
      "WEGE3.SA",
      "RENT3.SA",
      "SUZB3.SA",
      "ELET3.SA",
      "GGBR4.SA",
      "RAIL3.SA",
      "HAPV3.SA",
      "LREN3.SA",
    ];
    const quotes = await yahooFinance.quote(symbols);

    const formattedData = quotes.map((stock) => ({
      symbol: stock.symbol.replace(".SA", ""),
      price: stock.regularMarketPrice,
      change: stock.regularMarketChange,
      changePercent: stock.regularMarketChangePercent,
      name: getStockCompanyName(stock.symbol.replace(".SA", "")),
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

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
      symbol: commodity.symbol,
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

function getStockCompanyName(symbol) {
  const map = {
    PETR4: "Petrobras",
    VALE3: "Vale",
    ITUB4: "Itaú Unibanco",
    BBDC4: "Bradesco",
    BBAS3: "Banco do Brasil",
    B3SA3: "B3 (Bolsa Brasileira)",
    ABEV3: "Ambev",
    WEGE3: "WEG",
    RENT3: "Localiza",
    SUZB3: "Suzano Papel e Celulose",
    ELET3: "Eletrobras",
    GGBR4: "Gerdau",
    RAIL3: "Rumo Logística",
    HAPV3: "Hapvida",
    LREN3: "Lojas Renner",
  };

  return map[symbol];
}

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
