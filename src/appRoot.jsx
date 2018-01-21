import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import Store from './Redux';
import Routing from './appRouting.jsx';

const App = document.getElementById('App');
export default class AppRoot extends React.Component {
  render() {
    this.Router = BrowserRouter;
    this.ReduxProvider = Provider;
    this.RoutingProvider = Routing;
    return (
      <Provider store={Store}>
        <BrowserRouter>
          <Routing></Routing>
        </BrowserRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<AppRoot/>, App);
