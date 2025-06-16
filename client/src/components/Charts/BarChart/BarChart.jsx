import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const BarChartComponent = ({ data }) => (
  <div>
    <h3>Gráfico de Barras</h3>
    <BarChart width={730} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="nome" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="valor" fill="#8884d8" />
    </BarChart>
  </div>
);

export default BarChartComponent;
