import * as ReactDOM from "react-dom";
import * as React from "react";
import Issues from "./src/components/Issues/Issues";
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    ApolloProvider,
    gql
} from "@apollo/client";
import {setContext} from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
});

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

const query = gql`
    query {
        search(first:5,query:"repo:atvenu/atvenu refund",type:ISSUE){
            nodes{
                __typename
                ... on Issue{
                    number
                }
            }
        }
    }
`;

setTimeout(() => {
    console.log("*** client ***", client, query); // todo rmk (16 Nov. 2021): remove
    client.query({query})
        .then(result => console.log(result)).catch(error => console.log(error));
}, 5000);


ReactDOM.render(
    <ApolloProvider client={client}>
        <div>
            <Issues/>
        </div>
    </ApolloProvider>,
    document.getElementById('app')
);
