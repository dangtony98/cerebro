import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './styles/_styles.scss';

import LoginPage from './components/pages/LoginPage';
import SearchPage from './components/pages/SearchPage';
import PortfolioPage from './components/pages/PortfolioPage';

const Application = () => (
    <Router>
        <Switch>
            <Route path="/" component={SearchPage} exact />
            <Route path="/login" component={LoginPage} />
            <Route path="/portfolio" component={PortfolioPage} />
        </Switch>
    </Router>
);

ReactDOM.render(<Application />, document.getElementById('app'));