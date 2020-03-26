import React, { Component } from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import moment from 'moment';
import { draw_line_graph } from '../../services/graphics/stock';
import { stock_history_window } from '../../services/helper/objReformat';

const colors = ['rgb(41,128,185)', 'rgb(112, 112, 112)'];

export default class StockIncome extends Component {
    constructor(props) {
        super(props);

        this.onChangeChart = this.onChangeChart.bind(this);

        this.state = {

        }
    }

    componentDidMount() {
        const { incomeStatements } = this.props.stockInfo;
        if (incomeStatements[0].data) {
            const metricsToShow = ["EPS", "Dividend per Share", "Revenue", "Cost of Revenue", "Operating Expenses", "Net Income", "Gross Margin", "Net Profit Margin", "Free Cash Flow margin"];
            let stockMetricWindows = [];
            const stateObject = {};
            
            for (let i = 0; i < metricsToShow.length; i++) {
                const stockMetricWindow = stock_history_window(incomeStatements[0], metricsToShow[i]);
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
        const { incomeStatements } = this.props.stockInfo;

        incomeStatements.forEach(incomeStatement => {
            if (label == incomeStatement.label) {
                this.setState({
                    ...this.state,
                    [metric]: {
                        ...object,
                        selectedPeriod: label
                    }
                }, () => draw_line_graph([{ data: incomeStatement.data, metric }], container));
            }
        });
    }

    render() {
        const { incomeStatements } = this.props.stockInfo;
        const { 
            "Revenue": revenue, 
            "Cost of Revenue": cogs, 
            "Gross Profit": grossProfit, 
            "Operating Expenses": opex,
            "Net Income": netIncome,
            "Revenue Growth": revenueGrowth,
            "Gross Margin": grossMargin,
            "Net Profit Margin": netProfitMargin,
            "Dividend per Share": dividendShare
        } = incomeStatements[0].data[incomeStatements[0].data.length - 1] || {};
        return (
            <div>
                {(incomeStatements[0].data && !_.isEmpty(this.state)) && (
                    <div className="section layout-col-8 marg-c">
                    <h4>INCOME STATEMENT </h4>
                    <div className="layout-flex">
                        <div className="section-half marg-r-sm">
                            <p>Revenue: <strong>{numeral(parseFloat(revenue).toFixed(4)).format('$0,0.00')}</strong></p>
                            <p>Cost of Revenue: <strong>{numeral(parseFloat(cogs).toFixed(4)).format('$0,0.00')}</strong></p>
                            <p>Gross Profit: <strong>{numeral(parseFloat(grossProfit).toFixed(4)).format('$0,0.00')}</strong></p>
                            <hr className="marg-t-xs marg-b-sm" />
                            <p>Operating Expenses: <strong>{numeral(parseFloat(opex).toFixed(4)).format('$0,0.00')}</strong></p>
                            <p>Net Income: <strong>{numeral(parseFloat(netIncome).toFixed(4)).format('$0,0.00')}</strong></p>
                            <hr className="marg-t-xs marg-b-sm" />
                            <p>Revenue Growth: <strong>{numeral(parseFloat(revenueGrowth).toFixed(4)).format('%0.00')}</strong></p>
                            <p>Gross Margin: <strong>{numeral(parseFloat(grossMargin).toFixed(4)).format('%0.00')}</strong></p>
                            <p>Net Profit Margin: <strong>{numeral(parseFloat(netProfitMargin).toFixed(4)).format('%0.00')}</strong></p>
                            <p>Dividend Per Share: <strong>{numeral(parseFloat(dividendShare).toFixed(4)).format('$0.00')}</strong></p>
                        </div>
                        <div className="section-half">                    
                            {_.toArray(this.state).map(stateMetric => {
                                const { metric, container, window, selectedPeriod } = stateMetric;
                                return (
                                    <div key={metric}>
                                        <div className="layout-flex layout-flex--between">
                                            <h5>{`${metric.toUpperCase()}`}</h5>
                                            <div className="layout-flex layout-flex--bottom text-align-c">
                                                {incomeStatements.map(incomeStatement => {
                                                    const { label } = incomeStatement;
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
                                            className={`${container.slice(1)} marg-b-sm`}
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