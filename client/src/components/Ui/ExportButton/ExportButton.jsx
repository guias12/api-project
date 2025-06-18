import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@mui/material";

const getTabTitle = (tabIndex) => {
  switch (tabIndex) {
    case 0:
      return "Currencies";
    case 1:
      return "Cryptocurrencies";
    case 2:
      return "Stocks";
    case 3:
      return "Commodities";
    default:
      return "Financial Data";
  }
};

const formatData = (data, tabIndex) => {
  switch (tabIndex) {
    case 0: // Currencies
      return data.map((item) => [item.name, item.rate.toFixed(4), "USD"]);
    case 1: // Cryptocurrencies
      return data.map((item) => [
        item.name,
        `$${item?.price?.toFixed(2) ?? 0}`,
        `${item?.changePercent?.toFixed(2) ?? 0}%`,
      ]);
    case 2: // Stocks
      return data.map((item) => [
        item.name,
        `R$${item.price.toFixed(2)}`,
        `${item.changePercent.toFixed(2)}%`,
      ]);
    case 3: // Commodities
      return data.map((item) => [
        item.name,
        `$${item.price.toFixed(2)}`,
        `${item.changePercent.toFixed(2)}%`,
      ]);
    default:
      return data.map((item) => [item.name, item.value, item.type]);
  }
};

const ExportButton = ({ data, tabIndex }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    const title = getTabTitle(tabIndex);

    doc.text(`${title} Report`, 14, 10);

    const headers =
      tabIndex === 0
        ? ["Currency", "Exchange Rate", "Base Currency"]
        : ["Name", "Value", "Change %"];

    autoTable(doc, {
      head: [headers],
      body: formatData(data, tabIndex),
    });

    doc.save(`${title.toLowerCase().replace(" ", "-")}-report.pdf`);
  };

  return (
    <Button
      variant="contained"
      onClick={handleExport}
      style={{ marginTop: 20, padding: "10px 20px" }}
      disabled={!data || data.length === 0}
    >
      Export {getTabTitle(tabIndex)} to PDF
    </Button>
  );
};

export default ExportButton;
