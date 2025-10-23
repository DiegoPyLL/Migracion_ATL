import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Importa el componente a testear
import ComprarSeguroSalud from '../pages/comprar_seguro_salud';

// --- Mock de 'useNavigate' ---
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});
// ------------------------------

describe('ComprarSeguroSalud Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // --- PRUEBA 1: Verificar renderizado inicial ---
  it('muestra todos los campos del formulario de seguro de salud', () => {
    render(
      <MemoryRouter>
        <ComprarSeguroSalud />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Rut/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombres y apellidos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de nacimiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ingrese su correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ingrese número de celular/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Seleccione un método de pago/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/He leído y acepto los/i)).toBeInTheDocument(); // Checkbox de términos

    // Verificamos los botones
    expect(screen.getByRole('button', { name: /Confirmar Contratación/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Limpiar/i })).toBeInTheDocument();
  });
  

  // --- LAS PRUEBAS QUE FALTAN EN BUSQUEDA SI PUEDEN FUNCIONAR ---
  // it('muestra errores si se envía con campos obligatorios vacíos', async () => { ... });
  // it('muestra error si el RUT tiene formato inválido', async () => { ... });
  // it('muestra mensaje de éxito y navega si el formulario es válido', async () => { ... });

});