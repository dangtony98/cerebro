import React, { Component } from 'react';
import BarLoader from 'react-spinners/BarLoader';
import StockQuote from '../stock/StockQuote';
import StockProfile from '../stock/StockProfile';
import StockMomentumm from '../stock/StockMomentum';
import StockIncome from '../stock/StockIncome';
import StockBalance from '../stock/StockBalance';

import { get_stock_info } from '../../services/helper/info';

export default class SearchPage extends Component {
    constructor(props) {
        super(props);

        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.state = {
            stockInfo: null,
            loading: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    async handleKeyDown(e) {
        const stockTicker = e.target.value.toUpperCase();
        if (e.key === 'Enter') {
            this.setState({ ...this.state, loading: true });
            let stockInfo = await get_stock_info(stockTicker);
            if (stockInfo) {
                console.log(stockInfo);
                this.setState({ ...this.state, loading: false, stockInfo });
            }
        }
    }
       
    render() {
        const { stockInfo, loading } = this.state;
        return (
            <div>
                <div className="section layout-col-10 marg-c marg-t-sm" id="search-box">
                    <div className="layout-flex layout-flex--center marg-b-sm">
                        <h3 className="marg-r-m">CEREBRO ANALYSIS</h3>
                        <input
                            onKeyPress={this.handleKeyDown}
                            placeholder="Search"
                            className="input input--secondary"
                        />
                    </div>
                    {loading && (
                        <BarLoader
                            height={2}
                            width={document.getElementById("search-box").offsetWidth}
                            color="rgb(52,152,219)"
                        />
                    )}
                </div>
                {stockInfo && (
                    <div>
                        <StockQuote stockInfo={stockInfo} />
                        <StockProfile stockInfo={stockInfo} />
                        {stockInfo.incomeStatements[0].data && (
                            <div>
                                <StockMomentumm stockInfo={stockInfo} />
                                <StockIncome stockInfo={stockInfo} />
                                <StockBalance stockInfo={stockInfo} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}