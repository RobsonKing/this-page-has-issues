import * as React from "react";
import styles from './style.scss';
import BarLoader from "react-spinners/BarLoader";
import {useIssues} from "../../hooks/useIssues";
import ReactTooltip from "react-tooltip";

interface Props {
    url: URL
    showConfig: () => void
}

export default function Issues({url, showConfig}: Props): React.FC<Props> {
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
                            <div style={{flex: "1"}}>
                                <ReactTooltip id={`tooltip_${issue.number}`}
                                              type="info"
                                              effect="solid"
                                              place="right">
                                    {issue.author}
                                </ReactTooltip>
                                <img className={styles.avatar} src={issue.avatarUrl}
                                     alt={`Avatar for ${issue.author}`}
                                     data-tip data-for={`tooltip_${issue.number}`}/>
                            </div>
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
