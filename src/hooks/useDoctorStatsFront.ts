import { useEffect, useState } from 'react';
import axios from 'axios';

export type DoctorStat = {
  month: string; // YYYY-MM
  realizadas: number;
  canceladas: number;
  programadas: number;
  total_revenue: number;
  bonus_10: number;
};

const CITAS_API_URL = 'http://localhost:8080/api/v1/citas';
const DOCTORES_API_URL = 'http://localhost:8082/api/v1/doctores';
const HISTORIAL_API_URL =
  import.meta.env.VITE_HISTORIAL_API_URL ||
  'http://localhost:8081/api/v1/historial';

const normalizeEstado = (estado: any): 'PROGRAMADA' | 'REALIZADA' | 'CANCELADA' => {
  const e = (estado || '').toString().toUpperCase();
  if (e === 'REALIZADA') return 'REALIZADA';
  if (e === 'CANCELADA' || e === 'CANCELADO') return 'CANCELADA';
  if (e === 'CONFIRMADO' || e === 'PROGRAMADA') return 'PROGRAMADA';
  return 'PROGRAMADA';
};

const monthKey = (fecha: string): string => {
  if (!fecha) return '';
  if (fecha.includes('T')) return fecha.split('T')[0].slice(0, 7);
  return fecha.slice(0, 7);
};

const fechaDesde = (months: number): Date => {
  const base = new Date();
  base.setDate(1);
  base.setHours(0, 0, 0, 0);
  base.setMonth(base.getMonth() - (months - 1));
  return base;
};

const parseFecha = (f: string): Date | null => {
  if (!f) return null;
  const cleaned = f.includes('T') ? f.split('T')[0] : f;
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? null : d;
};

export const useDoctorStatsFront = (doctorId: number | null, months = 6, tarifaInicial?: number) => {
  const [stats, setStats] = useState<DoctorStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId) return;
    cargarStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, months, tarifaInicial]);

  const cargarStats = async () => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);

    const desde = fechaDesde(months);

    // 1) Traer tarifa
    let tarifa = tarifaInicial ?? 0;
    try {
      if (tarifa === 0) {
        const respDoc = await axios.get(`${DOCTORES_API_URL}/${doctorId}`);
        const doc = respDoc.data || {};
        tarifa = Number(doc.tarifaConsulta ?? doc.tarifa_consulta ?? 0);
      }
    } catch (e) {
      // best effort, se mantiene tarifa 0 si falla
    }

    // 2) Traer citas e historial (best effort)
    let citas: any[] = [];
    try {
      const respCitas = await axios.get(CITAS_API_URL);
      citas = (respCitas.data || []).filter((c: any) => c.idDoctor === doctorId);
    } catch (e) {
      setError('No se pudieron cargar las citas');
    }

    let historial: any[] = [];
    try {
      const respHist = await axios.get(`${HISTORIAL_API_URL}/doctor/${doctorId}`);
      historial = respHist.data || [];
    } catch (e) {
      // si no existe endpoint, seguimos solo con citas
    }

    const acum: Record<string, DoctorStat> = {};

    const addRegistro = (fecha: string, estadoRaw: any, pagoRaw: any) => {
      const fechaObj = parseFecha(fecha);
      if (!fechaObj || fechaObj < desde) return;
      const mes = monthKey(fecha);
      if (!mes) return;

      const estado = normalizeEstado(estadoRaw);
      const pago = pagoRaw != null ? Number(pagoRaw) : tarifa || 0;

      if (!acum[mes]) {
        acum[mes] = { month: mes, realizadas: 0, canceladas: 0, programadas: 0, total_revenue: 0, bonus_10: 0 };
      }

      if (estado === 'REALIZADA') {
        acum[mes].realizadas += 1;
        acum[mes].total_revenue += isNaN(pago) ? 0 : pago;
      } else if (estado === 'CANCELADA') {
        acum[mes].canceladas += 1;
      } else {
        acum[mes].programadas += 1;
      }
    };

    citas.forEach(c => addRegistro(c.fechaCita || c.fecha_cita, c.estado, c.pago));
    historial.forEach(h => addRegistro(h.fechaHistorial || h.fecha_historial || h.fecha || h.fechaCita, h.estado, h.pago));

    const salida = Object.values(acum)
      .map(s => ({ ...s, bonus_10: s.total_revenue * 0.10 }))
      .sort((a, b) => b.month.localeCompare(a.month));

    setStats(salida);
    setLoading(false);
  };

  return { stats, loading, error, refetch: cargarStats };
};
