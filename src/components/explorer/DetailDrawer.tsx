import React from "react";

export interface DetailDrawerProps {
  open: boolean;
  title?: string;
  data?: Record<string, any> | null;
  labelMap?: Record<string, string>;
  onClose: () => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ open, title, data, labelMap, onClose }) => {
  if (!open || !data) return null;

  const entries = Object.entries(data);

  return (
    <div className="offcanvas offcanvas-end show" style={{ visibility: "visible", width: "420px" }}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">{title || "Detalle"}</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body">
        {entries.length === 0 && <div className="text-muted">Sin datos</div>}
        <dl>
          {entries.map(([key, val]) => (
            <div key={key} className="mb-2">
              <dt className="small text-muted">{labelMap?.[key] || key}</dt>
              <dd className="mb-1">
                {val === null || val === undefined || val === ""
                  ? <span className="text-muted">N/D</span>
                  : val.toString()}
              </dd>
            </div>
          ))}
        </dl>
        <div className="d-flex gap-2">
          {"id" in data && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigator.clipboard.writeText(String((data as any).id))}
            >
              Copiar ID
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
