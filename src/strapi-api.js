import axios from 'axios';

export const postLoginAdmin = async (data) => {
    return axios.post(`http://localhost:1337/admin/login`, data);
}

export const getCollectionTypes = async (token) => {
    const data = await axios.get(`http://localhost:1337/content-manager/content-types`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
    });
    return data;
}

export const getContents = async (collectionType) => {
    let url = 'http://localhost:1337/api/'+collectionType;
    const data = await axios.get(url);
    return data;
}