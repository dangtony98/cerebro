import React, { Component } from 'react';
import BarLoader from 'react-spinners/BarLoader';
import PortfolioOverview from '../portfolio/PortfolioOverview';
import PortfolioStatistics from '../portfolio/PortfolioStatistics';
import PortfolioTables from '../portfolio/PortfolioTables';
import { get_portfolio_info } from '../../services/helper/info';

export default class PortfolioPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            portfolio: { 
                cash: 1255.53,
                equities: [
                    { ticker: 'STOR', shares: 1, averageCost: 17.52 },
                    { ticker: 'BAC', shares: 1, averageCost: 19.42 },
                    { ticker: 'DAL', shares: 8 , averageCost: 30.67 },
                    { ticker: 'NYMT', shares: 20, averageCost: 1.63 },
                    { ticker: 'BND', shares: 2, averageCost: 85.63 },
                    { ticker: 'AJX', shares: 5, averageCost: 6.95 }
                ]
            },
            portfolioInfo: null,
            loading: true
        }
    }

    async componentDidMount() {
        window.scrollTo(0, 0);
        const { cash, equities } = this.state.portfolio;

        let portfolioInfo = await get_portfolio_info(equities, cash);
        if (portfolioInfo) {
            this.setState({
                ...this.state,
                loading: false,
                portfolioInfo
            });
            console.log(portfolioInfo);
        }
    }

    render() {
        const { loading, portfolioInfo } = this.state;
        return (
            <div 
                className="section layout-col-10 marg-c marg-t-sm"
            >
                <div className="layout-flex layout-flex--between marg-b-sm">
                    <h3>CEREBRO INSIGHTS</h3>
                    <h3>HELLO, TONY</h3>
                </div>
                {loading && (
                    <BarLoader
                        height={2}
                        width={1135}
                        color={"rgb(52,152,219)"}
                    />
                )}
                {portfolioInfo && (
                    <div>
                        <PortfolioOverview portfolioInfo={portfolioInfo} />
                        <PortfolioTables portfolioInfo={portfolioInfo} />
                    </div>
                )}
            </div>
        );
    }
}