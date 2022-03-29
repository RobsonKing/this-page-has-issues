import {useEffect, useState} from "react";
import {ApolloClient, createHttpLink, gql, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {SearchOption} from "../services/IssueService";

export interface RepoConfig {
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
    apolloClientFactory: (config: RepoConfig) => ApolloClient<any>
}

// Note: Once the Storage API gains promise support, this function
// can be greatly simplified.
function getKeysFromSyncStorage<TConfig>(keys:string[]): Promise<TConfig> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(keys, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
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

function apolloClientFactory(config): ApolloClient<any> {
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
    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    });
}

interface IssueFilter {
    showOpenIssues: boolean
    showClosedIssues: boolean
}
interface SavedSettings {
    loading: boolean
    filters: IssueFilter
    setFilters : (IssueFilter) => void
    searchOption: SearchOption
    setSearchOption: (SearchOption) => void
}

export interface SavedStorageSettings {
    filters: IssueFilter
    searchOption: SearchOption
}

export function useSavedSettings(): SavedSettings {
    const [filters, setFilters] = useState(null);
    const [searchOption, setSearchOption] = useState(null);
    const loading = filters === null || searchOption === null;
    useEffect(() => {
       const getSettingsFromStorage = async (): Promise<void> => {
           let result = await getKeysFromSyncStorage<SavedStorageSettings>(["filters","searchOption"]);
           if (!result || Object.keys(result).length === 0) {
               result = { };
           }
           setFilters(result.filters || {
                   showOpenIssues: true,
                   showClosedIssues: false
               });
           setSearchOption(result.searchOption || SearchOption.FULL);
       };

       // noinspection JSIgnoredPromiseFromCall
       getSettingsFromStorage();
    },[]);

    const saveSearchOption = (value: SearchOption): void => {
        chrome.storage.sync.set({searchOption: value}, () => {
            setSearchOption(value);
        });
    };
    const saveSearchFilters = (value: IssueFilter): void => {
        chrome.storage.sync.set({filters: value}, () => {
            setFilters(value);
        });
    };

    return {
        loading,
        filters,
        setFilters: saveSearchFilters,
        searchOption,
        setSearchOption: saveSearchOption,
    };
}

export function useRepoConfig(): RepoConfigResult {
    const [config, setConfig] = useState(null);
    const isConfigLoading = config === null;
    useEffect(() => {
        const getConfig = async (): Promise<void> => {
            let result = await getKeysFromSyncStorage<RepoConfig>(["repo","token"]);
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
            const client = apolloClientFactory(config);
            client.query({query: TEST_QUERY, variables: {query: `repo:${config.repo}`}}).then(() => {
                setIsConfigValid(RepoConfigState.VALID);
                return true;
            }).catch((error) => {
                console.log("Failure to query:", error);
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
        isConfigValid,
        apolloClientFactory
    };
}
