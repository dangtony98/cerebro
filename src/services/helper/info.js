import { 
    getStockProfile,
    getStockHistoryHourly,
    getStockHistory,
    getDCF,
    getFinancialRatios,
    getIncomeStatementAnnual,
    getIncomeStatementQuarter,
    getBalanceSheetAnnual,
    getBalanceSheetQuarter,
    getStockQuote,
} from '../api/stock';

import { getSectorPerformance } from '../api/market';

import { mAverage, gMean, gRate } from './arrManipulations';
import { stock_history_reformat, stock_statement_reformat } from './arrReformat';
import { stock_info_reformat } from './objReformat';

/*
Returns an object containing all basic info relevant to a stock's computations. Parameter:
ticker: the stock's ticker symbol.
*/

const getStockInfo = async (ticker) => {
    const profile = await getStockProfile(ticker);
    const quote = await getStockQuote(ticker);
    const stockHistoryHourly = await getStockHistoryHourly(ticker);
    const stockHistory = await getStockHistory(ticker);
    const dCF = await getDCF(ticker);
    const financialRatios = await getFinancialRatios(ticker);
    const incomeStatementAnnual = await getIncomeStatementAnnual(ticker);
    const incomeStatementQuarter = await getIncomeStatementQuarter(ticker);
    const balanceSheetAnnual = await getBalanceSheetAnnual(ticker);
    const balanceSheetQuarter = await getBalanceSheetQuarter(ticker);
    const sectorPerformance = await getSectorPerformance();

    let stockInfo = await {
        profile: profile.data.profile,
        quote: quote.data[0],
        tickerInfo: tickerInfo.data[0],
        financialRatios: financialRatios.data.ratios,
        dCF: dCF.data,
        stockHistoryHourly: stock_history_reformat(stockHistoryHourly.data.reverse()),
        stockHistory: stock_history_reformat(stockHistory.data.historical),
        incomeStatementAnnual: incomeStatementAnnual.data.financials && stock_statement_reformat(incomeStatementAnnual.data.financials.reverse()),
        incomeStatementQuarter: incomeStatementQuarter.data.financials && stock_statement_reformat(incomeStatementQuarter.data.financials.reverse()),
        balanceSheetAnnual: balanceSheetAnnual.data.financials && stock_statement_reformat(balanceSheetAnnual.data.financials.reverse()),
        balanceSheetQuarter: balanceSheetQuarter.data.financials && stock_statement_reformat(balanceSheetQuarter.data.financials.reverse()),
        sectorPerformance: sectorPerformance.data.sectorPerformance
    }

    return stock_info_reformat(stockInfo);
}

/*
Syncs each stock in the portfolio's information to localStorage. Parameters:
portfolio: the user's portfolio of stocks.
*/

const getPortfolioInfoA = async (portfolio) => {
    // Forming the portfolio composition.
    let portfolioInfo;
    let portfolioComposition = [];

    for (let i = 0; i < portfolio.length; i++) {
        let stockInfo = await getStockInfo(portfolio[i].ticker);
        portfolioComposition.push({
            ...stockInfo,
            shares: portfolio[i].shares 
        });
    }

    localStorage.setItem('portfolioComposition', JSON.stringify(portfolioComposition));

    portfolioInfo = {
        portfolioComposition
    }

    return portfolioComposition;
}

/*
Returns an object containing more detailed portfolio information. Parameter:
portfolioComposition: an array of detailed portfolio constituents.
*/

const getPortfolioInfo = async (portfolioComposition) => {
    let portfolioVPerformance = [];
    let portfolioVPerformanceSmoothen = [];
    let portfolioVPerformanceSmoothen2 = [];
    let portfolioGPerformance = [];
    let portfolioGPerformanceSmoothen = [];
    let portfolioGMean;
    let portfolioIndustries = [];
    let portfolioSectors = [];
    let portfolioTotalShares = 0;
    let portfolioBeta = 0;
    let portfolioValue = 0;

    let portfolioHistoryMaxTraceable = 10000;

    for (let i = 0; i < portfolioComposition.length; i++) {
        portfolioTotalShares += portfolioComposition[i].shares;
        portfolioValue += portfolioComposition[i].profile.price * portfolioComposition[i].shares;
        portfolioIndustries.push(portfolioComposition[i].profile.industry);
        portfolioSectors.push(portfolioComposition[i].profile.sector);

        if (portfolioComposition[i].stockHistory.length < portfolioHistoryMaxTraceable) {

            portfolioHistoryMaxTraceable = portfolioComposition[i].stockHistory.length;
        }
    }

    for (let i = 0; i < portfolioComposition.length; i++) {
        portfolioBeta += portfolioComposition[i].profile.beta * portfolioComposition[i].shares * portfolioComposition[i].profile.price / portfolioValue;
    }

    for (let i = 0; i < portfolioHistoryMaxTraceable; i++) {
        let close = 0;
        for (let j = 0; j < portfolioComposition.length; j++) {
            close += portfolioComposition[j].stockHistory[i].close * portfolioComposition[j].shares;
        }
        portfolioVPerformance.push({
            date: portfolioComposition[0].stockHistory[i].date,
            close: close,
            index: portfolioHistoryMaxTraceable - i
        });
    }

    portfolioGPerformance = gRate(portfolioVPerformance, portfolioHistoryMaxTraceable);
    portfolioGMean = gMean(portfolioGPerformance);
    portfolioGPerformanceSmoothen = mAverage(portfolioGPerformance, 30, portfolioHistoryMaxTraceable);
    portfolioVPerformanceSmoothen = mAverage(portfolioVPerformance, 50, portfolioHistoryMaxTraceable);
    portfolioVPerformanceSmoothen2 = mAverage(portfolioVPerformance, 200, portfolioHistoryMaxTraceable);

    return await {
        portfolioComposition,
        portfolioIndustries,
        portfolioSectors,
        portfolioTotalShares,
        portfolioBeta,
        portfolioValue,
        portfolioVPerformance,
        portfolioVPerformanceSmoothen,
        portfolioVPerformanceSmoothen2,
        portfolioGPerformance,
        portfolioGPerformanceSmoothen,
        portfolioGMean
    }
}

export { getPortfolioInfoA, getStockInfo, getPortfolioInfo };

