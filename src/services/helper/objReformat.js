const uniqid = require('uniqid');
import { mAverage } from './arrManipulations';

const stock_info_reformat = (stockInfo) => {
    const { stockHistoryHourly, stockHistory, incomeStatementAnnual, incomeStatementQuarter, balanceSheetAnnual, balanceSheetQuarter } = stockInfo;
    const stockHistoryPeriods = [{
        label: 'LIVE',
        period: 0
    },{
        label: '1D',
        period: 1
    },{
        label: '5D',
        period: 5
    }, {
        label: '1M',
        period: 22,
    }, {
        label: '6M',
        period: 132,
    }, {
        label: '1Y',
        period: 264,
    }, {
        label: '5Y',
        period: 1320,
    }, {
        label: 'MAX',
        period: stockHistory.length - 1,
    }];

    const stockStatementPeriods = [{
        label: 'ANNUAL'
    }, {
        label: 'QUARTER'
    }];

    // Reformatting stock histories
    let stockHistories = [];
    let stockHistories50DMA = [];
    let stockHistories200DMA = [];

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
                    arrStart = stockHistoryHourly.length - 7;
                    stockHistories.push({
                        label: stockHistoryPeriods[i].label,
                        data: stockHistoryHourly.slice(arrStart)
                    });
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

    let newStockInfo = {
        ...stockInfo,
        stockHistories,
        stockHistories50DMA,
        stockHistories200DMA,
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

    delete newStockInfo.stockHistoryHourly;
    delete newStockInfo.stockHistory;
    delete newStockInfo.incomeStatementAnnual;
    delete newStockInfo.incomeStatementQuarter;
    delete newStockInfo.balanceSheetAnnual;
    delete newStockInfo.balanceSheetQuarter;
    
    return newStockInfo;
}

const stock_history_window = (stockHistory, metric) => {
    const { label, data } = stockHistory;
    
    const startDatum = data[0];
    const endDatum = data[data.length - 1];
    const changesPercentage = ((endDatum[metric] - startDatum[metric]) / startDatum[metric] * 100).toFixed(2);

    const windowDatum = {
        label,
        metric,
        data,
        startDatum,
        endDatum,
        changesPercentage,
        container: `.container-${uniqid()}`
    }

    return windowDatum;
}

export { stock_info_reformat, stock_history_window };