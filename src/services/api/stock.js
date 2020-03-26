import axios from 'axios';

const getStockList = async () => {
    return await axios.get('https://financialmodelingprep.com/api/v3/company/stock/list');
}

const getStockProfile = async (ticker) => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/company/profile/${ticker}`)
}

const getStockQuote = async (ticker) => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/quote/${ticker}`)
}

const getNYSEMarketHours = async () => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/is-the-market-open`)
}  

const getStockHistoryLive = async (ticker) => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/stock/real-time-price/${ticker}`)
}

const getStockHistoryHourly = async (ticker) => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/historical-chart/1hour/${ticker}`)
}  

const getStockHistory = async (ticker) => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line`)
}

const getDCF = async (ticker) => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/company/discounted-cash-flow/${ticker}`);
}

const getFinancialRatios = async (ticker) => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/financial-ratios/${ticker}`);
}

const getIncomeStatementAnnual = async (ticker) => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/financials/income-statement/${ticker}`);
}

const getIncomeStatementQuarter = async (ticker) => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/financials/income-statement/${ticker}?period=quarter`);
}

const getBalanceSheetAnnual = async (ticker) => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/financials/balance-sheet-statement/${ticker}`);
}

const getBalanceSheetQuarter = async (ticker) => {
    return await axios.get(`https://financialmodelingprep.com/api/v3/financials/balance-sheet-statement/${ticker}?period=quarter`);
}

export { 
    getStockProfile,
    getStockQuote,
    getStockList, 
    getNYSEMarketHours,
    getStockHistoryLive,
    getStockHistoryHourly,
    getStockHistory, 
    getDCF, 
    getFinancialRatios,
    getIncomeStatementAnnual,
    getIncomeStatementQuarter,
    getBalanceSheetAnnual,
    getBalanceSheetQuarter
};