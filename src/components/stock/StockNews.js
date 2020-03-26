import React, { Component } from 'react';
import { getNews } from '../../services/api/news';

export default class StockNews extends Component {
    constructor(props) {
        super(props);

    }

    async componentDidMount() {
        const { symbol } = this.props.stockInfo.quote;
        // const news = await getNews(symbol);
        // console.log(news);
    }

    render() {
        return (
            <div className="section layout-col-8 marg-c">
                <h4>LATEST NEWS</h4>
                This is the StockNews component.
            </div>
        );
    }
}