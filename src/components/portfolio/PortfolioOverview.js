import React, { Component } from 'react';
import { draw_line_graph, draw_pie_chart } from '../../services/graphics/stock';

const colors = ['rgb(41,128,185)', 'rgb(112, 112, 112)'];

export default class PortfolioOverview extends Component {
    constructor(props) {
        super(props);

        this.onChangeChart = this.onChangeChart.bind(this);

        this.state = {
            selectedPeriod: ''
        }
    }

    componentDidMount() {
        const { portfolioInfo } = this.props;
        const { label, data } = portfolioInfo.stockHistories[0];
        const { cash, equities } = portfolioInfo.portfolio;

        this.setState({ selectedPeriod: label }, () => {
            draw_line_graph([{ data, metric: "close" }], "portfolio-overview-chart-container");
            draw_pie_chart([cash, equities], "portfolio-overview-chartx-container");});
    }

    onChangeChart(option) {
        const { stockHistories } = this.props.portfolioInfo;
        this.setState({ selectedPeriod: option }, () => draw_line_graph([{ data: stockHistories.find(stockHistory => stockHistory.label === option).data, metric: "close" }], "portfolio-overview-chart-container"));
    }

    render() {
        const { selectedPeriod } = this.state;
        const { stockHistories } = this.props.portfolioInfo;
        return (
            <div className="marg-b-m">
                <h4>OVERVIEW</h4>
                <div className="layout-flex">
                    <div className="section-half marg-r-m">
                        <div className="layout-flex layout-flex--between marg-b-xs">
                            <h5>PERFORMANCE</h5>
                            <div className="layout-flex layout-flex--bottom text-align-c">
                                {stockHistories.map(stockHistory => {
                                    const { label } = stockHistory;
                                    return (
                                        <h5
                                            onClick={() => this.onChangeChart(label)}
                                            key={label}
                                            style={((selectedPeriod == label) ? { color: colors[0] } : { color: colors[1] } )}
                                            className="clickable marg-l-sm"
                                        >
                                            {label}
                                        </h5>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="portfolio-overview-chart-container" />
                    </div>
                    <div className="section-half">
                        <h5 style={{ textAlign: "center" }}>ASSET ALLOCATION</h5>
                        <div className="portfolio-overview-chartx-container" />
                    </div>
                </div>
            </div>
        );
    }
}