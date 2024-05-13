import { randomUUID } from 'node:crypto';

import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
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

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks')

            return res
                .setHeader('Content-type', 'application/json')
                .end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            database.update('tasks', id, req.body)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            database.update('tasks', id, {
                completed_at: new Date().toISOString()
            })

            return res.writeHead(204).end()
        }
    },
    // Importação de tasks em massa por um arquivo CSV
    // {
    //     method: 'POST',
    //     path: '/tasks/import',
    //     handler: (req, res) => {
    //         const { id } = req.params;
    //     }
    // }
]