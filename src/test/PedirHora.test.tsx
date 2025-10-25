import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import PedirHora from '../pages/pedirHora';

describe('PedirHora Page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <PedirHora />
      </MemoryRouter>
    );

  // PRUEBA 1: Verificar que los campos de usuario y contraseña se rendericen
  it('muestra los campos principales del formulario', () => {
        render(
      <MemoryRouter>
        <PedirHora />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Reserva tu hora/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre y apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contrase.+paciente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tel.+fono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rea de atenci/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Doctor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Hora/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmar reserva/i })).toBeInTheDocument();
  });

  // PRUEBA 2: Validar comportamiento cuando los campos están vacíos
  it('muestra mensajes de error cuando el formulario se envía vacío', async () => {
        render(
      <MemoryRouter>
        <PedirHora />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Confirmar reserva/i }));

    expect(await screen.findByText(/Ingresa tu nombre/i)).toBeInTheDocument();
    expect(await screen.findByText(/contrase.+a debe tener/i)).toBeInTheDocument();
    expect(await screen.findByText(/Ingresa un tel/i)).toBeInTheDocument();
    expect(await screen.findByText(/Selecciona un .+rea/i, { selector: 'p' })).toBeInTheDocument();
    expect(await screen.findByText(/Selecciona un doctor/i)).toBeInTheDocument();
    expect(await screen.findByText(/Selecciona una fecha/i)).toBeInTheDocument();
    expect(await screen.findByText(/Selecciona una hora/i)).toBeInTheDocument();
  });

  // PRUEBA 3: Validar credenciales incorrectas
  it('muestra error cuando el teléfono no es válido', async () => {
        render(
      <MemoryRouter>
        <PedirHora />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre y apellido/i), { target: { value: 'Paciente Test' } });
    fireEvent.change(screen.getByLabelText(/Contrase.+paciente/i), { target: { value: 'clave123' } });
    fireEvent.change(screen.getByLabelText(/Tel.+fono/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/rea de atenci/i), { target: { value: 'general' } });
    fireEvent.change(screen.getByLabelText(/Doctor/i), { target: { value: 'Dra. Marta Rojas' } });
    fireEvent.change(screen.getByLabelText(/^Fecha/i), { target: { value: '2025-11-30' } });
    fireEvent.change(screen.getByLabelText(/^Hora/i), { target: { value: '09:00' } });

    fireEvent.click(screen.getByRole('button', { name: /Confirmar reserva/i }));

    expect(await screen.findByText(/tel.+fono v.+lido/i)).toBeInTheDocument();
  });

  // PRUEBA 4: Comprobar el flujo con credenciales correctas
  it('envía una reserva exitosa cuando todos los datos son válidos', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        render(
      <MemoryRouter>
        <PedirHora />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre y apellido/i), { target: { value: 'Ana Paciente' } });
    fireEvent.change(screen.getByLabelText(/Contrase.+paciente/i), { target: { value: 'secreto123' } });
    fireEvent.change(screen.getByLabelText(/Tel.+fono/i), { target: { value: '+56912345678' } });

    fireEvent.change(screen.getByLabelText(/rea de atenci/i), { target: { value: 'general' } });
    fireEvent.change(screen.getByLabelText(/Doctor/i), { target: { value: 'Dra. Marta Rojas' } });
    fireEvent.change(screen.getByLabelText(/^Fecha/i), { target: { value: '2025-12-01' } });
    fireEvent.change(screen.getByLabelText(/^Hora/i), { target: { value: '10:30' } });

    fireEvent.click(screen.getByRole('button', { name: /Confirmar reserva/i }));

    await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Reserva confirmada'));
    expect(screen.queryByText(/Ingresa tu nombre/i)).toBeNull();
  });
});
