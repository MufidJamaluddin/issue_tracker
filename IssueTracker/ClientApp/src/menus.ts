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
];

const PublicMenus: MenuItem[] = [
    {
        url: '/',
        name: 'Home',
    },
    {
        url: '/dashboard',
        name: 'App Panel'
    },
]

export { DashboardMenus, PublicMenus };