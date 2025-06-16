import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { COLORS } from "../../../constants/constants";

const PieChartComponent = ({ data }) => (
  <div>
    <h3>Gráfico de Pizza</h3>
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="valor"
        nameKey="nome"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </div>
);

export default PieChartComponent;
