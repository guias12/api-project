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
import { TOP_STOCKS } from "../../../constants/constants";

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

const AcoesComponent = ({ data }) => {
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState(TOP_STOCKS);

  useEffect(() => {
    if (data) {
      const filtered = data.filter((stock) =>
        selectedStocks.includes(stock.symbol)
      );
      setFilteredStocks(filtered);
    }
  }, [selectedStocks, data]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "30px", color: "#1976d2" }}>
        Stocks Dashboard
      </h2>

      <Box sx={{ marginBottom: 4 }}>
        <Autocomplete
          multiple
          options={TOP_STOCKS}
          getOptionLabel={(option) =>
            `${
              data.find((s) => s.symbol === option)?.name ||
              option.replace(".SA", "")
            } (${option.replace(".SA", "")})`
          }
          value={selectedStocks}
          onChange={(_, newValue) => setSelectedStocks(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select Stocks" placeholder="Stocks" />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={`${
                  data.find((s) => s.symbol === option)?.name ||
                  option.replace(".SA", "")
                } (${option.replace(".SA", "")})`}
                {...getTagProps({ index })}
                key={option}
              />
            ))
          }
          style={{ width: "100%" }}
        />
      </Box>

      <ChartContainer title="Current Prices (BRL)">
        <BarChart
          width={800}
          height={400}
          data={filteredStocks}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="symbol"
            tickFormatter={(symbol) => symbol.replace(".SA", "")}
          />
          <YAxis
            label={{ value: "Price (BRL)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) => [`R$${value.toFixed(2)}`, "Price"]}
            labelFormatter={(symbol) =>
              data.find((s) => s.symbol === symbol)?.name ||
              symbol.replace(".SA", "")
            }
          />
          <Legend />
          <Bar dataKey="price" fill="#1976d2" name="Price" />
        </BarChart>
      </ChartContainer>

      <ChartContainer title="Stocks Data">
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Symbol
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Price (BRL)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Change (%)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStocks.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell component="th" scope="row">
                    {stock.name}
                  </TableCell>
                  <TableCell align="right">
                    {stock.symbol.replace(".SA", "")}
                  </TableCell>
                  <TableCell align="right">
                    {stock.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: stock.changePercent >= 0 ? "green" : "red" }}
                  >
                    {stock.changePercent >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
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

export default AcoesComponent;
