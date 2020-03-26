import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

export class LoginPage extends Component {
    constructor(props) {
        super(props);
        
        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);

        this.state = {
            index: 0,
            username: '',
            password: ''
        }
    }

    onChange(e) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        });
    }

    onKeyPress(e) {
        const { index, username } = this.state;
        if (e.key == "Enter") {
            switch (index) {
                case 0:
                    if (username != "") {
                        this.setState((prevState) => ({ 
                            ...this.state, 
                            index: prevState.index + 1 
                        }));
                    }
                    break;
                default:
                    this.props.history.push('/');
            }
        }
    }

    render() {
        const { 
            index,
            username,
            password
        } = this.state;
        return (
            <div className="pages-relative">
                <div className="element-box layout-position--center layout-col-4 marg-c">
                    <h3 className="text-align-c">
                        CEREBRO
                    </h3>
                    {index == 0 ? (
                        <input type="text" 
                            value={username}  
                            onChange={this.onChange}
                            onKeyPress={this.onKeyPress}
                            placeholder="Username"
                            name="username"     
                            autoComplete="off"
                            className="input input--secondary"                 
                        />
                    ) : (
                        <input type="password"
                            value={password}
                            onChange={this.onChange}
                            onKeyPress={this.onKeyPress}
                            placeholder="Password"
                            name="password"
                            autoComplete="off"
                            className="input input--secondary"
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(LoginPage);