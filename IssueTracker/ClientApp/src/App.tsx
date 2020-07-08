import * as React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/shared/Layout';

import RoutesItem, { DashboardRoutes, PublicRoutes } from './routes';

import NavMenu from './components/shared/NavMenu';
import MenuItem, { DashboardMenus, PublicMenus } from './menus';

import './custom.css';
import 'font-awesome/css/font-awesome.min.css';
import CLoading from './components/shared/CLoading';

const AppInner = (props: { droutes: RoutesItem[], dmenus: MenuItem[] }): JSX.Element => {

    return (
        <>
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
        </>
   )
}

const DashboardApp = (props) => <AppInner 
    droutes={DashboardRoutes}
    dmenus={DashboardMenus} />

const PublicApp = (props) => <AppInner
    droutes={PublicRoutes}
    dmenus={PublicMenus} />

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
