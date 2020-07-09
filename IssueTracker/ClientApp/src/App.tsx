import * as React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/shared/Layout';

import RoutesItem, { DashboardRoutes, PublicRoutes } from './routes';

import NavMenu from './components/shared/NavMenu';
import MenuItem, { DashboardMenus, PublicMenus } from './menus';

import './custom.css';
import 'font-awesome/css/font-awesome.min.css';
import CLoading from './components/shared/CLoading';

import NeedAuth from './components/shared/NeedAuth';

const AppInner = (props: { droutes: RoutesItem[], dmenus: MenuItem[], requireLogin: boolean }): JSX.Element => {

    return (
        <NeedAuth requireLogin={props.requireLogin} {...props}>
            <CLoading />
            <NavMenu menus={props.dmenus} />
            <Switch>
                {
                    props.droutes.map((item, index) => {
                        return (
                            <Route
                                key={index}
                                exact={item.exact}
                                path={item.path}
                                component={item.component}
                            />
                        )
                    })
                }
            </Switch>
        </NeedAuth>
   )
}

const DashboardApp = (props) => <AppInner 
    droutes={DashboardRoutes}
    dmenus={DashboardMenus}
    requireLogin={false}
    {...props}
/>

const PublicApp = (props) => <AppInner
    droutes={PublicRoutes}
    dmenus={PublicMenus}
    requireLogin={false}
    {...props}
/>

class App extends React.Component
{
    render(): JSX.Element
    {
        return (
            <Layout>
                <Switch>
                    <Route path="/dashboard" component={DashboardApp} />
                    <Route path="/" component={PublicApp} />
                </Switch>
            </Layout>
        )
    }
}

export default App;
