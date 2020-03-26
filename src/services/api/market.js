import axios from 'axios';

const getSectorPerformance = async () => {
    return await axios.get('https://financialmodelingprep.com/api/v3/stock/sectors-performance');
}

export { getSectorPerformance };