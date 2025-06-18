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
import { TOP_COMMODITIES } from "../../../constants/constants";

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

const CommoditiesComponent = ({ data }) => {
  const [filteredCommodities, setFilteredCommodities] = useState([]);
  const [selectedCommodities, setSelectedCommodities] =
    useState(TOP_COMMODITIES);

  useEffect(() => {
    if (data) {
      const filtered = data.filter((item) =>
        selectedCommodities.includes(item.symbol)
      );
      setFilteredCommodities(filtered);
    }
  }, [selectedCommodities, data]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "30px", color: "#1976d2" }}>
        Commodities Dashboard
      </h2>

      <Box sx={{ marginBottom: 4 }}>
        <Autocomplete
          multiple
          options={TOP_COMMODITIES}
          getOptionLabel={(option) =>
            `${
              data.find((c) => c.symbol === option)?.name || option
            } (${option})`
          }
          value={selectedCommodities}
          onChange={(_, newValue) => setSelectedCommodities(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Commodities"
              placeholder="Commodities"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={`${
                  data.find((c) => c.symbol === option)?.name || option
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
          data={filteredCommodities}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="symbol"
            tickFormatter={(symbol) =>
              data.find((c) => c.symbol === symbol)?.name || symbol
            }
          />
          <YAxis
            label={{ value: "Price (USD)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
            labelFormatter={(symbol) =>
              data.find((c) => c.symbol === symbol)?.name || symbol
            }
          />
          <Legend />
          <Bar dataKey="price" fill="#1976d2" name="Price" />
        </BarChart>
      </ChartContainer>

      <ChartContainer title="Commodities Data">
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Commodity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Symbol
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Price (USD)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Change (%)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCommodities.map((item) => (
                <TableRow key={item.symbol}>
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell align="right">{item.symbol}</TableCell>
                  <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: item.changePercent >= 0 ? "green" : "red" }}
                  >
                    {item.changePercent >= 0 ? "+" : ""}
                    {item.changePercent.toFixed(2)}%
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
