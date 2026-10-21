import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import { LanguageRedirect } from './components/i18n/LanguageRedirect';
import { LanguageRoute } from './components/i18n/LanguageRoute';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LanguageRedirect />} />
        <Route
          path="/:lang"
          element={
            <LanguageRoute>
              <CatalogPage />
            </LanguageRoute>
          }
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<NotFoundPage />} />
        <Route
          path="/:lang/*"
          element={
            <LanguageRoute>
              <NotFoundPage />
            </LanguageRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
