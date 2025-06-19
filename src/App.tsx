import { useRoutes } from 'react-router-dom';
import { routes } from './routes/app.routes';
import { useAuth } from './auth/AuthContext';
import LoadingOlay from './components/LoadingOverlay';
import Header from './components/Header';

export default function App() {
  const element = useRoutes(routes);
  const { loading } = useAuth();

  if (loading) return <LoadingOlay />;

  return <>
      <Header />
      {element}
    </>;
}
