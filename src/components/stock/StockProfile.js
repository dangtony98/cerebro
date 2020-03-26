import React, { Component } from 'react';

export default class StockProfile extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        const { sector, industry, description } = this.props.stockInfo.profile;
        return (
            <div className="section layout-col-8 marg-c xa">
                <h4>PROFILE</h4>
                {(sector && industry) && (
                    <p>Sector: <strong>{sector} :: {industry}</strong></p>
                )}
                <p>Description: {description}</p>
            </div>
        );
    }
}