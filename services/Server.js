
import axios from 'axios';

const apiUrl = 'http://192.168.88.41:3000/api';

export const fetchData = async () => {
    try {
        const response = await axios.get(`${apiUrl}/data`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

