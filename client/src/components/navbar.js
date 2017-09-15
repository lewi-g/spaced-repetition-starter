import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => ({
    name: state.name,
})

export class NavBar extends React.Component {
  render () {
    return (
      <nav >
        <h2 className="userInfo">user name here{this.props.name}</h2>
        <button className="logout"> <a href={'/api/auth/logout'}>LogOut</a> </button>
      </nav>
    )
  }
}

export default connect(mapStateToProps)(NavBar);