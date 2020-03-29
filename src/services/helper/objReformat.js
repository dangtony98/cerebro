const uniqid = require('uniqid');
import { mAverage } from './arrManipulations';
import { compute_return } from './basicComputation';
import { portfolio_history_reformat } from './arrReformat';

const stock_info_package = (stockInfo) => {
    let newStockInfo = {
        ...stockInfo,
        ...stock_info_periodize(stockInfo),
        ...stock_info_statify(stockInfo)
    }

    delete newStockInfo.stockHistoryHourly;
    delete newStockInfo.stockHistory;
    delete newStockInfo.incomeStatementAnnual;
    delete newStockInfo.incomeStatementQuarter;
    delete newStockInfo.balanceSheetAnnual;
    delete newStockInfo.balanceSheetQuarter;
    
    return newStockInfo;
}

const stock_info_periodize = (stockInfo) => {
    const { stockHistory, stockHistoryHourly } = stockInfo;

    const stockHistoryPeriods = [
        { label: '1D', period: 1 },
        { label: '5D', period: 5 }, 
        { label: '1M', period: 22 }, 
        { label: '6M', period: 132 }, 
        { label: '1Y', period: 264 }, 
        { label: '5Y', period: 1320 }, 
        { label: 'MAX', period: stockHistory.length - 1 }
    ];

    let stockHistories = [], stockHistories50DMA = [], stockHistories200DMA = [];

    for (let i = 0; i < stockHistoryPeriods.length; i++) {
        if (stockHistoryPeriods[i].period < stockHistory.length) {
            let arrStart;
            switch (stockHistoryPeriods[i].period) {
                case 0:
                    arrStart = stockHistoryHourly.length - 7;
                    stockHistories.push({
                        label: stockHistoryPeriods[i].label,
                        data: stockHistoryHourly.slice(arrStart)
                    });
                    break;
                case 1:
                    if (stockHistoryHourly) {
                        arrStart = stockHistoryHourly.length - 7;
                        stockHistories.push({
                            label: stockHistoryPeriods[i].label,
                            data: stockHistoryHourly.slice(arrStart)
                        });
                    }
                    break;
                default:
                    arrStart = stockHistory.length - stockHistoryPeriods[i].period        
                    stockHistories.push({
                        label: stockHistoryPeriods[i].label,
                        data: stockHistory.slice(arrStart)
                    });
                    stockHistories50DMA.push({
                        label: stockHistoryPeriods[i].label,
                        data: mAverage(stockHistory, 50, arrStart)
                    });
                    stockHistories200DMA.push({
                        label: stockHistoryPeriods[i].label,
                        data: mAverage(stockHistory, 200, arrStart)
                    });
            }
        }
    }
    
    return {
        stockHistories,
        stockHistories50DMA,
        stockHistories200DMA
    }
}

const stock_info_statify = (stockInfo) => {
    const { incomeStatementAnnual, incomeStatementQuarter, balanceSheetAnnual, balanceSheetQuarter } = stockInfo;
    const stockStatementPeriods = [{ label: 'ANNUAL' }, { label: 'QUARTER' }];

    if (incomeStatementAnnual && incomeStatementQuarter && balanceSheetAnnual && balanceSheetQuarter) {
        return {
            incomeStatements: [{
                label: stockStatementPeriods[0].label,
                data: incomeStatementAnnual
            }, {
                label: stockStatementPeriods[1].label,
                data: incomeStatementQuarter
            }],
            balanceSheets: [{
                label: stockStatementPeriods[0].label,
                data: balanceSheetAnnual
            }, {
                label: stockStatementPeriods[1].label,
                data: balanceSheetQuarter
            }]
        }
    }
    return {};
}

const stock_history_window = (stockHistory, metric) => {
    const { label, data } = stockHistory;
    
    const startDatum = data[0], 
          endDatum = data[data.length - 1], 
          changesPercentage = ((endDatum[metric] - startDatum[metric]) / startDatum[metric] * 100).toFixed(2);

    const windowDatum = {
        label,
        metric,
        data,
        startDatum,
        endDatum,
        changesPercentage,
        container: `container-${uniqid()}`
    }

    return windowDatum;
}

const portfolio_equity_reformat = (equityHolding, stockInfo, sum) => {
    const { shares, averageCost } = equityHolding;
    const { price } = stockInfo.quote;

    const value = shares * price, 
        weight = (value / sum * 100), 
        returnDollar = shares * price - shares * averageCost,
        returnPercentage = compute_return(shares * averageCost, shares * price)

    return ({
        ...stockInfo,
        shares,
        averageCost,
        value,
        weight,
        returnDollar,
        returnPercentage
    });
}

const portfolio_info_package = (cash, portfolioValue, equitiesValue, equitiesAverageCost, equities, equityHoldings) => ({
    portfolio: {
        cash: {
            value: cash,
            weight: cash / portfolioValue * 100
        },
        equities: {
            value: equitiesValue,
            weight: equitiesValue / portfolioValue * 100,
            averageCost: equitiesAverageCost,
            returnDollar: equitiesValue - equitiesAverageCost,
            returnPercentage: compute_return(equitiesAverageCost, equitiesValue),
            equityHoldings
        },
        portfolioValue
    },
    ...stock_info_periodize(portfolio_history_reformat(equities, equityHoldings, cash))
})

export { stock_info_package, stock_history_window, stock_info_periodize, portfolio_equity_reformat, portfolio_info_package };