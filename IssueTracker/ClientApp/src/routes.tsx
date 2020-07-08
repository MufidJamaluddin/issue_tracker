import Home from './components/pages/public/Home';
import Login from './components/pages/public/Login';

import MainDashboard from './components/pages/dashboard/Home';
import Category from './components/pages/dashboard/Category';
import Ticket from './components/pages/dashboard/Ticket';
import User from './components/pages/dashboard/User';
import Logout from './components/pages/dashboard/Logout';

export default interface RoutesItem {
    path: string,
    exact: boolean,
    component: any,
}

const DashboardRoutes: RoutesItem[] = [
    {
        path: '/dashboard', exact: true, component: MainDashboard,
    },
    {
        path: '/dashboard/category', exact: false, component: Category,
    },
    {
        path: '/dashboard/ticket', exact: false, component: Ticket,
    },
    {
        path: '/dashboard/user', exact: false, component: User,
    },
];

const PublicRoutes: RoutesItem[] = [
    {
        path: '/', exact: true, component: Home,
    },
    {
        path: '/login', exact: false, component: Login,
    },
    {
        path: '/logout', exact: true, component: Logout,
    }
];

export {
    DashboardRoutes,
    PublicRoutes
};