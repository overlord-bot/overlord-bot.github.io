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

