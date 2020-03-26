import React, { Component } from 'react';
import BarLoader from 'react-spinners/BarLoader';
import PortfolioQuote from '../portfolio/PortfolioQuote';
import { getPortfolioInfoA } from '../../services/helper/info';

export default class PortfolioPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            portfolio: [
                { ticker: 'KO', shares: 1 },
                { ticker: 'VOO', shares: 1 },
                { ticker: 'BTG', shares: 5 }
            ],
            portfolioInfo: null,
            loading: true
        }
    }

    async componentDidMount() {
        const { portfolio } = this.state;
        let portfolioInfo = await getPortfolioInfoA(portfolio);
        if (portfolioInfo) {
            this.setState({
                ...this.state,
                loading: false
            });
            console.log(portfolioInfo);
        }
    }

    render() {
        const { loading } = this.state;
        return (
            <div 
                className="layout-col-8 marg-c marg-t-sm"
                id="x"
            >
                <h3 id="y">CEREBRO</h3>
                {/* {loading && (
                    <div className="marg-t-sm">
                        <BarLoader
                            height={2}
                            width={document.getElementById("y").offsetWidth}
                            color={"rgb(52,152,219)"}
                        />
                    </div>
                )} */}
                <PortfolioQuote />
            </div>
        );
    }
}