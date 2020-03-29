import React from 'react';
import { decimal_reformat, dollar_reformat, whole_reformat } from '../../services/helper/metricReformat';

const cell_color = (number) => number < 0 ? ({ backgroundColor: "rgba(231, 76, 60, 0.25)" }) : ({ });

export default ({ portfolioInfo }) => {
    const { cash, equities } = portfolioInfo.portfolio;

    return (
        <div>
            <h4>TABLES</h4>
            <h5 className="marg-b-xs">HOLDINGS</h5>
            <table className="marg-b-m">
                <tbody>
                    <tr>
                        <th>Asset</th>
                        <th>Shares</th>
                        <th>Average Cost</th>
                        <th>Market Price</th>
                        <th>Value</th>
                        <th>Weight (%)</th>
                        <th>Return ($)</th>
                        <th>Return (%)</th>
                    </tr>
                    <tr>
                        <td className="td-highlight">Cash</td>
                        <td className="td-highlight">-</td>
                        <td className="td-highlight">-</td>
                        <td className="td-highlight">-</td>
                        <td className="td-highlight">{dollar_reformat(cash.value)}</td>
                        <td className="td-highlight">{`${decimal_reformat(cash.weight)}%`}</td>
                        <td className="td-highlight">-</td>
                        <td className="td-highlight">-</td>
                    </tr>
                    <tr>
                        <td className="td-highlight">Equities</td>
                        <td className="td-highlight">-</td>
                        <td className="td-highlight">{dollar_reformat(equities.averageCost)}</td>
                        <td className="td-highlight">-</td>
                        <td className="td-highlight">{dollar_reformat(equities.value)}</td>
                        <td className="td-highlight">{`${decimal_reformat(equities.weight)}%`}</td>
                        <td className="td-highlight">{dollar_reformat(equities.returnDollar)}</td>
                        <td className="td-highlight">{`${equities.returnPercentage}%`}</td>
                    </tr>
                    {equities.equityHoldings.map(holding => {
                        const { quote, shares, averageCost, value, weight, returnDollar, returnPercentage } = holding;
                        const { symbol, price } = quote;
                        return (
                            <tr>
                                <td>{symbol}</td>
                                <td>{shares}</td>
                                <td>{dollar_reformat(averageCost)}</td>
                                <td>{dollar_reformat(price)}</td>
                                <td>{dollar_reformat(value)}</td>
                                <td>{`${decimal_reformat(weight)}%`}</td>
                                <td style={cell_color(returnDollar)}>{dollar_reformat(returnDollar)}</td>
                                <td style={cell_color(returnPercentage)}>{`${returnPercentage}%`}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <h5 className="marg-b-xs">QUOTES</h5>
            <table>
                <tbody>
                    <tr>
                        <th>Stock</th>
                        <th>Market Price</th>
                        <th>Change ($)</th>
                        <th>Change (%)</th>
                        <th>Average Volume</th>
                        <th>Shares Outstanding</th>
                        <th>P/E</th>
                        <th>EPS</th>
                    </tr>
                    {equities.equityHoldings.map(holding => {
                        const { symbol, price, change, changesPercentage, avgVolume, sharesOutstanding, pe, eps } = holding.quote;
                        return (
                            <tr>
                                <td>{symbol}</td>
                                <td>{dollar_reformat(price)}</td>
                                <td style={cell_color(change)}>{decimal_reformat(change)}</td>
                                <td style={cell_color(changesPercentage)}>{decimal_reformat(changesPercentage)}</td>
                                <td>{whole_reformat(avgVolume)}</td>
                                <td>{whole_reformat(sharesOutstanding)}</td>
                                <td>{decimal_reformat(pe)}</td>
                                <td>{decimal_reformat(eps)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}