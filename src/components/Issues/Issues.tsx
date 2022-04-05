import * as React from "react";
import styles from './style.scss';
import BarLoader from "react-spinners/BarLoader";
import {useIssues} from "../../hooks/useIssues";
import ReactTooltip from "react-tooltip";
import {RepoConfig} from "../../hooks/useRepoConfig";
import {FilterBar} from "../FilterBar/FilterBar";
import NewIssueButtons from "../NewIssuesButtons/NewIssueButtons";
import classNames from "classnames";

interface Props {
    url: URL
    showConfig: () => void
    config: RepoConfig
}

export default function Issues({url, showConfig, config}: Props): React.FC<Props> {
    const {loading, loadingMore, issues, filters, search, hasMore, fetchMore} = useIssues(url, config.repo);
    return (
        <div className={styles.container}>
            {loading ? <BarLoader loading={true} color='gray' width='100%'/> :
                <>
                    <div>
                        <h1>This Page Has Issues
                            <button style={{marginLeft: 25}} onClick={showConfig}>Config...</button>
                        </h1>
                    </div>

                    <ReactTooltip id='openIssue' type="warning" effect="solid" place="right">
                        Issue is open
                    </ReactTooltip>
                    <ReactTooltip id='closedIssue' type="success" effect="solid" place="right">
                        Issue is closed
                    </ReactTooltip>

                    <FilterBar filters={filters}/>
                    <div className={styles["issue-list"]}>
                        {issues.length === 0 && <div className={styles["issue-warning"]}>No issues found</div>}
                        {issues.map((issue) => <div className={styles.issue} key={issue.number}>
                            <div className={styles['issue-title']}>
                                <a href={issue.url} target="_blank" rel="noreferrer">
                                    {issue.title}
                                </a>
                            </div>
                            <div className={styles.issueDetails}>
                                <div
                                    data-tip data-for={issue.isOpen ? 'openIssue' : 'closedIssue'}
                                    className={classNames([issue.isOpen ? styles.open : styles.closed])}>
                                    {issue.number}
                                </div>
                                <span>{` opened by ${issue.author}, currently in ${issue.milestone}`}</span>
                                {issue.firstAssigneeLogin && `assigned to ${issue.firstAssigneeLogin}`}
                            </div>

                        </div>)}
                    </div>
                    {hasMore && !loadingMore && <button disabled={!hasMore} onClick={fetchMore}>Fetch more</button>}
                    {loadingMore && <BarLoader loading={true} color='gray' width='100%'/>}
                    <div className={styles.footer}>
                         <span>
                                Search on <a
                             target="_blank" rel="noreferrer"
                             href={`https://github.com/${config.repo}/issues?q=${search}`}>github</a>
                            </span>
                        <NewIssueButtons config={config} url={url}/>
                    </div>
                </>
            }
        </div>
    );
}
