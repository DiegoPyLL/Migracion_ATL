// src/test/Registro.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Importa el componente a testear
import Registro from '../pages/registro'; // Asegúrate que la ruta sea correcta

// --- Mock de 'useNavigate' (igual que en Login.test.tsx) ---
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});
// ------------------------------

describe('Registro Component', () => {

  // PRUEBA 1: Verificar que todos los campos se rendericen
  it('muestra todos los campos del formulario de registro', () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    // Verificamos cada campo usando su etiqueta (label)
    expect(screen.getByLabelText(/Rut/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    // Para las contraseñas, usamos selectorAll ya que "Contraseña" se repite
    expect(screen.getAllByLabelText(/Contraseña/i)[0]).toBeInTheDocument(); // Primer campo contraseña
    expect(screen.getByLabelText(/Repetir Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();

    // Verificamos el botón de envío
    expect(screen.getByRole('button', { name: /Enviar/i })).toBeInTheDocument();
  });

  // PRUEBA 2: Validar errores con campos vacíos
  it('muestra errores si se envía el formulario con campos vacíos', async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    // Simulamos clic en el botón Enviar
    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }));

    // Esperamos que aparezcan los mensajes de error (usamos findByText por asincronía)
    // Nota: Adaptamos los mensajes a los de tu componente
    expect(await screen.findByText(/El Rut debe contener/i)).toBeInTheDocument();
    expect(await screen.findByText(/El Nombre debe contener/i)).toBeInTheDocument();
    expect(await screen.findByText(/El Correo debe tener un formato válido/i)).toBeInTheDocument();
    expect(await screen.findByText(/El Usuario debe contener/i)).toBeInTheDocument();
    expect(await screen.findByText(/La contraseña debe tener al menos 4 caracteres/i)).toBeInTheDocument();
    // El error de repetir contraseña solo aparece si la primera tiene algo
    // expect(await screen.findByText(/Las contraseñas no coinciden/i)).toBeInTheDocument(); // Esta aparecerá en otra prueba
    expect(await screen.findByText(/Formato incorrecto. Ej:/i)).toBeInTheDocument(); // Error de teléfono
  });

  // PRUEBA 3: Validar errores de formato específicos
  it('muestra errores de formato específicos (ej: correo inválido, contraseñas no coinciden)', async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    // Llenamos algunos campos con datos válidos y otros inválidos
    fireEvent.change(screen.getByLabelText(/Rut/i), { target: { value: '11111111-1' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Usuario Test' } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'correo-invalido' } }); // Correo inválido
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getAllByLabelText(/Contraseña/i)[0], { target: { value: 'pass1' } }); // Contraseña 1
    fireEvent.change(screen.getByLabelText(/Repetir Contraseña/i), { target: { value: 'pass2' } }); // Contraseña 2 diferente
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '+56912345678' } });

    // Simulamos clic en Enviar
    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }));

    // Verificamos los errores específicos esperados
    expect(await screen.findByText(/El Correo debe tener un formato válido/i)).toBeInTheDocument();
    expect(await screen.findByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  // PRUEBA 4: Comprobar el flujo de registro exitoso
  it('no muestra errores y navega al perfil si todos los campos son válidos', async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    // Llenamos todos los campos con datos válidos
    fireEvent.change(screen.getByLabelText(/Rut/i), { target: { value: '11111111-1' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Usuario Valido' } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'valido@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'validuser' } });
    fireEvent.change(screen.getAllByLabelText(/Contraseña/i)[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Repetir Contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '+56987654321' } });

    // Simulamos clic en Enviar
    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }));

    // Verificamos que NINGÚN mensaje de error esté presente
    // Usamos queryByText que devuelve null si no lo encuentra (no falla como findByText)
    expect(screen.queryByText(/El Rut debe contener/i)).toBeNull();
    expect(screen.queryByText(/El Nombre debe contener/i)).toBeNull();
    expect(screen.queryByText(/El Correo debe tener un formato válido/i)).toBeNull();
    // ... (y así para todos los posibles mensajes de error)

    // Verificamos que se llamó a navigate con la ruta '/perfil'
    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
  });

});