export const getCatalog = async () => {
    return new Promise(async (res, rej) => {
        fetch('https://vna818.com/api/flask/degree-planner/catalog')
            .then((response) => response.json())
            .then((data) => res(data))
            .catch(error => console.log(error));
    })
}
export const getSchedule = async (num) => {
    return new Promise(async (res, rej) => {
        fetch('https://vna818.com/api/flask/degree-planner/users/vna/schedule/'+String(num))
            .then((response) => response.json())
            .then((data) => res(data))
            .catch(error => console.log(error));
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
            .then((data) => res(data))
            .catch(error => console.log(error));
    })
}

export const deleteCourse = async (num,data) => {
    console.log(data)
    return new Promise(async (res, rej) => {
        fetch('https://vna818.com/api/flask/degree-planner/users/vna/schedule/'+String(num),
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => res(data))
            .catch(error => console.log(error));
    })
} 
