export default {
    _200(data = {}) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 200,
            body: JSON.stringify(data)
        }
    },
    _202(data = {}) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 202,
            body: JSON.stringify(data)
        }
    },
    _400(data = {}) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 400,
            body: JSON.stringify(data)
        }
    },
    _404(data = {}) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 404,
            body: JSON.stringify(data)
        }
    },
    _409(data = {}) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 409,
            body: JSON.stringify(data)
        }
    },
    _410(data = {}) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 410,
            body: JSON.stringify(data)
        }
    },
}