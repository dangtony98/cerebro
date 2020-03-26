import React, { Component } from 'react';

export default class PortfolioQuote extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    

    render() {
        const { portfolioInfo } = this.props;
        return (
            <div className="section">
                <h4>QUOTE</h4>
                <div className="layout-flex">
                    <div className="section-half marg-r-sm">
                        <table>
                            <tbody>
                                <tr>
                                    <th>Asset</th>
                                    <th>Expected Return</th>
                                    <th>Standard Deviation</th>
                                </tr>
                                <tr>
                                    <th>A</th>
                                    <th>2.5</th>
                                    <th>0.5</th>
                                </tr>
                                <tr>
                                    <th>B</th>
                                    <th>2.5</th>
                                    <th>0.5</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="section-half">
                        Test
                        <div className="portfolio-overview-chart-container">

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}