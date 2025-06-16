import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LineChartComponent = ({ data }) => (
  <div>
    <h3>Gráfico de Linha</h3>
    <LineChart width={730} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="nome" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="valor" stroke="#82ca9d" />
    </LineChart>
  </div>
);

export default LineChartComponent;
