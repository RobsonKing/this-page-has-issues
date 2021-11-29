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
import {useEffect, useState} from "react";
import BarLoader from "react-spinners/BarLoader";
import RepoConfig from "./src/components/RepoConfig/RepoConfig";

// todo rmk (20 Nov. 2021):move to apollo file
const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
});

// todo rmk (28 Nov. 2021): cache token look up https://www.apollographql.com/docs/react/api/link/apollo-link-context/
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

const getCurrentUrl = async (): Promise<URL> => {
    const queryOptions = {active: true, currentWindow: true};
    const [tab] = await chrome.tabs.query(queryOptions);
    return new URL(tab.url);
};

const Popup = (): React.FC<null> => {

    // todo rmk (20 Nov. 2021): custom hook
    const [url, setUrl] = useState<URL | null>(null);
    useEffect(() => {
        const getData = async (): Promise<void> => {
            setUrl(await getCurrentUrl());
        };

        // noinspection JSIgnoredPromiseFromCall
        getData();
    }, []);

    // todo rmk (22 Nov. 2021):how to switch ui...
    //  how to show it if
    //   - they want it
    //   - show a default no repos configured... click here!
    // const [repoConfig,] = useState(null);
    // if (!repoConfig) {
    //     return <RepoConfig/>;
    // }
    const [showConfig, setShowConfig] = useState(true);

    // todo rmk (20 Nov. 2021):
    //  render config if set or no token

    const loading = !url;

    if (loading) {
        return <BarLoader loading={true} color='gray' width='100%'/>;
    }

    if (showConfig) {
        return <RepoConfig hide={() => setShowConfig(false)}/>;
    }

    return <ApolloProvider client={client}>
        <Issues url={url} showConfig={() => setShowConfig(true)}/>
    </ApolloProvider>;
};

ReactDOM.render(
    <Popup/>,
    document.getElementById('app')
);
