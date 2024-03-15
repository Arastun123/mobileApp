
import axios from 'axios';

const url = 'http://192.168.88.40:3000/api';

export const fetchData = async (tableName, formatDate) => {
    try {
        const response = await axios.get(`${url}/${tableName}/${formatDate ? 'true' : ''}`);
        return response.data;
    } catch (error) {
        console.error('Request Error:', error);
        throw error;
    }
};

export const sendRequest = async (apiUrl, postData) => {
    let endpoint = `${url}${apiUrl}`;
    try {
        const response = await axios.post(endpoint, JSON.stringify(postData), {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        );

        if (response.status === 200) return { success: true, message: 'Məlumatlar göndərildi!' };
        else if (response.status === 400) return { success: true, message: 'Məlumat bazada möcuddur!' };
        else return { success: false, message: 'Uğursuz cəht!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error occurred during the request.' };
    }
};

export const sendEditData = async (updatedRows, tableName) => {
    let endpoint = `${url}/edit/${tableName}`;
    try {
        const response = await axios.put(endpoint,
            {
                updatedRows: updatedRows,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 200) return { success: true, message: 'Məlumat yeniləndi' };
        else return { success: false, message: 'Uğursuz cəht!' };
    } catch (error) {
        return { success: false, message: 'Xəta!' };
    }
};

export const deleteData = async (id, tableName) => {
    let endpoint = `${url}/delete/${id}/${tableName}`;
    try {
        const response = await axios.delete(endpoint, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) return { success: true, message: 'Məlumat silindi' };
        else return { success: false, message: 'Uğursuz cəht!' };
    } catch (error) {
        return { success: false, message: 'Error occurred during the request.' };

    }
}

export const autoFill = async (tableName, columnName, query) => {
    try {
        const response = await axios.get(`http://192.168.88.40:3000/endpoint/autoFill?query=${query}&tableName=${tableName}&columnName=${columnName}`);
        return response.data;
    } catch (error) {
        console.error('Request Error:', error);
        throw error;
    }

}