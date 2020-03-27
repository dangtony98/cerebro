import React, { Component } from 'react';
import moment from 'moment';
import { draw_line_graph } from '../../services/graphics/stock';
import { stock_history_window } from '../../services/helper/objReformat';
import { decimalReformat, demicalReformatLarge, textToPercentageReformat, wholeReformat } from '../../services/helper/metricReformat';

const colors = ['rgb(41,128,185)', 'rgb(112, 112, 112)'];

export default class StockQuote extends Component {
    constructor(props) {
        super(props);

        this.onChangeChart = this.onChangeChart.bind(this);

        this.state = {
            selectedPeriod: '',
            window: '',
            liveIsActive: false,
            liveData: []
        }
    }

    componentDidMount() {
        const { stockHistories } = this.props.stockInfo;
        const stockPriceWindow = stock_history_window(stockHistories[1], "close");
        const { label, metric, data, startDatum, changesPercentage } = stockPriceWindow;
        
        this.setState({
            selectedPeriod: label,
            window:`${moment(startDatum.date).format('l')} (${changesPercentage}%)`
        }, () => draw_line_graph([{ data, metric }], ".stock-overview-chart-container"));
    }

    async onChangeChart(option) {
        const { liveIsActive } = this.state;
        const { quote, stockHistories } = this.props.stockInfo;
        // if (label == 'LIVE' && !liveIsActive) {
        //     // Implement LIVE functionality.
        //     this.setState({
        //         ...this.state,
        //         selected: label,
        //         liveIsActive: true
        //     }, async () => {
        //         const stockHistoryLive = await getStockHistoryLive(quote.symbol);
        //         const stockHistoryObj = [{ date: new Date(), close: stockHistoryLive.data.price }];
        //         draw_line_graph([{ data: stockHistoryObj, metric: "close" }], 
        //             ".stock-overview-chart-container", 
        //         );
        //     });

        //     return;
        // }

        stockHistories.forEach(stockHistory => {
            if (option == stockHistory.label) {
                const stockPriceWindow = stock_history_window(stockHistory, "close");
                const { label, metric, data, startDatum, endDatum, changesPercentage } = stockPriceWindow;
                
                this.setState(({
                    ...this.state,
                    selectedPeriod: label,
                    window: (option == '1D' || option == 'LIVE') ? `${moment(startDatum.date).format('l')} (${changesPercentage}%)` : `${moment(startDatum.date).format('l')} - ${moment(endDatum.date).format('l')} (${changesPercentage}%)`,
                    liveIsActive: false
                }), () => draw_line_graph([{ data, metric }], ".stock-overview-chart-container"));
            }      
        });
        
    }

    render() {
        const { selectedPeriod } = this.state;
        const { profile, quote, financialRatios, stockHistories, dCF } = this.props.stockInfo; 
        const { companyName, price, changesPercentage, beta, image } = profile;
        const { 
            exhange, symbol, marketCap, pe, eps, open, previousClose, 
            dayLow, dayHigh, yearLow, yearHigh, sharesOutstanding 
        } = quote;
        const { dcf } = dCF;

        return (
            <div 
                id="section"
                className="section layout-col-8 marg-c marg-t-sm"
            >
                <h4>QUOTE</h4>
                <div className="layout-flex">
                    <div 
                        id="section-half"
                        className="section-half marg-r-sm"
                    >
                        <div className="layout-flex layout-flex--center">
                            <img 
                                src={image} 
                                className="image-profile marg-r-xs" 
                            />
                            <div>
                                <h5>{`${companyName} (${exhange}: ${symbol})`}</h5>
                                <h5>{`${price} ${changesPercentage}`}</h5>
                            </div>
                        </div>
                        <hr className="marg-t-xs marg-b-sm" />
                        <p>Market Cap: <strong>{marketCap ? demicalReformatLarge(marketCap) : "N/A"}</strong></p>
                        <p>Beta: <strong>{decimalReformat(beta)}</strong></p>
                        <p>P/E: <strong>{pe ? decimalReformat(pe) : "N/A"}</strong></p>
                        <p>EPS: <strong>{eps ? decimalReformat(eps) : "N/A"}</strong></p>
                        <p>Div Yield: <strong>{financialRatios ? textToPercentageReformat(financialRatios[0].investmentValuationRatios.dividendYield) : "N/A"}</strong></p>
                        <p>Intrinsic Value: <strong>{dcf ? decimalReformat(dcf) : "N/A"}</strong></p>
                        <hr className="marg-t-xs marg-b-xs" />
                        <p>Open: <strong>{open}</strong></p>
                        <p>Prev Close: <strong>{previousClose}</strong></p>
                        <p>1 Day Range: <strong>{`${dayLow} - ${dayHigh}`}</strong></p>
                        <p>52 Week Range: <strong>{`${yearLow} - ${yearHigh}`}</strong></p>
                        <p>Shares Outstanding: <strong>{`${wholeReformat(sharesOutstanding)}`}</strong></p>
                    </div>
                    <div className="section-half">
                        <div className="layout-flex layout-flex--between">
                            <h5>PRICE</h5>
                            <div className="layout-flex layout-flex--bottom text-align-c">
                                {stockHistories.map(stockHistory => (
                                    <h5 
                                        onClick={() => this.onChangeChart(stockHistory.label)}
                                        key={stockHistory.label}
                                        style={((selectedPeriod == stockHistory.label) ? { color: colors[0] } : { color: colors[1] } )}
                                        className="clickable marg-r-sm"
                                    >
                                        {stockHistory.label}
                                    </h5>
                                ))}
                            </div>
                        </div>
                        {/* <p className="marg-b-xs">{window}</p> */}
                        <div 
                            className="stock-overview-chart-container"
                        />
                    </div>
                </div>                        
            </div>
        );
    }
}