import * as React from "react";
import {Form, Formik, Field} from 'formik';
import {useEffect, useState} from "react";
import {PulseLoader, BarLoader} from "react-spinners";
import styles from './style.scss';
import {ApolloClient, createHttpLink, gql, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";

// todo rmk (28 Nov. 2021):what is the convention I or no I
interface IProps {
    hide: () => void
}

// todo: names suck
interface ConfigFormValues {
    repo: string
    token: string
}

enum IssueState {
    VALID = "CLOSED",
    INVALID = "OPEN",
    TESTING = "TESTING"
}

interface RepoConfig {
    config: ConfigFormValues
    isLoadingConfig: boolean
    saveConfig: (values: ConfigFormValues) => void
    isConfigValid: IssueState
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

function useRepoConfig(): RepoConfig {
    const [config, setConfig] = useState(null);
    const isLoadingConfig = config === null;
    useEffect(() => {
        const getConfig = async (): Promise<void> => {
            let result = await getAllStorageSyncData<ConfigFormValues>();
            console.log("*** getAllStorageSyncData ***", result); // todo rmk (25 Nov. 2021): remove
            if (!result || Object.keys(result).length === 0) {
                result = {repo: '', token: ''};
            }
            setConfig(result);
        };

        // noinspection JSIgnoredPromiseFromCall
        getConfig();
    }, []);

    const [isConfigValid, setIsConfigValid] = useState(IssueState.TESTING);
    useEffect(() => {
        setIsConfigValid(IssueState.TESTING);
        if (!isLoadingConfig) {
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

            // todo rmk (28 Nov. 2021): extract this and use params
            const query = gql`
                query {
                    search(first:5,query:"repo:${config.repo}",type:ISSUE){
                        nodes{
                            __typename
                        }
                    }
                }
            `;

            client.query({query}).then((results) => {
                console.log("*** success ***", results); // todo rmk (28 Nov. 2021): remove
                setIsConfigValid(IssueState.VALID);
                return true;
            }).catch((error) => {
                console.log("*** failure ***", error); // todo rmk (28 Nov. 2021): remove
                setIsConfigValid(IssueState.INVALID);
            });

        }

    }, [config]);

    // todo rmk (28 Nov. 2021):rename to save and test?
    const saveConfig = (values: ConfigFormValues): void => {
        chrome.storage.sync.set(values);
        // todo rmk (28 Nov. 2021):only do this on success
        setConfig(values);
    };

    // todo rmk (26 Nov. 2021): pull function out? add to hook?
    //  -use call back to indicate save worked
    //  -export a test functions and a isValid
    //  -maybe add a save and test?
    //  -how to use apollo to test here...
    return {
        config,
        isLoadingConfig,
        saveConfig,
        isConfigValid
    };
}

export default function RepoConfig({hide}: IProps): React.FC<IProps> {

    const {config, isLoadingConfig, isConfigValid, saveConfig} = useRepoConfig();

    return isLoadingConfig ?
        <BarLoader loading={true} color='gray' width='100%'/>
        :
        <div className={styles.container}>
            <div className={styles.title}>Configure Repository</div>

            <Formik
                initialValues={config}
                onSubmit={(values, actions) => {
                    saveConfig(values);
                    actions.setSubmitting(false);
                }}
            >
                <Form>
                    <div className={styles['form-container']}>
                        <label htmlFor="repo">Repository</label>
                        <Field id="repo" name="repo" placeholder="Repository"/>
                        {isConfigValid === IssueState.VALID && <span>✅</span>}
                        {isConfigValid === IssueState.INVALID && <span>❌</span>}
                        {isConfigValid === IssueState.TESTING && <PulseLoader color='gray'/>}
                        <label htmlFor="token">Token</label>
                        <Field id="token" name="token" placeholder="Token"/>
                        <span>
                            <button type="submit">Test</button>
                            <button type="submit">Save</button>
                        </span>
                    </div>
                </Form>
            </Formik>

            <div className={styles.footer}>
                <button onClick={hide}>Done</button>
            </div>

        </div>;
}
