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

const TodosComponent = ({ data }) => (
  <div>
    <ChartContainer title="Gráfico de Barras - Todos os Dados">
      <BarChartComponent data={data} />
    </ChartContainer>
    <ChartContainer title="Gráfico de Pizza - Todos os Dados">
      <PieChartComponent data={data} />
    </ChartContainer>
    <ChartContainer title="Tabela - Todos os Dados">
      <DataTable data={data} />
    </ChartContainer>
  </div>
);

export default TodosComponent;
