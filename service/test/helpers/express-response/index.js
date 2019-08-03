//mock express response object
const createResponse = () => {
    const response = {
        lastStatus: 0,
        lastResponse: null,
        lastSentFilePath: null
    };

    response.status = (status) => {
        response.lastStatus = status;
        return response;
    };

    response.send = (body) => {
        response.lastResponse = body;
    };

    response.sendFile = (path) => {
        response.lastSentFilePath = path;
    };

    return response;
};

Object.assign(module.exports, {
    createResponse
});