import * as React from "react";
import {Form, Formik, Field} from 'formik';
import {PulseLoader, BarLoader} from "react-spinners";
import styles from './style.scss';
import {RepoConfigState, useRepoConfig} from "../../hooks/useRepoConfig";
import ReactTooltip from 'react-tooltip';

interface Props {
    hide: () => void
}

export default function RepoConfig({hide}: Props): React.FC<Props> {
    const {config, isConfigLoading, isConfigValid, saveAndTestConfig} = useRepoConfig();

    return isConfigLoading ?
        <BarLoader loading={true} color='gray' width='100%'/>
        :
        <div className={styles.container}>
            <div className={styles.title}>Configure Repository</div>
            <Formik
                initialValues={config}
                onSubmit={(values, actions) => {
                    saveAndTestConfig(values);
                    actions.setSubmitting(false);
                }}
            >
                <Form>
                    <div className={styles['form-container']}>
                        <label htmlFor="repo">Repository</label>
                        <Field id="repo" name="repo" placeholder="Repository"/>
                        {isConfigValid === RepoConfigState.VALID && <>
                            <ReactTooltip type="success" effect="solid" place="right"/>
                            <span data-tip="Valid token">✅</span>
                        </>}
                        {isConfigValid === RepoConfigState.INVALID && <>
                            <ReactTooltip type="error" effect="solid" place="right"/>
                            <span data-tip="Invalid token">❌</span>
                        </>}
                        {isConfigValid === RepoConfigState.TESTING && <PulseLoader color='gray'/>}
                        <label htmlFor="token">Token <span data-tip data-for='tokenHelp'>❓</span></label>
                        <ReactTooltip id='tokenHelp' delayHide={1000} className={styles["stay-on-hover"]} type="info"
                                      effect="solid"
                                      place="right">
                            <span>For information on Github token see <a
                                target="_blank" rel="noreferrer"
                                href='https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token'>here</a></span>
                        </ReactTooltip>
                        <Field id="token" name="token" placeholder="Token"/>
                        <span>
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
