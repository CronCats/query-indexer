import express from 'express'
import cors from 'cors'
import {config} from "dotenv"
import knex from "knex";
import {txs} from "./queries/tx";
import { agentBalances } from './queries/agents';
config({ path: '.env' })
const app = express()

app.use(cors())
app.enable('trust proxy')
app.use(express.urlencoded({extended: false}))
app.use(express.json())

const DB_HOSTIP = process.env.DB_HOSTIP
const DB_PORT: number = Number.parseInt(process.env.DB_PORT)
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS

const getDb = () => {
    const enableSSL = !['localhost', '127.0.0.1'].includes(DB_HOSTIP);

    return knex({
        client: 'pg',
        connection: {
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
            host: DB_HOSTIP,
            port: DB_PORT,
            ssl: enableSSL
        },
        pool: {
            max: 5,
            min: 5,
            acquireTimeoutMillis: 60000,
            createTimeoutMillis: 30000,
            idleTimeoutMillis: 600000,
            createRetryIntervalMillis: 200,
        }
    });
}

export const db = getDb()

app.get('/agents', async (req, res) => {
    console.log("list all agents…")
    res.status(200).send()
})

app.get('/agent/:agentAddress', async (req, res) => {
    try {
        let results = await agentBalances(req.params)
        res.status(!results ? 400 : 200).send(results)
    } catch (err) {
        console.warn('Error getting agent balances', err, req.params)
        res.status(400).send({error: err})
    }
})

app.get('/tasks', async (req, res) => {
    console.log("list all tasks…")
    res.status(200).send()
})

app.get('/config', async (req, res) => {
    console.log("list manager's config…")
    res.status(200).send()
})

app.get('/txs', async (req, res) => {
    console.log("list transaction info…")
    try {
        let results = await txs(req.body)
        res.status(!results ? 400 : 200).send(results)
    } catch (err) {
        console.warn('Error hitting txs', err, req.body)
        res.status(400).send({error: err})
    }
})

const server = app.listen(8080, () => {
    console.log("listenin'")
})

server.setTimeout(3000)
