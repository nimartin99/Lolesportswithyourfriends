// const import.meta.env.VITE_BACKEND_ADDRESS = 'localhost';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const getRequest = async (path, body) => {
    const token = getCookie('token');
    const response = await fetch('http://' + import.meta.env.VITE_BACKEND_ADDRESS + ':3000' + '/api' + path, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response;
}

const postRequest = async (path, body) => {
    const token = getCookie('token');
    const response = await fetch('http://' + import.meta.env.VITE_BACKEND_ADDRESS + ':3000' + '/api' + path, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response;
}

const patchRequest = async (path, body) => {
    const token = getCookie('token');
    const response = await fetch('http://' + import.meta.env.VITE_BACKEND_ADDRESS + ':3000' + '/api' + path, {
        method: "PATCH", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response;
}

export {
    getRequest,
    postRequest,
    patchRequest,
}
