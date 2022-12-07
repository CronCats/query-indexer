import {db} from "../index";

export const agentBalances = async (params) => {
    let agentId = params.agentAddress
    console.log('getting balances for agent', agentId)

    const protocol = await db.select({
        x: 'js_agent_balances.fk_agent_id',
        y: 'js_agent_balances.amount',
    }).from('js_agents')
        .innerJoin('js_agent_balances', 'js_agent_balances.fk_agent_id', 'js_agents.id')
        .where({
            'js_agents.address': agentId,
            'type': 'protocol',
            'denom': 'ujunox'
        })
    const manager = await db.select({
        x: 'js_agent_balances.fk_agent_id',
        y: 'js_agent_balances.amount',
    }).from('js_agents')
        .innerJoin('js_agent_balances', 'js_agent_balances.fk_agent_id', 'js_agents.id')
        .where({
            'js_agents.address': agentId,
            'type': 'manager-state',
            'denom': 'ujunox'
        })

    console.log(`Total protocol balances: ${protocol.length}`)
    console.log(`Total manager-state balances: ${manager.length}`)
    return {'manager-state': manager, 'protocol': protocol}
}
