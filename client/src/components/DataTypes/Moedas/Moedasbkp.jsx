import React from "react";
import BarChartComponent from "../../Charts/BarChart/BarChart";
import PieChartComponent from "../../Charts/PieChart/PieChart";
import DataTable from "../../Ui/DataTable/DataTable";

const ChartContainer = ({ children, title }) => (
  <div style={{ marginBottom: 40 }}>
    <h3>{title}</h3>
    {children}
  </div>
);

const MoedasComponent = ({ data }) => {
  const filteredData = data.filter((item) => item.tipo === "moeda");
  return (
    <div>
      <ChartContainer title="Gráfico de Barras - Moedas">
        <BarChartComponent data={filteredData} />
      </ChartContainer>
      <ChartContainer title="Gráfico de Pizza - Moedas">
        <PieChartComponent data={filteredData} />
      </ChartContainer>
      <ChartContainer title="Tabela - Moedas">
        <DataTable data={filteredData} />
      </ChartContainer>
    </div>
  );
};

export default MoedasComponent;
