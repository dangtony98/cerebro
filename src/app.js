import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles/_styles.scss';

const Application = () => (
    <div>
        This is a TestComponent.
    </div>
);

ReactDOM.render(<Application />, document.getElementById('app'));