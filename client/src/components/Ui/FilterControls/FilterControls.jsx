import { TYPES } from "../../../constants/constants";

const FilterControls = ({
  filtroTipo,
  setFiltroTipo,
  filtroTexto,
  setFiltroTexto,
}) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ marginBottom: 10 }}>
      <label>Filtrar por tipo: </label>
      <select
        onChange={(e) => setFiltroTipo(e.target.value)}
        value={filtroTipo}
      >
        {TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label>Filtrar por nome: </label>
      <input
        type="text"
        value={filtroTexto}
        onChange={(e) => setFiltroTexto(e.target.value)}
        placeholder="Digite o nome ex: ouro, USD, BTC..."
        style={{ padding: 8, width: "100%" }}
      />
    </div>
  </div>
);

export default FilterControls;
