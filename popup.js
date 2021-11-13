import "core-js/stable";
import "regenerator-runtime/runtime";

import {render, h} from 'preact';
import {useEffect, useState} from "preact/hooks";
import {githubIssueService} from "./src/services/IssueService";

function Issues() {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const getData = async () => {
            setIssues(await githubIssueService.getIssuesForCurrentPage());
        }

        // noinspection JSIgnoredPromiseFromCall
        getData();
    }, []);

    return (
        <div style={{display: 'flex', flexDirection: "column", width: 600}}>
            <div style={{fontWeight: "Bold", fontsize: "20"}}>Issues</div>
            <div style={{display: 'flex', flexDirection: "column"}}>
                {issues.length === 0 && <div style={{color: 'orange', fontStyle: 'italic'}}>No issues found</div>}
                {issues.map((issue) => <div style={{
                    display: 'flex',
                    flexDirection: "row",
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: 'lightgrey',
                    padding: 5,
                }}>
                    <div style={{flex: "1", color: issue.isOpen ? 'green' : 'purple'}}>{issue.number}</div>
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

render(
    <div>
        <Issues/>
    </div>,
    document.getElementById('app')
);
