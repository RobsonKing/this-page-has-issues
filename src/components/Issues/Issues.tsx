import {h} from 'preact';
import {useEffect, useState} from "preact/hooks";
import {githubIssueService} from "../../services/IssueService";
import styles from './style.scss'

export default function Issues() {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const getData = async () => {
            setIssues(await githubIssueService.getIssuesForCurrentPage());
        }

        // noinspection JSIgnoredPromiseFromCall
        getData();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.title}>Issues</div>
            <div className={styles["issue-list"]}>
                {issues.length === 0 && <div className={styles["issue-warning"]}>No issues found</div>}
                {issues.map((issue) => <div className={styles.issue}>
                    <div className={issue.isOpen ? styles.open : styles.closed} style={{flex: "1"}}>{issue.number}</div>
                    <div style={{flex: "2"}}>{issue.milestone}</div>
                    <div style={{flex: "5"}}>
                        <a href={issue.url} target="_blank">
                            {issue.title}
                        </a>
                    </div>
                </div>)}
            </div>
        </div>
    );
}
