
import axios from 'axios';

const apiUrl = 'http://192.168.88.41:3000/api';

export const fetchData = async (invoice) => {
    try {
        const response = await axios.get(`${apiUrl}/${invoice}`);
        return response.data;
    } catch (error) {
        console.error(error);
        // throw error;
    }
};

