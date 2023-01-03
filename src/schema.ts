
import { applyMiddleware } from 'graphql-middleware'
import { sign } from 'jsonwebtoken'
import { permissions } from './permissions'
import {

    makeSchema,
    objectType,
    nonNull,
    stringArg
} from 'nexus';
import { getUserIdFromAuth } from './permissions';


const AuthPayload = objectType({
    name: 'AuthPayload',
    definition(t) {
        t.string('jwt')
        t.field('user', { type: "User" })
    },
})

const User = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('name')

        t.list.field('messages', {
            type: "Message",
            resolve: (parent, _, context) => {
                return context.prisma.user.findUnique({ where: { id: parent?.id } }).messages()
            }
        })
    }
})

const Message = objectType({
    name: 'Message',
    definition(t) {
        t.nonNull.int('id')
        t.string('content')
        t.field('user', {
            type: "User",
            resolve: (parent, _, context) => {
                return context.prisma.message.findUnique({ where: { id: parent?.id } }).user()
            }
        })
    }
})


const Query = objectType({
    name: "Query",
    definition(t) {
        t.nonNull.list.field('allUsers', {
            type: "User",
            resolve: (_, __, context) => {
                return context.prisma.user.findMany();
            }
        })

        t.nonNull.list.field('allMessages', {
            type: "Message",
            resolve: (_, __, context) => {
                return context.prisma.message.findMany()
            }
        })
    }
})

const Mutation = objectType({
    name: "Mutation",
    definition(t) {
        t.field('createMessage', {
            type: "Message",
            args: {
                content: stringArg(),
            },
            resolve: (_, { content }, context) => {
                const userId = getUserIdFromAuth(context);

                console.log({ userId });

                return context.prisma.message.create({
                    data: {
                        content,
                        userId
                    }
                })
            }
        })

        t.field('login', {
            type: "AuthPayload",
            args: {
                name: nonNull(stringArg()),
                password: nonNull(stringArg())
            },
            resolve: async (_, { name, password }, context) => {
                const user = await context.prisma.user.findUnique({
                    where: { name }
                })

                if (!user) { throw new Error("No such user") }

                //todo: check password
                const payload = {
                    jwt: sign({ userId: user.id, name }, process.env.SECRET!),
                    user
                }
                return payload;
            }
        })
    },
})

const schema0 = makeSchema({
    types: [Query, Mutation, User, Message, AuthPayload],
    outputs: {
        schema: __dirname + '/../schema.graphql',
        typegen: __dirname + '/generated/nexus.ts',
    },
    contextType: {
        module: require.resolve('./context'),
        export: 'Context',
    },
    sourceTypes: {
        modules: [
            {
                module: '@prisma/client',
                alias: 'prisma',
            },
        ],
    },
})

export const schema = applyMiddleware(schema0, permissions)

