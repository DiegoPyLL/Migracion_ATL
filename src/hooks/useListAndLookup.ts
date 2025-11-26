import { useEffect, useMemo, useState } from "react";

type FetchList<T> = () => Promise<T[]>;
type FetchById<T> = (id: number) => Promise<T>;

export interface UseListAndLookupOptions<T> {
  fetchList?: FetchList<T>;
  fetchById: (id: number) => Promise<T | T[]>;
  normalize?: (x: any) => T;
  initialData?: T[];
}

export interface UseListAndLookupState<T> {
  data: T[];
  loading: boolean;
  error: string;
  highlightedId?: number;
  searchById: (id: number) => Promise<void>;
  setFilters: (fn: (prev: any) => any) => void;
  filters: any;
  page: number;
  setPage: (p: number) => void;
  refreshList: () => Promise<void>;
}

export function useListAndLookup<T>(options: UseListAndLookupOptions<T>): UseListAndLookupState<T> {
  const { fetchList, fetchById, normalize, initialData } = options;
  const [data, setData] = useState<T[]>(initialData || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [highlightedId, setHighlightedId] = useState<number | undefined>(undefined);
  const [filters, setFilters] = useState<any>({});
  const [page, setPage] = useState(1);

  const applyNormalize = (items: any[]): T[] => {
    return normalize ? items.map(normalize) : (items as T[]);
  };

  const refreshList = async () => {
    if (!fetchList) return;
    setLoading(true);
    setError("");
    try {
      const list = await fetchList();
      setData(applyNormalize(list));
    } catch (err: any) {
      const status = err?.response?.status;
      const msg =
        status === 204
          ? ""
          : err?.code === "ERR_NETWORK"
            ? "Error de red / CORS"
            : err?.response?.data?.message || err?.message || "Error al cargar datos";
      setError(msg);
      if (status === 204) setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchById = async (id: number) => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const item = await fetchById(id);
      const list = Array.isArray(item) ? item : [item];
      const normalizedList = normalize ? list.map(normalize) : (list as T[]);
      setData((prev) => {
        const updated = [...prev];
        normalizedList.forEach((n: any) => {
          const idx = updated.findIndex((x: any) => (x as any).id === n.id);
          if (idx >= 0) updated[idx] = n;
          else updated.unshift(n);
        });
        return updated;
      });
      setHighlightedId((normalizedList[0] as any).id);
      setPage(1);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg =
        status === 404
          ? "No encontrado"
          : err?.code === "ERR_NETWORK"
            ? "Error de red / CORS"
            : err?.response?.data?.message || err?.message || "Error al buscar ID";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    highlightedId,
    searchById,
    setFilters,
    filters,
    page,
    setPage,
    refreshList
  };
}
