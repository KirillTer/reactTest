import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import Login from './Components/Login.jsx';
import Media from './Components/Media.jsx';

class Routing extends React.Component {
  render() {
    this.SwitchProvider = Switch;
    this.RouteProvider = Route;
    this.RedirectProvider = Redirect;

    return (
    <Switch>
      <Route exact path='/' component={Login}/>
      <Route path='/media' render={() => {
        if (this.props.Session.loginStatus) { return <Media/>; }
        return <Redirect to="/"/>;
      }} />
      <Redirect to="/"/>
    </Switch>);
  }
}

const mapStateToProps = state => ({ Session: state.Session });

export default withRouter(connect(mapStateToProps)(Routing));
