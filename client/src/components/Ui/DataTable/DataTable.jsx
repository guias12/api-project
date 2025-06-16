const DataTable = ({ data }) => (
  <div>
    <h3>📋 Tabela de Dados</h3>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#f2f2f2" }}>
          <th style={{ padding: "8px", border: "1px solid #ddd" }}>Nome</th>
          <th style={{ padding: "8px", border: "1px solid #ddd" }}>Valor</th>
          <th style={{ padding: "8px", border: "1px solid #ddd" }}>Tipo</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} style={{ border: "1px solid #ddd" }}>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {item.nome}
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {item.valor}
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {item.tipo}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
