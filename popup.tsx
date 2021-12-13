import * as ReactDOM from "react-dom";
import * as React from "react";
// import {
//     ApolloClient,
//     InMemoryCache,
//     createHttpLink,
// } from "@apollo/client";
// import {setContext} from '@apollo/client/link/context';
import {useState} from "react";
import RepoConfig from "./src/components/RepoConfig/RepoConfig";
import IssuesBrowser from "./src/components/IssuesBrowser/IssuesBrowser";

// todo rmk (20 Nov. 2021):move to apollo file
// const httpLink = createHttpLink({
//     uri: 'https://api.github.com/graphql',
// });

// todo rmk (28 Nov. 2021): cache token look up https://www.apollographql.com/docs/react/api/link/apollo-link-context/
// todo rmk (18 Nov. 2021): get this from storage somehow...
// const token = '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';
// const authLink = setContext((_, {headers}) => {
//     // get the authentication token from local storage if it exists
//     // const token = localStorage.getItem('token');
//     // return the headers to the context so httpLink can read them
//     return {
//         headers: {
//             ...headers,
//             authorization: `Bearer ${token}`,
//         }
//     };
// });

// const client = new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache()
// });

const Popup = (): React.FC<null> => {
    const [showConfig, setShowConfig] = useState(false);

    if (showConfig) {
        return <RepoConfig hide={() => setShowConfig(false)}/>;
    }
    return <IssuesBrowser showConfig={() => setShowConfig(true)}/>;
};

ReactDOM.render(
    <Popup/>,
    document.getElementById('app')
);
