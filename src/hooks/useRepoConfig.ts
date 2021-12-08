import {useEffect, useState} from "react";
import {ApolloClient, createHttpLink, gql, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";

interface RepoConfig {
    repo: string
    token: string
}

export enum RepoConfigState {
    VALID = "VALID",
    INVALID = "INVALID",
    TESTING = "TESTING"
}

interface RepoConfigResult {
    config: RepoConfig
    isConfigLoading: boolean
    saveAndTestConfig: (values: RepoConfig) => void
    isConfigValid: RepoConfigState
}

// Reads all data out of storage.sync and exposes it via a promise.
//
// Note: Once the Storage API gains promise support, this function
// can be greatly simplified.
function getAllStorageSyncData<TConfig>(): Promise<TConfig> {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(null, (items) => {
            // Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // Pass the data retrieved from storage down the promise chain.
            resolve(items);
        });
    });
}

const TEST_QUERY = gql`
    query testQuery($query: String!) {
        search(first:5,query: $query,type:ISSUE){
            nodes{
                __typename
            }
        }
    }
`;

export function useRepoConfig(): RepoConfigResult {
    const [config, setConfig] = useState(null);
    const isConfigLoading = config === null;
    useEffect(() => {
        const getConfig = async (): Promise<void> => {
            let result = await getAllStorageSyncData<RepoConfig>();
            console.log("*** getAllStorageSyncData ***", result); // todo rmk (25 Nov. 2021): remove
            if (!result || Object.keys(result).length === 0) {
                result = {repo: '', token: ''};
            }
            setConfig(result);
        };

        // noinspection JSIgnoredPromiseFromCall
        getConfig();
    }, []);

    const [isConfigValid, setIsConfigValid] = useState(RepoConfigState.TESTING);
    useEffect(() => {
        setIsConfigValid(RepoConfigState.TESTING);
        if (!isConfigLoading) {
            // todo rmk (28 Nov. 2021): can we pull this into another hook?
            //  - or maybe just a helper function
            const httpLink = createHttpLink({
                uri: 'https://api.github.com/graphql',
            });
            const authLink = setContext((_, {headers}) => {
                return {
                    headers: {
                        ...headers,
                        authorization: `Bearer ${config.token}`,
                    }
                };
            });
            // todo rmk (28 Nov. 2021): should the hook return an apollo client?
            //  - just return the variable?
            const client = new ApolloClient({
                link: authLink.concat(httpLink),
                cache: new InMemoryCache()
            });

            client.query({query: TEST_QUERY, variables: {query: `repo:${config.repo}`}}).then((results) => {
                console.log("*** success ***", results); // todo rmk (28 Nov. 2021): remove
                setIsConfigValid(RepoConfigState.VALID);
                return true;
            }).catch((error) => {
                console.log("*** failure ***", error); // todo rmk (28 Nov. 2021): remove
                setIsConfigValid(RepoConfigState.INVALID);
            });
        }
    }, [config]);

    const saveAndTestConfig = (values: RepoConfig): void => {
        chrome.storage.sync.set(values, () => {
            setConfig(values);
        });
    };

    return {
        config,
        isConfigLoading,
        saveAndTestConfig,
        isConfigValid
    };
}
