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
import { TOP_CURRENCIES } from "../../../constants/constants";

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

const MoedaComponent = ({ data }) => {
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState(
    Object.keys(TOP_CURRENCIES)
  );

  useEffect(() => {
    if (data) {
      const filtered = data.filter((item) =>
        selectedCurrencies.includes(item.code)
      );
      setFilteredCurrencies(filtered);
    }
  }, [selectedCurrencies, data]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "30px", color: "#1976d2" }}>
        Currency Dashboard
      </h2>

      <Box sx={{ marginBottom: 4 }}>
        <Autocomplete
          multiple
          options={Object.keys(TOP_CURRENCIES)}
          getOptionLabel={(option) => `${TOP_CURRENCIES[option]} (${option})`}
          value={selectedCurrencies}
          onChange={(_, newValue) => setSelectedCurrencies(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Currencies"
              placeholder="Currencies"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={`${TOP_CURRENCIES[option]} (${option})`}
                {...getTagProps({ index })}
                key={option}
              />
            ))
          }
          style={{ width: "100%" }}
        />
      </Box>

      <ChartContainer title="Exchange Rates (1 USD = X)">
        <BarChart
          width={800}
          height={400}
          data={filteredCurrencies}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="code" />
          <YAxis
            label={{
              value: "Exchange Rate",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            formatter={(value) => [value.toFixed(4), "Exchange Rate"]}
            labelFormatter={(code) => TOP_CURRENCIES[code] || code}
          />
          <Legend />
          <Bar dataKey="rate" fill="#1976d2" name="1 USD = " />
        </BarChart>
      </ChartContainer>

      <ChartContainer title="Currency Data">
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Currency</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Code
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  1 USD Equals
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCurrencies.map((currency) => (
                <TableRow key={currency.code}>
                  <TableCell component="th" scope="row">
                    {currency.name}
                  </TableCell>
                  <TableCell align="right">{currency.code}</TableCell>
                  <TableCell align="right">
                    {currency.rate.toFixed(4)}
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

export default MoedaComponent;
