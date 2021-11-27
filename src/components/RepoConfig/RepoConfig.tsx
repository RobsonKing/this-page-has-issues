import * as React from "react";
import {Form, Formik, Field} from 'formik';
import {useEffect, useState} from "react";
import BarLoader from "react-spinners/BarLoader";
import styles from './style.scss';

interface IProps {
    hide: () => void
}

interface ConfigFormValues {
    repo: string
    token: string
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

export default function RepoConfig({hide}: IProps): React.FC<IProps> {

    const [config, setConfig] = useState(null);

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


    return config ?
        <div className={styles.container}>
            <div className={styles.title}>Configure Repository</div>

            <Formik
                initialValues={config}
                onSubmit={(values, actions) => {
                    chrome.storage.sync.set(values);
                    actions.setSubmitting(false);
                }}
            >
                <Form>
                    <div className={styles['form-container']}>
                        <label htmlFor="repo">Repository</label>
                        <Field id="repo" name="repo" placeholder="Repository"/>
                        <span/>

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

        </div>
        :
        <BarLoader loading={true} color='gray' width='100%'/>;
}
