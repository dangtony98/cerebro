import React, { Component } from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import moment from 'moment';
import { draw_line_graph } from '../../services/graphics/stock';
import { stock_history_window } from '../../services/helper/objReformat';

const colors = ['rgb(41,128,185)', 'rgb(112, 112, 112)'];

export default class StockBalance extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        const { balanceSheets } = this.props.stockInfo;
        if (balanceSheets[0].data) {
            const metricsToShow = ["Total assets", "Total liabilities", "Total shareholders equity", "Cash and short-term investments", "Inventories", "Short-term debt", "Long-term debt"];
            let stockMetricWindows = [];
            const stateObject = {};
            
            for (let i = 0; i < metricsToShow.length; i++) {
                const stockMetricWindow = stock_history_window(balanceSheets[0], metricsToShow[i]);
                const { label, metric, startDatum, endDatum, container } = stockMetricWindow;

                stateObject[metric] = {
                    metric,
                    selectedPeriod: label,
                    window:`${moment(startDatum.date).format('l')} - ${moment(endDatum.date).format('l')}`,
                    container: container
                }
                stockMetricWindows.push(stockMetricWindow);
            }

            this.setState({
                ...this.state,
                ...stateObject
            }, () => {
                stockMetricWindows.forEach(stockMetricWindow => {
                    const { data, metric, container } = stockMetricWindow;
                    draw_line_graph([{ data, metric }], container);
                });
            });
        }
    }

    onChangeChart(object) {
        const { metric, label, container } = object;
        const { balanceSheets } = this.props.stockInfo;

        balanceSheets.forEach(balanceSheet => {
            if (label == balanceSheet.label) {
                this.setState({
                    ...this.state,
                    [metric]: {
                        ...object,
                        selectedPeriod: label
                    }
                }, () => draw_line_graph([{ data: balanceSheet.data, metric }], container));
            }
        });
    }

    render() {
        const { balanceSheets } = this.props.stockInfo;

        const { 
            "Cash and short-term investments": cashEquivalents,
            "Receivables": receivables,
            "Inventories": inventories,
            "Property, Plant & Equipment Net": propertyPlantEquip,
            "Total current assets": totalCurrentAssets,
            "Total current liabilities": totalCurrentLiabilities,
            "Long-term debt": longTermDebt,
            "Total assets": totalAssets,
            "Total liabilities": totalLiabilities,
            "Total shareholders equity": totalEquity
        } = balanceSheets[0].data[balanceSheets[0].data.length - 1] || {};

        return (
            <div>
                {(balanceSheets[0].data && !_.isEmpty(this.state)) && (
                    <div className="section layout-col-8 marg-c">
                    <h4>BALANCE SHEET </h4>
                    <div className="layout-flex">
                        <div className="section-half marg-r-sm">
                            <p>Cash, Short-Term Investmments: <strong>{numeral(parseFloat(cashEquivalents).toFixed(4)).format('$0,0.00')}</strong></p>
                            <p>Receivables: <strong>{numeral(parseFloat(receivables).toFixed(4)).format('$0,0.00')}</strong></p>
                            <p>Inventories: <strong>{numeral(parseFloat(inventories).toFixed(4)).format('$0,0.00')}</strong></p>
                            <p>Total Current Assets: <strong>{numeral(parseFloat(totalCurrentAssets).toFixed(4)).format('$0,0.00')}</strong></p>
                            <hr className="marg-t-xs marg-b-sm" />
                            <p>Property, Plant, Equipment: <strong>{numeral(parseFloat(propertyPlantEquip).toFixed(4)).format('$0,0.00')}</strong></p>
                            <p>Total Assets: <strong>{numeral(parseFloat(totalAssets).toFixed(4)).format('$0,0.00')}</strong></p>
                            <hr className="marg-t-xs marg-b-sm" />
                            <p>Total Current Liabilities: <strong>{numeral(parseFloat(totalCurrentLiabilities).toFixed(4)).format('$0,0.00')}</strong></p>
                            <p>Long-Term Debt: <strong>{numeral(parseFloat(longTermDebt).toFixed(4)).format('$0,0.00')}</strong></p>
                            <p>Total Liabilities: <strong>{numeral(parseFloat(totalLiabilities).toFixed(4)).format('$0,0.00')}</strong></p>
                            <hr className="marg-t-xs marg-b-sm" />
                            <p>Total Shareholder's Equity: <strong>{numeral(parseFloat(totalEquity).toFixed(4)).format('$0,0.00')}</strong></p>
                        </div>
                        <div className="section-half">                    
                            {_.toArray(this.state).map(stateMetric => {
                                const { metric, container, window, selectedPeriod } = stateMetric;
                                return (
                                    <div key={metric}>
                                        <div className="layout-flex layout-flex--between">
                                            <h5>{`${metric.toUpperCase()}`}</h5>
                                            <div className="layout-flex layout-flex--bottom text-align-c">
                                                {balanceSheets.map(balanceSheet => {
                                                    const { label } = balanceSheet;
                                                    return (
                                                        <h5 
                                                            onClick={() => this.onChangeChart({ metric, label, window, container })}
                                                            key={label}
                                                            style={((selectedPeriod == label) ? { color: colors[0] } : {color: colors[1] } )}
                                                            className="clickable marg-l-sm"
                                                        >
                                                            {label}
                                                        </h5>
                                                    )
                                                })}
                                            </div> 
                                        </div>
                                        <p className="marg-b-xs">{window}</p>
                                        <div 
                                            className={container.slice(1)}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                )}
            </div>
        );
    }
}