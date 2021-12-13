import * as React from "react";
import {useEffect, useState} from "react";
import BarLoader from "react-spinners/BarLoader";
import {ApolloProvider} from "@apollo/client";
import Issues from "../Issues/Issues";
import {RepoConfigState, useRepoConfig} from "../../hooks/useRepoConfig";
import InvalidConfig from "../InvalidConfig/InvalidConfig";

interface Props {
    showConfig: () => void
}

const getCurrentUrl = async (): Promise<URL> => {
    const queryOptions = {active: true, currentWindow: true};
    const [tab] = await chrome.tabs.query(queryOptions);
    return new URL(tab.url);
};

export default function IssuesBrowser({showConfig}: Props): React.FC<Props> {
    const [url, setUrl] = useState<URL | null>(null);
    const {config, isConfigLoading, isConfigValid, apolloClientFactory} = useRepoConfig();

    console.log("*** isConfigValid ***", isConfigValid); // todo rmk (12 Dec. 2021): remove
    useEffect(() => {
        const getData = async (): Promise<void> => {
            setUrl(await getCurrentUrl());
        };

        // noinspection JSIgnoredPromiseFromCall
        getData();
    }, []);

    const loadingUrl = !url;
    if (loadingUrl || isConfigLoading) {
        return <BarLoader loading={true} color='gray' width='100%'/>;
    }
    if (isConfigValid === RepoConfigState.INVALID) {
        return <InvalidConfig showConfig={showConfig}/>;
    }

    return <ApolloProvider client={apolloClientFactory(config)}>
        <Issues url={url} showConfig={showConfig}/>
    </ApolloProvider>;
}
