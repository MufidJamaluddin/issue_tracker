import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, DropdownItem, DropdownMenu, Dropdown, DropdownToggle } from 'reactstrap';
import { Link } from 'react-router-dom';

import './NavMenu.css';
import { connect } from 'react-redux';
import MenuItem from '../../menus';

import { ApplicationState } from '../../store';
import * as AuthStore from '../../store/AuthStore';

import ProfileMenu from './ProfileMenu'

type NavMenuProps = AuthStore.LoginState
    & typeof AuthStore.actionCreators
    & { menus: MenuItem[], logout_path: string } 

class NavMenu extends React.PureComponent<NavMenuProps, { isOpen: boolean }>
{
    public state = {
        isOpen: false
    };

    public render(): JSX.Element
    {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} to="/">IssueTracker</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} className="mr-2"/>
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
                            <ul className="navbar-nav flex-grow">
                                {
                                    this.props.menus.map((item, index) => {
                                        return (
                                            <NavItem key={index}>
                                                <NavLink tag={Link} className="text-dark" to={item.url}>
                                                    {item.name}
                                                </NavLink>
                                            </NavItem>
                                        )
                                    })
                                }

                                {
                                    this.renderProfile()
                                }
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }

    private renderProfile(): JSX.Element
    {
        return (
            <ProfileMenu
                name={this.props.data.name}
                email={this.props.data.email}
                image={this.props.data.image}
                logout_path={this.props.logout_path}
            />
        );
    }

    private toggle(): void
    {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}

export default connect(
    (state: ApplicationState) => state.authStore,
    AuthStore.actionCreators
)(NavMenu)
