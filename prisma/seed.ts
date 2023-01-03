import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
    await prisma.message.deleteMany();
    await prisma.user.deleteMany();

    const users = ['Larry', 'Moe', 'Curly'];
    await Promise.all(users.map(
        (name) => {
            return prisma.user.create({ data: { name } })
        }
    ))


    const messages = ["Spread love everywhere you go. Let no one ever come to you without leaving happier.",
        "When you reach the end of your rope, tie a knot in it and hang on.",
        "Always remember that you are absolutely unique. Just like everyone else.",
        "Don't judge each day by the harvest you reap but by the seeds that you plant.",
        "The future belongs to those who believe in the beauty of their dreams."]



    await Promise.all(messages.map(
        (content) => {
            //shuffle user
            const name = users.sort(function () { return 0.5 - Math.random() }).at(0)
            return prisma.message.create({
                data: {
                    content,
                    user: { connect: { name } }
                }
            })
        }
    ))
}


main()
    .catch(e => {
        console.log(e)
        process.exit(1)
    })
    .finally(
        () => {
            () => prisma.$disconnect()
        }
    )
