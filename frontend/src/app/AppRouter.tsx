import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '../modules/home/HomePage';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { TicketRoutes } from '../modules/ticketing/TicketRoutes';

export function AppRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tickets/*" element={<TicketRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
