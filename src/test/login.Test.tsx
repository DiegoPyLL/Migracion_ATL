// src/Test/Login.test.tsx

// Importamos las funciones principales de Vitest [cite: 45]
import { describe, it, expect, vi } from 'vitest';

// Importamos las herramientas de Testing Library [cite: 45]
import { render, screen, fireEvent } from '@testing-library/react';

// Importamos MemoryRouter para simular el enrutador, ya que tu componente usa 'useNavigate' [cite: 45]
import { MemoryRouter } from 'react-router-dom';

// Importamos el componente que vamos a testear
import Login from '../pages/login'; // (Ajusta la ruta si es necesario)

// --- Mock de 'useNavigate' ---
// 'useNavigate' no funciona fuera de un Router real.
// Creamos un 'mock' (un espía) para simularlo y verificar que se llame.
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  // Importamos el original para no perder el resto de sus funciones (como MemoryRouter)
  const originalModule = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockNavigate, // Sobrescribimos 'useNavigate' con nuestro espía
  };
});




describe('Login Component', () => {

  // PRUEBA 1: Verificar que los campos de usuario y contraseña se rendericen
  it('muestra los campos de usuario y contraseña', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );



    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
  });



  // PRUEBA 2: Validar comportamiento cuando los campos están vacíos
  it('muestra errores si los campos están vacíos', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simulamos que el usuario presiona el botón 'Ingresar'
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));
    expect(await screen.findByText(/Por favor ingresa el usuario/i)).toBeInTheDocument();
    expect(await screen.findByText(/Por favor ingresa la contraseña/i)).toBeInTheDocument();
  });



  // PRUEBA 3: Validar credenciales incorrectas
  it('muestra error de credenciales incorrectas', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    // Simulamos que el usuario escribe credenciales incorrectas de TU componente
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'usuarioErroneo' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));
    expect(await screen.findByText(/Usuario o contraseña incorrectos/i)).toBeInTheDocument();
  });



  // PRUEBA 4: Comprobar el flujo con credenciales correctas
  it('acepta credenciales correctas y navega al perfil', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simulamos que el usuario escribe las credenciales correctas de TU componente [cite: 48]
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
  });

});