
import axios from 'axios';

const apiUrl = 'http://192.168.88.44:3000/api';

export const fetchData = async (tableName) => {
    try {
        const response = await axios.get(`${apiUrl}/${tableName}`);
        return response.data;
    } catch (error) {
        console.error('Request Error:', error);
        throw error;
    }
};

