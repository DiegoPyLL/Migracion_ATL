import React, { useMemo, useState } from "react";
import FilterBar from "../../components/explorer/FilterBar";
import DataTable, { Column } from "../../components/explorer/DataTable";
import DetailDrawer from "../../components/explorer/DetailDrawer";
import { useListAndLookup } from "../../hooks/useListAndLookup";
import { usuariosApi, UsuarioDto } from "../../services/usuariosApi";
import { doctoresApi, DoctorDto } from "../../services/doctoresApi";
import { citasApi, CitaDto } from "../../services/citasApi";
import { historialApi, HistorialDto } from "../../services/historialApi";
import { segurosApi, SeguroDto, ContratoSeguroDto } from "../../services/segurosApi";

type TabKey = "usuarios" | "doctores" | "citas" | "historial" | "seguros";

const monthToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const ExplorerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("usuarios");
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  // Usuarios
  const usuariosHook = useListAndLookup<UsuarioDto>({
    fetchList: usuariosApi.getAll,
    fetchById: usuariosApi.getById
  });
  const usuariosFiltered = useMemo(() => {
    const term = (usuariosHook.filters?.text || "").toLowerCase();
    return usuariosHook.data.filter((u) => {
      const full = `${u.nombre || ""} ${u.apellido || ""}`.toLowerCase();
      return !term || full.includes(term) || (u.correo || "").toLowerCase().includes(term);
    });
  }, [usuariosHook.data, usuariosHook.filters]);

  // Doctores
  const doctoresHook = useListAndLookup<DoctorDto>({
    fetchList: doctoresApi.getAll,
    fetchById: doctoresApi.getById
  });
  const doctoresFiltered = useMemo(() => {
    const term = (doctoresHook.filters?.text || "").toLowerCase();
    return doctoresHook.data.filter((d) => {
      const full = (d.nombreCompleto || "").toLowerCase();
      return !term || full.includes(term) || (d.especialidad || "").toLowerCase().includes(term);
    });
  }, [doctoresHook.data, doctoresHook.filters]);

  // Citas
  const citasHook = useListAndLookup<CitaDto>({
    fetchList: citasApi.getAll,
    fetchById: citasApi.getById,
    normalize: (c) => ({
      ...c,
      estado: (c?.estado || "").toString().toUpperCase(),
      fechaCita: c?.fechaCita?.includes("T") ? c?.fechaCita.split("T")[0] : c?.fechaCita
    })
  });
  const citasFiltered = useMemo(() => {
    const term = (citasHook.filters?.text || "").toLowerCase();
    const estado = citasHook.filters?.estado || "";
    const month = citasHook.filters?.month || "";
    return citasHook.data.filter((c) => {
      const matchText =
        !term ||
        String(c.id || "").includes(term) ||
        String(c.idUsuario || "").includes(term) ||
        String(c.idDoctor || "").includes(term);
      const matchEstado = !estado || (c.estado || "").toUpperCase() === estado.toUpperCase();
      const matchMonth = !month || (c.fechaCita || "").startsWith(month);
      return matchText && matchEstado && matchMonth;
    });
  }, [citasHook.data, citasHook.filters]);

  // Historial (solo por usuario/doctor)
  const historialHook = useListAndLookup<HistorialDto>({
    fetchList: undefined,
    fetchById: async (id: number) => {
      const list = await historialApi.getByUsuario(id);
      return list.map((h) => ({ ...h, id: h.id ?? h.idHistorial }));
    },
    normalize: (h) => ({
      ...h,
      fecha: h?.fecha?.includes("T") ? h.fecha.split("T")[0] : h?.fecha
    })
  });
  const historialFiltered = useMemo(() => {
    const month = historialHook.filters?.month || "";
    return historialHook.data.filter((h) => (!month ? true : (h.fecha || "").startsWith(month)));
  }, [historialHook.data, historialHook.filters]);

  // Seguros (dos datasets: seguros y contratos por usuario)
  const segurosHook = useListAndLookup<SeguroDto>({
    fetchList: segurosApi.getAll,
    fetchById: async (id: number) => {
      const list = await segurosApi.getAll();
      const found = list.find((s) => (s.id ?? s.id_seguro) === id);
      if (!found) throw new Error("No encontrado");
      return found;
    },
    normalize: (s) => ({ ...s, id: s.id ?? s.id_seguro })
  });
  const contratosHook = useListAndLookup<ContratoSeguroDto>({
    fetchList: undefined,
    fetchById: async (usuarioId: number) => {
      const list = await segurosApi.getContratosByUsuario(usuarioId);
      return list.map((c) => ({ ...c, id: c.id ?? c.id_contrato }));
    },
    normalize: (c) => ({ ...c, id: c.id ?? c.id_contrato })
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "usuarios": {
        const columns: Column<UsuarioDto>[] = [
          { key: "id", header: "ID" },
          { key: "nombre", header: "Nombre" },
          { key: "apellido", header: "Apellido" },
          { key: "correo", header: "Correo" },
          { key: "telefono", header: "Teléfono" },
          { key: "rol", header: "Rol" }
        ];
        return (
          <>
            <FilterBar
              onSearchId={(id) => usuariosHook.searchById(id)}
              onTextChange={(text) => usuariosHook.setFilters((prev: any) => ({ ...prev, text }))}
              placeholderText="Nombre, apellido o correo"
            />
            <DataTable
              columns={columns}
              data={usuariosFiltered}
              highlightedId={usuariosHook.highlightedId}
              page={usuariosHook.page}
              onPageChange={usuariosHook.setPage}
              onViewDetail={(row) => setSelectedDetail(row)}
            />
          </>
        );
      }
      case "doctores": {
        const columns: Column<DoctorDto>[] = [
          { key: "id", header: "ID Doctor" },
          { key: "idUsuario", header: "ID Usuario" },
          { key: "nombreCompleto", header: "Nombre" },
          { key: "especialidad", header: "Especialidad" },
          { key: "tarifaConsulta", header: "Tarifa" }
        ];
        return (
          <>
            <FilterBar
              onSearchId={(id) => doctoresHook.searchById(id)}
              onTextChange={(text) => doctoresHook.setFilters((prev: any) => ({ ...prev, text }))}
              placeholderText="Nombre o especialidad"
            />
            <DataTable
              columns={columns}
              data={doctoresFiltered}
              highlightedId={doctoresHook.highlightedId}
              page={doctoresHook.page}
              onPageChange={doctoresHook.setPage}
              onViewDetail={(row) => setSelectedDetail(row)}
            />
          </>
        );
      }
      case "citas": {
        const columns: Column<CitaDto>[] = [
          { key: "id", header: "ID" },
          { key: "fechaCita", header: "Fecha" },
          { key: "horaInicio", header: "Inicio" },
          { key: "horaFin", header: "Fin" },
          { key: "estado", header: "Estado" },
          { key: "idUsuario", header: "ID Usuario" },
          { key: "idDoctor", header: "ID Doctor" },
          {
            key: "disponible",
            header: "Disponible",
            render: (r) => (r.disponible ? "Sí" : "No")
          }
        ];
        return (
          <>
            <FilterBar
              onSearchId={(id) => citasHook.searchById(id)}
              onTextChange={(text) => citasHook.setFilters((prev: any) => ({ ...prev, text }))}
              onEstadoChange={(estado) => citasHook.setFilters((prev: any) => ({ ...prev, estado }))}
              onMonthChange={(month) => citasHook.setFilters((prev: any) => ({ ...prev, month }))}
              placeholderText="ID usuario o doctor"
            />
            <DataTable
              columns={columns}
              data={citasFiltered}
              highlightedId={citasHook.highlightedId}
              page={citasHook.page}
              onPageChange={citasHook.setPage}
              onViewDetail={(row) => setSelectedDetail(row)}
            />
          </>
        );
      }
      case "historial": {
        const columns: Column<HistorialDto>[] = [
          { key: "id", header: "ID Historial" },
          { key: "fecha", header: "Fecha" },
          { key: "hora", header: "Hora" },
          { key: "idUsuario", header: "ID Usuario" },
          { key: "idDoctor", header: "ID Doctor" },
          { key: "diagnostico", header: "Diagnóstico" },
          { key: "observaciones", header: "Observaciones" }
        ];
        return (
          <>
            <FilterBar
              onSearchId={(id) => historialHook.searchById(id)}
              onMonthChange={(month) => historialHook.setFilters((prev: any) => ({ ...prev, month }))}
              placeholderId="ID Usuario"
            />
            <div className="alert alert-info py-2">Consulta por ID de usuario para ver su historial.</div>
            <DataTable
              columns={columns}
              data={historialFiltered}
              highlightedId={historialHook.highlightedId}
              page={historialHook.page}
              onPageChange={historialHook.setPage}
              onViewDetail={(row) => setSelectedDetail(row)}
            />
          </>
        );
      }
      case "seguros": {
        const seguroColumns: Column<SeguroDto>[] = [
          { key: "id", header: "ID" },
          { key: "nombre_seguro", header: "Nombre" },
          { key: "descripcion", header: "Descripción" },
          { key: "valor", header: "Valor" }
        ];
        const contratoColumns: Column<ContratoSeguroDto>[] = [
          { key: "id_contrato", header: "ID Contrato" },
          { key: "id_usuario", header: "ID Usuario" },
          { key: "estado", header: "Estado" },
          { key: "fecha_contratacion", header: "Fecha contratación" },
          { key: "metodo_pago", header: "Método pago" }
        ];
        return (
          <>
            <div className="mb-3">
              <h6 className="mb-1">Seguros</h6>
              <FilterBar
                onSearchId={(id) => segurosHook.searchById(id)}
                onTextChange={(text) => segurosHook.setFilters((prev: any) => ({ ...prev, text }))}
                disableEstado
                placeholderText="Nombre seguro"
              />
              <DataTable
                columns={seguroColumns}
                data={segurosHook.data.filter((s) => {
                  const term = (segurosHook.filters?.text || "").toLowerCase();
                  return !term || (s.nombre_seguro || "").toLowerCase().includes(term);
                })}
                highlightedId={segurosHook.highlightedId}
                page={segurosHook.page}
                onPageChange={segurosHook.setPage}
                onViewDetail={(row) => setSelectedDetail(row)}
              />
            </div>
            <div className="mb-2 mt-4">
              <h6 className="mb-1">Contratos por usuario</h6>
              <FilterBar
                onSearchId={(id) => contratosHook.searchById(id)}
                placeholderId="ID Usuario"
                disableEstado
              />
              <DataTable
                columns={contratoColumns}
                data={contratosHook.data}
                highlightedId={contratosHook.highlightedId}
                page={contratosHook.page}
                onPageChange={contratosHook.setPage}
                onViewDetail={(row) => setSelectedDetail(row)}
              />
            </div>
          </>
        );
      }
      default:
        return null;
    }
  };

  const labelMap: Record<string, string> = {
    id: "ID",
    idUsuario: "ID Usuario",
    idDoctor: "ID Doctor",
    fechaCita: "Fecha",
    fecha: "Fecha",
    horaInicio: "Hora inicio",
    horaFin: "Hora fin",
    estado: "Estado",
    correo: "Correo",
    telefono: "Teléfono",
    tarifaConsulta: "Tarifa consulta",
    fecha_contratacion: "Fecha contratación",
    metodo_pago: "Método de pago"
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold text-danger mb-3">Explorador de Datos (Admin)</h2>
      <ul className="nav nav-tabs mb-3">
        {["usuarios", "doctores", "citas", "historial", "seguros"].map((t) => (
          <li className="nav-item" key={t}>
            <button
              className={`nav-link ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t as TabKey)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      <div className="card shadow-sm border-0 p-3">
        {renderTabContent()}
      </div>

      <DetailDrawer
        open={!!selectedDetail}
        title="Detalle"
        data={selectedDetail}
        labelMap={labelMap}
        onClose={() => setSelectedDetail(null)}
      />
    </div>
  );
};

export default ExplorerPage;
