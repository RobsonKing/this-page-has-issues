import * as React from "react";
import styles from './style.scss';
import BarLoader from "react-spinners/BarLoader";
import {useIssues} from "../../hooks/useIssues";

interface IProps {
    url: URL
    showConfig: () => void
}

export default function Issues({url, showConfig}: IProps): React.FC<IProps> {
    const {loading, issues} = useIssues(url);

    return (
        <div className={styles.container}>
            {loading ? <BarLoader loading={true} color='gray' width='100%'/> :
                <>
                    <div>
                        <button onClick={showConfig}>config...</button>
                    </div>
                    <div className={styles.title}>Issues</div>
                    <div className={styles["issue-list"]}>
                        {issues.length === 0 && <div className={styles["issue-warning"]}>No issues found</div>}
                        {issues.map((issue) => <div className={styles.issue} key={issue.number}>
                            <div className={issue.isOpen ? styles.open : styles.closed}
                                 style={{flex: "1"}}>{issue.number}</div>
                            <div style={{flex: "2"}}>{issue.milestone}</div>
                            <div style={{flex: "5"}}>
                                <a href={issue.url} target="_blank" rel="noreferrer">
                                    {issue.title}
                                </a>
                            </div>
                        </div>)}
                    </div>
                </>
            }
        </div>
    );
}
