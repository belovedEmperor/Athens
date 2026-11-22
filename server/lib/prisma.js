import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const objIsEmpty = (obj) => Object.keys(obj).length === 0;
const updatedNothing = (data) => data.length === 0;

export { prisma, objIsEmpty, updatedNothing };
