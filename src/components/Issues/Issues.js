import {h} from 'preact';
import {useEffect, useState} from "preact/hooks";
import {githubIssueService} from "../../services/IssueService";
import style from './style.scss'

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
        <div className='container'>
            <div className='title'>Issues</div>
            <div className='issue-list'>
                {issues.length === 0 && <div className='issue-warning'>No issues found</div>}
                {issues.map((issue) => <div className='issue'>
                    <div className={issue.isOpen ? 'open' : 'closed'} style={{flex: "1"}}>{issue.number}</div>
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
