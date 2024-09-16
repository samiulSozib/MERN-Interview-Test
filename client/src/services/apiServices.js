
import axios from 'axios';

//const base_url = `http://localhost:2000/api`;
const base_url = `/api`;

export const fetchDrawings = async () => {
    try {
        const response = await axios.get(`${base_url}/`);
        return response.data; 
    } catch (e) {
        console.log(e);
        throw e; 
    }
};

export const deleteDrawing = async (id) => {
    try {
        await axios.delete(`${base_url}/${id}`);
    } catch (e) {
        console.log(e);
        throw e; 
    }
};


export const fetchDrawingById = async (id) => {
    try {
        const response = await axios.get(`${base_url}/${id}`);
        return response.data;
    } catch (e) {
        console.log('Error fetching drawing:', e);
        throw e;
    }
};

export const saveDrawing = async (id, drawingData) => {
    try {
        if (id) {
            // Update existing drawing
            await axios.put(`${base_url}/${id}`, drawingData);
        } else {
            // Add new drawing
            await axios.post(`${base_url}/`, drawingData);
        }
    } catch (e) {
        console.log('Error saving drawing:', e);
        throw e;
    }
};