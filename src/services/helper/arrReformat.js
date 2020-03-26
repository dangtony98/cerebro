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

const financialGrowthExtract = (arr, metric) => {
    let financialGrowth = [];
    for (let i = 0; i < arr.length; i++) {
        const financialDatum = {
            date: arr[i].date,
            [metric]: parseFloat(arr[i][metric])/1000000
        }
        financialGrowth.push(financialDatum);
    }
    return financialGrowth;
}

export { stock_history_reformat, stock_statement_reformat, financialGrowthExtract };