import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";

const publicLink = createHttpLink({
  uri: "http://localhost:8000/public",
});

const queryLink = createHttpLink({
  uri: "http://localhost:8000/query",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "mutation" &&
      (definition.name?.value === "Register" || definition.name?.value === "Login")
    );
  },
  publicLink,
  authLink.concat(queryLink)
);

const client = new ApolloClient({
  link: ApolloLink.from([splitLink]),
  cache: new InMemoryCache(),
});

export default client;
