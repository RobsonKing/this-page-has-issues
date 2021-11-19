import * as ReactDOM from "react-dom";
import * as React from "react";
import Issues from "./src/components/Issues/Issues";
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    ApolloProvider,
} from "@apollo/client";
import {setContext} from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
});

// todo rmk (18 Nov. 2021): get this from storage somehow...
const token = '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';
const authLink = setContext((_, {headers}) => {
    // get the authentication token from local storage if it exists
    // const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        }
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Issues/>
    </ApolloProvider>,
    document.getElementById('app')
);
