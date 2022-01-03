import * as React from "react";
import styles from './style.scss';
import BarLoader from "react-spinners/BarLoader";
import {useIssues} from "../../hooks/useIssues";
import ReactTooltip from "react-tooltip";
import classNames from "classnames";
import {RepoConfig} from "../../hooks/useRepoConfig";

interface Props {
    url: URL
    showConfig: () => void
    config: RepoConfig
}

const SINGLE_COLUMN = 'issue-single-col';
const IssueHeader = (): React.FC => {
    return <div className={styles.header}>
        <span className={styles[SINGLE_COLUMN]}>Issue Number</span>
        <span className={styles[SINGLE_COLUMN]}>Author</span>
        <span className={styles['issue-double-col']}>Milestone</span>
        <span className={styles['issue-title']}>Title</span>
    </div>;
};

export default function Issues({url, showConfig, config}: Props): React.FC<Props> {
    const {loading, issues, filters, search, setOpenFilter, setClosedFilter} = useIssues(url);

    return (
        <div className={styles.container}>
            {loading ? <BarLoader loading={true} color='gray' width='100%'/> :
                <>
                    <div>
                        <button onClick={showConfig}>config...</button>
                    </div>
                    <div className={styles.title}>Issues</div>

                    <ReactTooltip id='openIssue' type="warning" effect="solid" place="right">
                        Issue is open
                    </ReactTooltip>
                    <ReactTooltip id='closedIssue' type="success" effect="solid" place="right">
                        Issue is closed
                    </ReactTooltip>

                    {/*todo create component for filters*/}
                    <div>
                        <label>
                            Open
                            <input
                                name="open"
                                type="checkbox"
                                checked={filters.showOpenIssues}
                                onChange={(event) => {
                                    setOpenFilter(event.target.checked);
                                }}/>
                        </label>
                        <label>
                            Closed
                            <input
                                name="closed"
                                type="checkbox"
                                checked={filters.showClosedIssues}
                                onChange={(event) => {
                                    setClosedFilter(event.target.checked);
                                }}/>
                        </label>
                    </div>
                    <div className={styles["issue-list"]}>
                        <IssueHeader/>
                        {issues.length === 0 && <div className={styles["issue-warning"]}>No issues found</div>}
                        {issues.map((issue) => <div className={styles.issue} key={issue.number}>
                            <div
                                data-tip data-for={issue.isOpen ? 'openIssue' : 'closedIssue'}
                                className={classNames([issue.isOpen ? styles.open : styles.closed, styles[SINGLE_COLUMN]])}>
                                {issue.number}
                            </div>
                            <div className={styles[SINGLE_COLUMN]}>
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
                            <div className={styles['issue-double-col']}>{issue.milestone}</div>
                            <div className={styles['issue-title']}>
                                <a href={issue.url} target="_blank" rel="noreferrer">
                                    {issue.title}
                                </a>
                            </div>
                        </div>)}
                        <div style={{
                            flex: 6, padding: 10,
                        }}>
                            <span>
                                Search on <a
                                target="_blank" rel="noreferrer"
                                href={`https://github.com/${config.repo}/issues?q=${search}`}>github</a>
                            </span>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}
