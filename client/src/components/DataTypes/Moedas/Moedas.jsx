import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
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
  TextField,
  MenuItem
} from '@mui/material';
import { COLORS, TOP_CURRENCIES } from '../../../constants/constants';

const ChartContainer = ({ children, title }) => (
  <div style={{ margin: '40px 0', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
    <h3 style={{ marginBottom: '20px', color: '#333' }}>{title}</h3>
    {children}
  </div>
);

const MoedaComponent = ({ exchangeRates }) => {
  const [filteredMoedas, setFilteredMoedas] = useState([]);
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    if (exchangeRates) {
      // Filter only the top currencies we want to display
      const topCurrenciesData = Object.entries(exchangeRates)
        .filter(([code]) => TOP_CURRENCIES[code])
        .map(([code, rate]) => ({
          code,
          name: TOP_CURRENCIES[code],
          rate,
          change: 0, // Note: exchangerate-api.com v4 doesn't provide change data
          changePercent: 0
        }));

      setFilteredMoedas(topCurrenciesData);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  }, [exchangeRates]);

  useEffect(() => {
    if (exchangeRates) {
      if (currencyFilter === 'all') {
        const allTopCurrencies = Object.entries(exchangeRates)
          .filter(([code]) => TOP_CURRENCIES[code])
          .map(([code, rate]) => ({
            code,
            name: TOP_CURRENCIES[code],
            rate,
            change: 0,
            changePercent: 0
          }));
        setFilteredMoedas(allTopCurrencies);
      } else {
        const filtered = {
          code: currencyFilter,
          name: TOP_CURRENCIES[currencyFilter],
          rate: exchangeRates[currencyFilter],
          change: 0,
          changePercent: 0
        };
        setFilteredMoedas([filtered]);
      }
    }
  }, [currencyFilter, exchangeRates]);

  if (!exchangeRates) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '30px', color: '#1976d2' }}>💱 Currency Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Last updated: {lastUpdated}</p>

      <div style={{ marginBottom: '30px' }}>
        <TextField
          select
          label="Filter Currency"
          value={currencyFilter}
          onChange={(e) => setCurrencyFilter(e.target.value)}
          style={{ width: '300px' }}
        >
          <MenuItem value="all">All Currencies</MenuItem>
          {Object.entries(TOP_CURRENCIES).map(([code, name]) => (
            <MenuItem key={code} value={code}>
              {name} ({code})
            </MenuItem>
          ))}
        </TextField>
      </div>

      <ChartContainer title="📍 Exchange Rates (1 USD = X)">
        <BarChart
          width={800}
          height={400}
          data={filteredMoedas}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="code" />
          <YAxis />
          <Tooltip
            formatter={(value) => [value.toFixed(4), 'Exchange Rate']}
            labelFormatter={(code) => TOP_CURRENCIES[code] || code}
          />
          <Legend />
          <Bar dataKey="rate" fill="#1976d2" name="1 USD = " />
        </BarChart>
      </ChartContainer>

      <ChartContainer title="📋 Currency Data">
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Currency</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">1 USD Equals</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMoedas.map((moeda) => (
                <TableRow key={moeda.code}>
                  <TableCell component="th" scope="row">
                    {moeda.name}
                  </TableCell>
                  <TableCell align="right">{moeda.code}</TableCell>
                  <TableCell align="right">
                    {moeda.rate.toFixed(4)}
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