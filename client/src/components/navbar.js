import React from 'react';

export default class NavBar extends React.Component {
  render () {
    return (
      <nav>
        <ul>
         <li> UserName from user.id or something </li>
         <li> <a href={'/api/auth/logout'}>LogOut</a> </li>
        </ul>
      </nav>
    )
  }
}