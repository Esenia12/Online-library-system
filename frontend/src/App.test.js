import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders navigation bar', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  // Проверяем, что навбар отрендерился (не зависит от языка/i18n)
  const nav = screen.getByRole('navigation');
  expect(nav).toBeInTheDocument();

  // Проверяем, что есть хотя бы одна ссылка с href="/home"
  //const homeLink = screen.getByRole('link', { name: /home/i });
  //expect(homeLink).toHaveAttribute('href', '/home');

  const links = nav.querySelectorAll('a.nav-link');
  const hrefs = Array.from(links).map((a) => a.getAttribute('href'));
  expect(hrefs).toContain('/home');
  expect(hrefs).toContain('/categories');
});



 
