import Home from './components/pages/public/Home';
import Login from './components/pages/public/Login';

import MainDashboard from './components/pages/dashboard/Home';
import Category from './components/pages/dashboard/Category';
import Ticket from './components/pages/dashboard/Ticket';
import User from './components/pages/dashboard/User';
import Logout from './components/pages/dashboard/Logout';
import CategoryDetail from './components/pages/dashboard/Category/CategoryDetail';
import TicketDetail from './components/pages/dashboard/Ticket/TicketDetail';
import UserDetail from './components/pages/dashboard/User/UserDetail';

import NewCategory from './components/pages/dashboard/Category/NewCategory';
import NewTicket from './components/pages/dashboard/Ticket/NewTicket';
import NewUser from './components/pages/dashboard/User/NewUser';

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
        path: '/dashboard/category', exact: true, component: Category,
    },
    {
        path: '/dashboard/newcategory', exact: true, component: NewCategory,
    },
    {
        path: '/dashboard/category/:id/:status', exact: false, component: CategoryDetail,
    },
    {
        path: '/dashboard/ticket', exact: true, component: Ticket,
    },
    {
        path: '/dashboard/newticket', exact: true, component: NewTicket,
    },
    {
        path: '/dashboard/ticket/:id/:status', exact: false, component: TicketDetail,
    },
    {
        path: '/dashboard/newuser', exact: true, component: NewUser,
    },
    {
        path: '/dashboard/user', exact: true, component: User,
    },
    {
        path: '/dashboard/user/:id/:status', exact: false, component: UserDetail,
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