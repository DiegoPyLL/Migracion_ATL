import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  highlightedId?: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onViewDetail: (row: T) => void;
}

const DataTable = <T extends { id?: number }>({
  columns,
  data,
  highlightedId,
  page,
  pageSize = 10,
  onPageChange,
  onViewDetail
}: DataTableProps<T>) => {
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const start = (page - 1) * pageSize;
  const current = data.slice(start, start + pageSize);

  return (
    <div className="table-responsive" style={{ overflowX: "auto" }}>
      <table className="table table-sm align-middle">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.header}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {current.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="text-center text-muted">
                Sin resultados
              </td>
            </tr>
          )}
          {current.map((row, idx) => {
            const id = (row as any).id ?? idx;
            const isHighlighted = highlightedId !== undefined && highlightedId === id;
            return (
              <tr key={id} className={isHighlighted ? "table-warning" : ""}>
                {columns.map((c) => (
                  <td key={c.key}>{c.render ? c.render(row) : (row as any)[c.key]}</td>
                ))}
                <td>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => onViewDetail(row)}>
                    Ver detalle
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <span className="text-muted small">
          Página {page} de {totalPages}
        </span>
        <div className="btn-group">
          <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Anterior
          </button>
          <button className="btn btn-outline-secondary btn-sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
