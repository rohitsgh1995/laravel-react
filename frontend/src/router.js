import { createBrowserRouter } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Profile from './pages/Profile';
import ProtectedLayout from './components/ProtectedLayout';
import GuestLayout from './components/GuestLayout';

const router = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/',
                element: <Login />
            },
            {
                path: '/',
                element: <Register />
            }
        ]
    },
    {
        path: '/',
        element: <ProtectedLayout />,
        children: [
            {
                path: '/',
                element: <About />
            },
            {
                path: '/',
                element: <Profile />
            }
        ]
    }
]);

export default router;