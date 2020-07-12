import * as React from 'react'
import { DropdownToggle, Dropdown, DropdownItem, DropdownMenu, UncontrolledDropdown } from 'reactstrap'
import { Link } from 'react-router-dom'

interface ProfileMenuProps {
    name: string
    image?: string
    email: string
    logout_path: string
}

const ProfileMenu = (props: any) => {

    let profileImg = props.image ? props.image : '_fox.jpg'
    let profileImgPath = `${process.env.PUBLIC_URL}/static/profile_min/${profileImg}`

    return (
        <UncontrolledDropdown setActiveFromChild className="nav-item">
            <DropdownToggle caret className="nav-link" tag="p">
                <img src={profileImgPath}
                    width="30"
                    height="30"
                    className="rounded-circle"
                />
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem header tag="p">{props.name}</DropdownItem>
                <DropdownItem tag="p">{props.email}</DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag="p">
                    <Link to={props.logout_path}>
                        <span><i className="fa fa-sign-out" /></span> Logout
                    </Link>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
  )
}

export default ProfileMenu