const stock_history_reformat = (arr) => {
    let stockHistory = [];
    for (let i = 0; i < arr.length; i++) {
        let date;
        const year = arr[i].date.substring(0, 4);
        const month = arr[i].date.substring(5, 7);
        const day = arr[i].date.substring(8, 10);
        if (arr[0].date.length > 10) {
            const hour = arr[i].date.substring(11, 13);
            date = new Date(year, month - 1, day, hour);
        } else {
            date = new Date(year, month - 1, day);
        }
        const stockDatum = {
            date,
            close: arr[i].close
        }
        stockHistory.push(stockDatum);
    }
    return stockHistory;
}

const stock_statement_reformat = (arr) => {
    if (arr) {
        let stockStatement = [];

        for (let i = 0; i < arr.length; i++) {
            const year = arr[i].date.substring(0, 4);
            const month = arr[i].date.substring(5, 7);
            const day = arr[i].date.substring(8, 10);
    
            const stockDatum = {
                ...arr[i],
                date: new Date(year, month - 1, day)
            }
            stockStatement.push(stockDatum);
        }
        return stockStatement;
    }
    return arr;
}

// Assembles the portfolio history for the given stocks
const portfolio_history_reformat = (portfolio, equityHoldings, cash = 0) => {
    let stockHistory = [],
        minHistoryTraceable = Math.min(...equityHoldings.map(stock => stock.stockHistories.find(stockHistory => stockHistory.label == "MAX").data.length));

    for (let j = 0; j  < minHistoryTraceable; j++) {
        let sum = cash, date;
        for (let k = 0; k < equityHoldings.length; k++) {
            const stockHistoryMax = equityHoldings[k].stockHistories.find(stockHistory => stockHistory.label == "MAX").data,
                  arrStart = stockHistoryMax.length - minHistoryTraceable,
                  stockHistoryMaxSliced = stockHistoryMax.slice(arrStart);
                  
            date = stockHistoryMaxSliced[j].date;
            sum += (stockHistoryMaxSliced[j].close * portfolio[k].shares);
        }

        stockHistory.push({
            date,
            close: sum
        });
    }

    return {
        stockHistory,
    }
}

export { stock_history_reformat, stock_statement_reformat, portfolio_history_reformat };