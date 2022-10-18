export const getCatalog = async () => {
    return new Promise(async (res, rej) => {
        fetch('https://vna818.com/api/flask/degree-planner/catalog')
            .then((response) => response.json())
            .then((data) => res(data));
    })
}

