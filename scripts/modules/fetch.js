export const getCatalog = async () => {
    return new Promise(async (res, rej) => {
        fetch('https://vna818.com/api/flask/degree-planner/catalog')
            .then((response) => response.json())
            .then((data) => res(data));
    })
}
export const getSchedule = async (num) => {
    return new Promise(async (res, rej) => {
        fetch('https://vna818.com/api/flask/degree-planner/users/vna/schedule/'+String(num))
            .then((response) => response.json())
            .then((data) => res(data));
    })
}
export const addCourse = async (num,data) => {
    return new Promise(async (res, rej) => {
        fetch('https://vna818.com/api/flask/degree-planner/users/vna/schedule/'+String(num),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => res(data));
    })
}

export const deleteCourse = async (num,data) => {
    return new Promise(async (res, rej) => {
        fetch('https://vna818.com/api/flask/degree-planner/users/vna/schedule/'+String(num),
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => res(data));
    })
} 
