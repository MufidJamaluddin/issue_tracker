import * as React from 'react'
import { DropdownToggle, Dropdown, DropdownItem, DropdownMenu } from 'reactstrap'
import { useState } from 'react';

interface ProfileMenuProps {
    name: string
    image?: string
    email: string
}

const ProfileMenu = (props: any) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    let profileImg = 'https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg'

    return (
        <Dropdown className="nav-item" isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret className="nav-link" >
                <img src={profileImg}
                    width="30"
                    height="30"
                    className="rounded-circle"
                />
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem header>{props.name}</DropdownItem>
                <DropdownItem>{props.email}</DropdownItem>
            </DropdownMenu>
       </Dropdown>
  )
}

export default ProfileMenu