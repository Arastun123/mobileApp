
import axios from 'axios';

const apiUrl = 'http://192.168.190.57:3000/api';

export const fetchData = async (tableName) => {
    try {
        const response = await axios.get(`${apiUrl}/${tableName}`);
        return response.data;
    } catch (error) {
        console.error('Request Error:', error);
        throw error;
    }
};

