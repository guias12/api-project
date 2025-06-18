import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  Chip,
  Box,
  TextField,
} from "@mui/material";
import { TOP_CRYPTOS } from "../../../constants/constants";

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

const CriptomoedasComponent = ({ data }) => {
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState(TOP_CRYPTOS);

  useEffect(() => {
    if (data) {
      const filtered = data.filter((crypto) =>
        selectedCryptos.includes(crypto.id)
      );
      setFilteredCryptos(filtered);
    }
  }, [selectedCryptos, data]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "30px", color: "#1976d2" }}>
        Cryptocurrency Dashboard
      </h2>

      <Box sx={{ marginBottom: 4 }}>
        <Autocomplete
          multiple
          options={TOP_CRYPTOS}
          getOptionLabel={(option) =>
            `${data.find((c) => c.id === option)?.name || option} (${option})`
          }
          value={selectedCryptos}
          onChange={(_, newValue) => setSelectedCryptos(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Cryptocurrencies"
              placeholder="Cryptocurrencies"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={`${
                  data.find((c) => c.id === option)?.name || option
                } (${option})`}
                {...getTagProps({ index })}
                key={option}
              />
            ))
          }
          style={{ width: "100%" }}
        />
      </Box>

      <ChartContainer title="Current Prices (USD)">
        <BarChart
          width={800}
          height={400}
          data={filteredCryptos}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="symbol" />
          <YAxis
            label={{ value: "Price (USD)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
            labelFormatter={(symbol) =>
              data.find((c) => c.symbol === symbol)?.name || symbol
            }
          />
          <Legend />
          <Bar dataKey="price" fill="#1976d2" name="Price" />
        </BarChart>
      </ChartContainer>

      <ChartContainer title="Cryptocurrency Data">
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Symbol
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Price (USD)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  24h Change (%)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCryptos.map((crypto) => (
                <TableRow key={crypto.id}>
                  <TableCell component="th" scope="row">
                    {crypto.name}
                  </TableCell>
                  <TableCell align="right">{crypto.symbol}</TableCell>
                  <TableCell align="right">
                    ${crypto.price.toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: crypto.changePercent >= 0 ? "green" : "red" }}
                  >
                    {crypto.changePercent >= 0 ? "+" : ""}
                    {crypto.changePercent.toFixed(2)}%
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

export default CriptomoedasComponent;
