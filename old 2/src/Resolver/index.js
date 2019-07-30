import { graphql, GraphQLSchema, GraphQLObjectType } from "graphql";
import graphQLHTTP from "express-graphql";
import Framework from "../../Framework";
import { type HTTPHandle } from "../../DataAccessLayer/HTTPServerFactory";
import { type AMQPHandle } from "../../DataAccessLayer/MessageBroker";

export type ResolverConfig = {
  route: string
};

export interface IResolver {
  constructor(framework: Framework, config?: ResolverConfig): void;
  resolve(args: {
    query: string,
    rootValue?: ?any,
    contextValue?: ?any,
    variableValues?: ?{ [key: string]: any }
  }): Promise<mixed>;
}

export class Resolver implements IResolver {
  config: ResolverConfig;
  queries: ?Array<GraphQLObjectType>;
  mutations: ?Array<GraphQLObjectType>;
  constructor(framework: Framework, config?: ResolverConfig): void {
    this.config = config;
    this.queries = [];
    this.mutations = [];
    const domain = framework.getDomain();
    Object.values(domain).forEach(resource => {
      this.queries.push(...resource.queries);
      this.mutations.push(...resource.mutations);
    });
    const services = framework.getServices(Resolver.name);
    if (framework.mode === "server") {
      const http = services.http();
      http.use(`/${this.config.route}`, this.HTTPhandler());
    } else if (framework.mode === "worker") {
      const mb = services.mb();
      mb.use(`/${this.config.route}`, this.AMQPHandler());
    }
  }
  get schema(): GraphQLSchema {
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: { ...this.queries }
      }),
      mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: { ...this.mutations }
      })
    });
  }
  HTTPhandler(): HTTPHandle {
    return graphQLHTTP({
      schema: this.schema,
      graphiql: true,
      pretty: true
    });
  }
  AMQPHandler(): AMQPHandle {
    return async function handler(req, next) {
      const body = JSON.parse(req.content.toString());
      req.response = await this.resolve({
        query: body.query,
        contextValue: req.context,
        variableValues: body.variables
      });
      next();
    };
  }
  resolve(args: {
    query: string,
    rootValue?: ?any,
    contextValue?: ?any,
    variableValues?: ?{ [key: string]: any }
  }): Promise<mixed> {
    const { query, rootValue, contextValue, variableValues } = args;
    return graphql(this.schema, query, rootValue, contextValue, variableValues);
  }
}
