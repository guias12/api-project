import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { COLORS } from "../../../constants/constants";

const ChartContainer = ({ children, title }) => (
  <div
    style={{
      margin: "40px 0",
      padding: "20px",
      border: "1px solid #eee",
      borderRadius: "8px",
    }}
  >
    <h3 style={{ marginBottom: "20px", color: "#333" }}>{title}</h3>
    {children}
  </div>
);

const CommoditiesComponent = () => {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommoditiesData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3001/api/commodities");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCommodities(data);
      } catch (err) {
        console.error("Error fetching commodities:", err);
        setError("Failed to load commodities data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommoditiesData();
    const interval = setInterval(fetchCommoditiesData, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

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

  if (!commodities || commodities.length === 0) {
    return (
      <Alert severity="warning" style={{ margin: "20px" }}>
        No commodities data available.
      </Alert>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "30px", color: "#1976d2" }}>
        📈 Commodities Dashboard
      </h2>

      <ChartContainer title="Current Prices (Bar Chart)">
        <BarChart
          width={800}
          height={400}
          data={commodities}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, "Price"]} />
          <Legend />
          <Bar dataKey="price" fill="#1976d2" name="Price (USD)" />
        </BarChart>
      </ChartContainer>

      <ChartContainer title="Price Changes (Line Chart)">
        <LineChart
          width={800}
          height={400}
          data={commodities}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}%`, "Change"]} />
          <Legend />
          <Line
            type="monotone"
            dataKey="changePercent"
            stroke="#ff7300"
            name="Change (%)"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ChartContainer>

      <ChartContainer title="Market Distribution (Pie Chart)">
        <PieChart width={800} height={400}>
          <Pie
            data={commodities}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="price"
            nameKey="name"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {commodities.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value}`, "Price"]} />
          <Legend />
        </PieChart>
      </ChartContainer>

      <ChartContainer title="Detailed Commodities Data">
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Commodity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Price (USD)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Change
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Change %
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commodities.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">
                    $
                    {row.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: row.change >= 0 ? "green" : "red" }}
                  >
                    {row.change >= 0 ? "+" : ""}
                    {row.change.toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: row.changePercent >= 0 ? "green" : "red" }}
                  >
                    {row.changePercent >= 0 ? "+" : ""}
                    {row.changePercent.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ChartContainer>
    </div>
  );
};

export default CommoditiesComponent;
