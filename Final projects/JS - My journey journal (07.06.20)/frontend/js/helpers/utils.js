export const parseRequestURL = () => {
    const url = location.hash.slice(2),
        request = {};

    [request.resource, request.tripid, request.action, request.aimid, request.aimaction] = url.split('/');

    return request;
};

export const generateID = () => {
    return Math.random().toString(36).substr(2, 10);
};