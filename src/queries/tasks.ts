import {db} from "../index";

export const taskDepositByHash = async (params) => {
    const hash = params.taskHash
    const denom = params.denom || "ujunox"
    console.log('getting deposits for task by hash ' + hash + ' with denom ' + denom)
    const res = await db.select({
        x: 'fk_task_id',
        y: 'amount'
    }).from('js_task_deposits')
        .innerJoin('js_tasks', 'js_task_deposits.fk_task_id', 'js_tasks.id')
        .where({
            'hash': hash,
            'denom': denom
        })
    console.log(`Total rows: ${res.length}`)
    return res
}
