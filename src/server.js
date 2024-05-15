import http from 'node:http';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
        req.body = null
    }

    const route = routes.find(route => {
        return route.method === method && route.path.test(url);
    })

    if (route) {
        const routeParameters = req.url.match(route.path)

        const { query, ...routeParams } = routeParameters.groups;

        req.params = routeParams;
        req.query = query ? extractQueryParams(query) : {};

        return route.handler(req, res);
    }

    return res.writeHead(404).end()
});

server.listen(3000);
