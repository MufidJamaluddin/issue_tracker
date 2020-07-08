export default interface MenuItem {
    url: string
    name: string
}

const DashboardMenus: MenuItem[] = [
    {
        url: '/dashboard/category',
        name: 'Category'
    },
    {
        url: '/dashboard/ticket',
        name: 'Ticket'
    },
    {
        url: '/dashboard/user',
        name: 'User'
    },
    {
        url: '/logout',
        name: 'Logout'
    }
];

const PublicMenus: MenuItem[] = [
    {
        url: '/',
        name: 'Home',
    },
    {
        url: '/login',
        name: 'Login'
    },
]

export { DashboardMenus, PublicMenus };