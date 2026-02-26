import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rental from './pages/Rental';
import Assistance from './pages/Assistance';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProductForm from './pages/admin/ProductForm';
import BrandForm from './pages/admin/BrandForm';
import { ContactProvider } from './context/ContactContext';

function App() {
  return (
    <HelmetProvider>
      <ContactProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="locacao" element={<Rental />} />
              <Route path="assistencia" element={<Assistance />} />
              <Route path="contato" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/editor" element={<ProductForm />} />
            <Route path="/admin/editor/:id" element={<ProductForm />} />
            <Route path="/admin/marcas/editor" element={<BrandForm />} />
            <Route path="/admin/marcas/editor/:id" element={<BrandForm />} />
          </Routes>
        </Router>
      </ContactProvider>
    </HelmetProvider>
  );
}

export default App;
