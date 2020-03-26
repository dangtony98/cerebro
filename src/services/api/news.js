import axios from 'axios';
import { NEWS_API_KEY } from '../variables/keys';

const getNews = async (searchTerm) => {
    return await axios.get(`http://newsapi.org/v2/everything?q=${searchTerm}?language=en&apiKey=${NEWS_API_KEY}`);
}

export { getNews };