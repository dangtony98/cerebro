import React, { Component } from 'react';
import moment from 'moment';
import { draw_line_graph } from '../../services/graphics/stock';
import { stock_history_window } from '../../services/helper/objReformat';

export default class StockMomentum extends Component {
    constructor(props) {
        super(props);

        this.onChangeChart = this.onChangeChart.bind(this);

        this.state = {
            selectedPeriod: '',
            window: ''
        }
    }

    componentDidMount() {
        const { stockHistories, stockHistories50DMA, stockHistories200DMA } = this.props.stockInfo;
        const stockPriceWindow = stock_history_window(stockHistories[4], "close");
        const stockPriceWindow50DMA = stock_history_window(stockHistories50DMA[2], "close");
        const stockPriceWindow200DMA = stock_history_window(stockHistories200DMA[2], "close");
        const { label, metric, startDatum, endDatum } = stockPriceWindow;

        this.setState({
            selectedPeriod: label,
            window: `${moment(startDatum.date).format('l')} - ${moment(endDatum.date).format('l')}`
        }, () => draw_line_graph([
                { data: stockPriceWindow.data, metric },
                { data: stockPriceWindow50DMA.data, metric },
                { data: stockPriceWindow200DMA.data, metric }
            ], 
            ".stock-momentum-chart-container", 800));
    }

    onChangeChart(option) {

        const { stockHistories, stockHistories50DMA, stockHistories200DMA } = this.props.stockInfo;
        const stockHistoriesData = stockHistories.find(stockHistory => stockHistory.label === option).data;
        const stockHistories50DMAData = stockHistories50DMA.find(stockHistory => stockHistory.label === option).data;
        const stockHistories200DMAData = stockHistories200DMA.find(stockHistory => stockHistory.label === option).data;

        draw_line_graph([
            { data: stockHistoriesData, metric: "close" },
            { data: stockHistories50DMAData, metric: "close" },
            { data: stockHistories200DMAData, metric: "close" }
        ], 
        ".stock-momentum-chart-container", 800);
    }

    render() {
        const { stockHistories50DMA } = this.props.stockInfo;
        const { window } = this.state;

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
                                    // style={((selectedPeriod == stockHistory.label) ? { color: colors[0] } : { color: colors[1] } )}
                                    className="clickable marg-r-sm"
                                >
                                    {stockHistory.label}
                                </h5>
                            ))}
                        </div>
                    </div>
                <p className="marg-b-xs">{window}</p>
                <div className="stock-momentum-chart-container" />
            </div>
        );
    }
}