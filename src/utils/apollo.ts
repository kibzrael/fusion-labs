import type { EmailJob } from "@/types/email";
import prisma from "@/utils/prisma.js";
import queue from "@/utils/queue.js";
import { parseResolveInfo } from "graphql-parse-resolve-info";

export const schema = `#graphql
  type User {
    id: Int!
    email: String!
    name: String!
  }

  type Laptop {
    id: Int!
    model: String
    brand: String
    price: Float
    purchases: [Purchase]
  }

  type Purchase {
    id: Int!
    userId: Int
    user: User
    laptopId: Int
    laptop: Laptop
    amount: Float
    status: String
    notifications: [EmailNotification]
  }

  type EmailNotification {
    id: Int!
    email: String
    user: User
    purchaseId: Int
    purchase: Purchase
    type: String
  }

  type Query {
    user(id: Int!): User
    laptops: [Laptop]
    laptop(id: Int!): Laptop
    purchases(userId: Int!): [Purchase]
    notifications: [EmailNotification]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    createLaptop(model: String!, brand: String!, price: Float!): Laptop
    purchaseLaptop(userId: Int!, laptopId: Int!, amount: Float!): Purchase
    deliverLaptop(purchaseId: Int!): Purchase
  }
`;

const requestFields = (info: any, type: string) => {
  const parsedInfo = parseResolveInfo(info);
  const fields = parsedInfo.fieldsByTypeName[type];
  return fields;
};

const hasField = (info: any, type: string, field: string) => {
  const fields = requestFields(info, type);
  return Boolean(fields[field]);
};

const emailQueue = queue("email-notifications");

export const resolvers = {
  Query: {
    user: (parent, { id }) => prisma.user.findUnique({ where: { id } }),
    laptops: (parent, args, context, info) => {
      const fetchPurchases = hasField(info, "Laptop", "purchases");
      return prisma.laptop.findMany({ include: { purchases: fetchPurchases } });
    },
    laptop: (parent, { id }, context, info) => {
      const fetchPurchases = hasField(info, "Laptop", "purchases");

      return prisma.laptop.findUnique({
        where: { id },
        include: { purchases: fetchPurchases },
      });
    },
    purchases: (parent, { userId }, context, info) => {
      const fields = requestFields(info, "Purchase");

      return prisma.purchase.findMany({
        where: { userId },
        include: {
          notifications: Boolean(fields["notifications"]),
          laptop: Boolean(fields["laptop"]),
          user: Boolean(fields["user"]),
        },
      });
    },
    notifications: (parent, args, context, info) => {
      const fields = requestFields(info, "EmailNotification");
      return prisma.emailNotification.findMany({
        include: {
          purchase: Boolean(fields["purchase"]),
          user: Boolean(fields["user"]),
        },
      });
    },
  },

  Mutation: {
    createUser: (parent, { name, email }) =>
      prisma.user.create({ data: { name, email } }),
    createLaptop: (parent, { model, brand, price }) =>
      prisma.laptop.create({ data: { model, brand, price } }),
    purchaseLaptop: async (parent, { userId, laptopId, amount }) => {
      const purchase = await prisma.purchase.create({
        data: { userId, laptopId, amount },
        include: {
          user: true,
          laptop: true,
        },
      });
      emailQueue.add("confirmation-email", {
        email: purchase.user.email,
        model: purchase.laptop.model,
        purchaseId: purchase.id,
        type: "confirmation",
      } as EmailJob);
      return purchase;
    },
    deliverLaptop: async (parent, { purchaseId }) => {
      const purchase = await prisma.purchase.update({
        where: { id: purchaseId },
        data: { status: "delivered" },
        include: {
          user: true,
          laptop: true,
        },
      });

      emailQueue.add("delivery-email", {
        email: purchase.user.email,
        model: purchase.laptop.model,
        purchaseId: purchase.id,
        type: "delivery",
      } as EmailJob);

      return purchase;
    },
  },
};
