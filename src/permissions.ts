import { shield, rule } from 'graphql-shield'
import { sign, verify } from 'jsonwebtoken'
import { Context } from './context'


export function getUserIdFromAuth(context: Context): number | null {
    const authHeader = context.req.get('Authorization');
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '')
        const verified = verify(token, process.env.SECRET!) as any
        return verified && +verified.userId
    }
    return null;
}


export const permissions = shield({
    Query: {
        allUsers: rule()(async (parent, args, ctx, info) => { return !!getUserIdFromAuth(ctx) })
    },
    Mutation: {
        createMessage: rule()(async (parent, args, ctx, info) => { return !!getUserIdFromAuth(ctx) })
    }
})