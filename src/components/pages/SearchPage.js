import React, { Component } from 'react';
import BarLoader from 'react-spinners/BarLoader';
import StockQuote from '../stock/StockQuote';
import StockProfile from '../stock/StockProfile';
import StockMomentumm from '../stock/StockMomentum';
import StockIncome from '../stock/StockIncome';
import StockBalance from '../stock/StockBalance';

import { getStockInfo } from '../../services/helper/info';

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
            let stockInfo = await getStockInfo(stockTicker);
            if (stockInfo) {
                console.log(stockInfo);
                this.setState({ ...this.state, loading: false, stockInfo });
            }
        }
    }
       
    render() {
        const { stockInfo, loading } = this.state;
        return (
            <div className="pages-relative">
                <div 
                    id="search-frame"
                >
                    <div className="section layout-col-8 marg-c layout-flex layout-flex--center">
                        <h3 className="marg-r-m">CEREBRO</h3>
                        <input
                            onKeyPress={this.handleKeyDown}
                            placeholder="Search"
                            className="input input--secondary"
                        />
                    </div>
                    {loading && (
                        <div className="marg-t-sm">
                            <BarLoader
                                height={2}
                                width={document.getElementById("search-frame").offsetWidth}
                                color="rgb(52,152,219)"
                            />
                        </div>
                    )}
                    {(stockInfo && !loading) && (
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
            </div>  
        );
    }
}