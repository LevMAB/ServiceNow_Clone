import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketDetails from './pages/TicketDetails';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';
import UserList from './pages/users/UserList';
import CreateUser from './pages/users/CreateUser';
import EditUser from './pages/users/EditUser';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import AutoLogin from './components/AutoLogin';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 DEVELOPMENT AUTO-LOGIN - REMOVE BEFORE PRODUCTION 🔓 */}
        <Route path="/" element={<Navigate to="/autologin" replace />} />
        
        {/* Original routes for manual access if needed */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/autologin" element={<AutoLogin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/new" element={<CreateTicket />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route path="/tickets/:id/edit" element={<EditTicket />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<CreateUser />} />
        <Route path="/users/:id/edit" element={<EditUser />} />
        <Route path="*" element={<Navigate to="/autologin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;