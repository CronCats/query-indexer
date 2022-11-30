import {db} from "../index";

export const txs = async (body) => {
    console.log('inside of queries/tx.ts', body)
    // The below query turned into Knex
    // See docs: https://knexjs.org/guide
    // SELECT t.id, gas_wanted, gas_used FROM js_transactions as t INNER JOIN js_messages as m ON t.id=m.fk_tx_id WHERE fn = 'proxy_call';
    const res = await db.select({
        x: 'js_transactions.id',
        y: 'gas_wanted'
    }).from('js_transactions')
        .innerJoin('js_messages', 'js_transactions.id', 'js_messages.fk_tx_id')
        .where('fn', 'proxy_call')
    console.log(`Total rows: ${res.length}`)
    return res
}
