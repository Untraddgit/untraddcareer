import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

export async function setupGraphQL(app: any) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: req.auth?.userId || null })
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  
}
