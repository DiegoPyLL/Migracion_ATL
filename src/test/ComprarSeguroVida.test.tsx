import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ComprarSeguroVida from '../pages/compra_seguro_vida';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

describe('ComprarSeguroVida Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // PRUEBA 1: Verificar que los campos de usuario y contraseña se rendericen
  it('muestra los campos principales del formulario de seguro de vida', () => {
    render(
      <MemoryRouter>
        <ComprarSeguroVida />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Rut/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombres y apellidos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de nacimiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Número de celular/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Seleccione un método de pago/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/He leído/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmar Contratación/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Limpiar/i })).toBeInTheDocument();
  });

  // PRUEBA 2: Validar comportamiento cuando los campos están vacíos
  it('muestra errores si se intenta enviar sin datos', async () => {
    render(
      <MemoryRouter>
        <ComprarSeguroVida />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Confirmar Contratación/i }));

    expect(await screen.findByText(/El RUT no es válido/i)).toBeInTheDocument();
    expect(await screen.findByText(/El nombre es requerido/i)).toBeInTheDocument();
    expect(await screen.findByText(/La fecha es requerida/i)).toBeInTheDocument();
    expect(await screen.findByText(/formato del correo no es válido/i)).toBeInTheDocument();
    expect(await screen.findByText(/Seleccione un método de pago\./i)).toBeInTheDocument();
    expect(await screen.findByText(/Debes aceptar los términos/i)).toBeInTheDocument();
  });

  // PRUEBA 3: Validar credenciales incorrectas
  it('muestra error cuando el RUT es inválido aunque el resto sea válido', async () => {
    render(
      <MemoryRouter>
        <ComprarSeguroVida />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Rut/i), { target: { value: '11hgghghghfcj1111-1' } });
    fireEvent.change(screen.getByLabelText(/Nombres y apellidos/i), { target: { value: 'Paciente Vida' } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: '1985-08-20' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'vida@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Número de celular/i), { target: { value: '+56911112222' } });
    fireEvent.change(screen.getByLabelText(/Seleccione un método de pago/i), { target: { value: 'tarjeta-credito' } });
    fireEvent.click(screen.getByLabelText(/He leído/i));

    fireEvent.click(screen.getByRole('button', { name: /Confirmar Contrataci/i }));

    expect(await screen.findByText(/El RUT no es válido/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // PRUEBA 4: Comprobar el flujo con credenciales correctas
  it('acepta datos válidos y navega al home después de confirmar', async () => {
    
      render(
        <MemoryRouter>
          <ComprarSeguroVida />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/Rut/i), { target: { value: '11111111-1' } });
      fireEvent.change(screen.getByLabelText(/Nombres y apellidos/i), { target: { value: 'Paciente Vida' } });
      fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: '1985-08-20' } });
      fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'vida@correo.com' } });
      fireEvent.change(screen.getByLabelText(/Número de celular/i), { target: { value: '+56911112222' } });
      fireEvent.change(screen.getByLabelText(/Seleccione un método de pago/i), { target: { value: 'tarjeta-credito' } });
      fireEvent.click(screen.getByLabelText(/He leído/i));

      fireEvent.click(screen.getByRole('button', { name: /Confirmar Contrataci/i }));

      expect(await screen.findByText(/Contratación exitosa/i)).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/');

    }
  );
});
