import React, { useEffect, useMemo, useState } from "react";

export interface FilterBarProps {
  onSearchId: (id: number) => void;
  onTextChange?: (text: string) => void;
  onEstadoChange?: (estado: string) => void;
  onMonthChange?: (ym: string) => void;
  disableEstado?: boolean;
  placeholderText?: string;
  placeholderId?: string;
  initialMonth?: string;
}

const debounce = (fn: (...args: any[]) => void, delay = 350) => {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

const FilterBar: React.FC<FilterBarProps> = ({
  onSearchId,
  onTextChange,
  onEstadoChange,
  onMonthChange,
  disableEstado,
  placeholderText = "Buscar...",
  placeholderId = "Ej: 123",
  initialMonth
}) => {
  const [idInput, setIdInput] = useState("");
  const [text, setText] = useState("");
  const [estado, setEstado] = useState("");
  const [month, setMonth] = useState(initialMonth || "");

  const debouncedText = useMemo(() => (onTextChange ? debounce(onTextChange) : undefined), [onTextChange]);

  useEffect(() => {
    if (debouncedText) debouncedText(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div className="row g-2 align-items-end mb-3">
      <div className="col-12 col-md-3">
        <label className="form-label small text-muted">Consultar por ID</label>
        <input
          className="form-control"
          placeholder={placeholderId}
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const parsed = Number(idInput);
              if (parsed) onSearchId(parsed);
            }
          }}
        />
      </div>
      {onTextChange && (
        <div className="col-12 col-md-3">
          <label className="form-label small text-muted">Buscar</label>
          <input
            className="form-control"
            placeholder={placeholderText}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      )}
      {onEstadoChange && !disableEstado && (
        <div className="col-12 col-md-2">
          <label className="form-label small text-muted">Estado</label>
          <select
            className="form-select"
            value={estado}
            onChange={(e) => {
              setEstado(e.target.value);
              onEstadoChange(e.target.value);
            }}
          >
            <option value="">Todos</option>
            <option value="PROGRAMADA">Programada</option>
            <option value="REALIZADA">Realizada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
      )}
      {onMonthChange && (
        <div className="col-12 col-md-2">
          <label className="form-label small text-muted">Mes (YYYY-MM)</label>
          <input
            type="month"
            className="form-control"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              onMonthChange(e.target.value);
            }}
          />
        </div>
      )}
      <div className="col-12 col-md-2 d-flex align-items-end">
        <button
          className="btn btn-primary w-100"
          onClick={() => {
            const parsed = Number(idInput);
            if (parsed) onSearchId(parsed);
          }}
        >
          Buscar ID
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
