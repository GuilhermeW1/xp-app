import { useAuth } from '../context/auth-context';
import UnathenticateRoutes from './unathenticate.routes';
import AdminRoutes from './admin.routes';

export default function AppRoutes(){
  const {user} = useAuth();
  console.log({user});
  return(
    <>
      {user ? <AdminRoutes/> : <UnathenticateRoutes/>}
    </>
  );
}
