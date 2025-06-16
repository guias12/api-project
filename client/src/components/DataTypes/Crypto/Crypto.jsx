import React from "react";
import BarChartComponent from "../../Charts/BarChart/BarChart";
import LineChartComponent from "../../Charts/LineChart/LineChart";
import DataTable from "../../Ui/DataTable/DataTable";

const ChartContainer = ({ children, title }) => (
  <div style={{ marginBottom: 40 }}>
    <h3>{title}</h3>
    {children}
  </div>
);

const CriptomoedasComponent = ({ data }) => {
  const filteredData = data.filter((item) => item.tipo === "cripto");
  return (
    <div>
      <ChartContainer title="Gráfico de Barras - Criptomoedas">
        <BarChartComponent data={filteredData} />
      </ChartContainer>
      <ChartContainer title="Gráfico de Linha - Criptomoedas">
        <LineChartComponent data={filteredData} />
      </ChartContainer>
      <ChartContainer title="Tabela - Criptomoedas">
        <DataTable data={filteredData} />
      </ChartContainer>
    </div>
  );
};

export default CriptomoedasComponent;
