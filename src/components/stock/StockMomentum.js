import React, { Component } from 'react';
import moment from 'moment';
import { draw_line_graph } from '../../services/graphics/stock';
import { stock_history_window } from '../../services/helper/objReformat';

const colors = ['rgb(41,128,185)', 'rgb(112, 112, 112)'];

export default class StockMomentum extends Component {
    constructor(props) {
        super(props);

        this.onChangeChart = this.onChangeChart.bind(this);

        this.state = {
            selectedPeriod: ''
        }
    }

    componentDidMount() {
        const { stockHistories, stockHistories50DMA, stockHistories200DMA } = this.props.stockInfo;
        const stockPriceWindow = stock_history_window(stockHistories[2], "close");
        const { label, metric } = stockPriceWindow;

        this.setState({
            selectedPeriod: label,
        }, () => draw_line_graph([
                { data: stockHistories[1].data, metric },
                { data: stockHistories50DMA[0].data, metric },
                { data: stockHistories200DMA[0].data, metric }
            ], 
            ".stock-momentum-chart-container", 800));
    }

    onChangeChart(option) {
        this.setState({
            ...this.state,
            selectedPeriod: option
        }, () => {
            const { stockHistories, stockHistories50DMA, stockHistories200DMA } = this.props.stockInfo;
            draw_line_graph([
                { data: stockHistories.find(stockHistory => stockHistory.label === option).data, metric: "close" },
                { data: stockHistories50DMA.find(stockHistory => stockHistory.label === option).data, metric: "close" },
                { data: stockHistories200DMA.find(stockHistory => stockHistory.label === option).data, metric: "close" }
            ], 
            ".stock-momentum-chart-container", 800);
        });
    }

    render() {
        const { stockHistories50DMA } = this.props.stockInfo;
        const { selectedPeriod } = this.state;

        return (
            <div className="section layout-col-8 marg-c">
                <h4>MOMENTUM</h4>
                <div className="layout-flex layout-flex--between">
                        <h5>50-DAY, 200-DAY MOVING AVERAGES</h5>
                        <div className="layout-flex layout-flex--bottom text-align-c">
                            {stockHistories50DMA.map(stockHistory => (
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
                <div className="stock-momentum-chart-container" />
            </div>
        );
    }
}