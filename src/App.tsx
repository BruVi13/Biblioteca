import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Books from './pages/Books';
import Authors from './pages/Authors';
import Publishers from './pages/Publishers';
import Categories from './pages/Categories';
import Languages from './pages/Languages';
import Locations from './pages/Locations';
import Copies from './pages/Copies';
import Loans from './pages/Loans';
import Reservations from './pages/Reservations';
import Fines from './pages/Fines';
import Reviews from './pages/Reviews';
import './styles/global.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="books" element={<Books />} />
        <Route path="authors" element={<Authors />} />
        <Route path="publishers" element={<Publishers />} />
        <Route path="categories" element={<Categories />} />
        <Route path="languages" element={<Languages />} />
        <Route path="locations" element={<Locations />} />
        <Route path="copies" element={<Copies />} />
        <Route path="loans" element={<Loans />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="fines" element={<Fines />} />
        <Route path="reviews" element={<Reviews />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
