
import axios from 'axios';

const url = 'http://192.168.88.44:3000/api';

export const fetchData = async (tableName) => {
    try {
        const response = await axios.get(`${url}/${tableName}`);
        return response.data;
    } catch (error) {
        console.error('Request Error:', error);
        throw error;
    }
};

export const sendRequest = async (apiUrl, postData) => {
    let endpoint = `${url}${apiUrl}`;
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        if (response.status === 200) return { success: true, message: 'Məlumatlar göndərildi!' };
        else if (response.status === 400) return { success: true, message: 'Məlumat bazada möcuddur!' };
        else return { success: false, message: 'Uğursuz cəht!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error occurred during the request.' };
    }
};

export const sendEditData = async (id, updatedRows, date, customer, number, tableName) => {
    let endpoint = `${url}/edit/${id}/${tableName}`;
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                updatedRows: updatedRows,
                date: date,
                customer: customer,
                number: number,
            }),
        });
        if (response.status === 200) return { success: true, message: 'Məlumat yeniləndi' };
        else return { success: false, message: 'Uğursuz cəht!' };
    } catch (error) {
        return { success: false, message: 'Xəta!' };
    }
};

export const deleteData = async (id, tableName) => {
    let endpoint = `${url}/delete/${id}/${tableName}`;
    console.log(endpoint);
    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',

            },
            body: {},
        });
        if (response.status === 200) return { success: true, message: 'Məlumat silindi' };
        else return { success: false, message: 'Uğursuz cəht!' };
    } catch (error) {
        return { success: false, message: 'Error occurred during the request.' };

    }
}