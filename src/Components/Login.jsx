import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from './../appAxios';


import { SET_TOKEN, LOGOUT } from './../Redux/actions';

class Login extends React.Component {
  onSubmit() {
    const { email, password } = this;
    this.props.SessionActions.login({
      email: email.value,
      password: password.value,
    });
  }
  render() {
    let loginForm;

    if (!this.props.Session.loginStatus) {
      loginForm = (<form onSubmit={(event) => {
          event.preventDefault();
          this.onSubmit();
        }}>
          <input
            ref={(input) => { this.email = input; }}
            type="text"
            name="email"
            placeholder="email"/>
          <input
            ref={(input) => { this.password = input; }}
            type="password"
            name="password"
            placeholder="password"/>
          <input type="submit" value="Login"/>
          <br/>
          <div>
            <p>log: challenge@i2x.ai</p>
            <p>pass: pass123</p>
          </div>
        </form>);
    }

    let userOptions;
    if (this.props.Session.loginStatus) {
      userOptions = (<div className="user-options">
          <Link to="/media">
            <button onClick={this.onEnter}>Enter App</button>
          </Link>
          <button onClick={this.props.SessionActions.logout}>Exit App</button>
        </div>);
    }

    return (
      <div>
        {loginForm}
        {userOptions}
      </div>
    );
  }
}

const mapStateToProps = state => ({ Session: state.Session });

const mapDispatchToProps = dispatch => ({
  SessionActions: {
    login: ({ email, password }) => {
      axios
        .post('core/login/', { email, password })
        .then((response) => {
          const { token } = response.data;
          dispatch({ type: SET_TOKEN, TOKEN: token });
        })
        .catch(() => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('TODO: Some handler for an error');
          }
        });
    },
    logout: () => { dispatch({ type: LOGOUT }); },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
