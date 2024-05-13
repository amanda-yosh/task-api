import { randomUUID } from 'node:crypto';
import http from 'node:http';
import { Database } from './database.js';

const database = new Database();

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

    if (method === 'POST' && url === '/tasks') {
        const { title, description } = req.body;

        const date = new Date().toISOString();

        const task = {
            id: randomUUID(),
            title,
            description,
            completed_at: null,
            created_at: date,
            updated_at: date
        }

        database.insert('tasks')
        database.insert('tasks', task)

        return res.writeHead(201).end()
    }

    // - Listagem de todas as tasks
    if (method === 'GET') {
        res.write('List tasks');
    }

    // - Atualização de uma task pelo `id`
    if (method === 'PUT') { }

    // - Remover uma task pelo `id`
    if (method === 'DELETE') { }

    // - Marcar pelo `id` uma task como completa
    if (method === 'PATCH') { }

    // - E o verdadeiro desafio: Importação de tasks em massa por um arquivo CSV
    if (method === 'POST' && req.url === '/import') { }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
