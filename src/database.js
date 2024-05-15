import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if (Object.keys(search).length) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        return data
    }

    update(table, id, data) {
        const index = this.#database[table].findIndex(item => item.id === id)

        if (index === -1) return

        this.#database[table][index] = {
            ...this.#database[table][index],
            ...data
        }

        this.#persist()
    }

    insert(table, data) {
        if (!this.#database[table]) {
            this.#database[table] = []
        }

        this.#persist()

        this.#database[table].push(data)
    }

    delete(table, id) {
        this.#database[table] = this.#database[table].filter(item => item.id !== id)

        this.#persist()
    }
}