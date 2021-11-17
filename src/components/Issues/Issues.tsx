import * as React from "react";
import {githubIssueService} from "../../services/IssueService";
import styles from './style.scss';
import {useEffect, useState} from "react";
import {useQuery, gql} from '@apollo/client';

const query = gql`
    query {
        search(first:5,query:"repo:atvenu/atvenu refund",type:ISSUE){
            nodes{
                ... on Issue{
                    number
                }
            }
        }
    }
`;

interface SearchData {
    search: {
        nodes: [{
            number: number
        }]
    }
}

export default function Issues(): React.FC<null> {
    const [issues, setIssues] = useState([]);

    const {loading, data} = useQuery<SearchData>(
        query
    );
    if (!loading) {
        console.log("*** tada? ***",); // todo rmk (16 Nov. 2021): remove
        data.search.nodes.forEach(node => console.log('?', node.number));
    }


    useEffect(() => {
        const getData = async (): Promise<void> => {
            setIssues(await githubIssueService.getIssuesForCurrentPage());
        };

        // noinspection JSIgnoredPromiseFromCall
        getData();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.title}>Issues</div>
            <div className={styles["issue-list"]}>
                {issues.length === 0 && <div className={styles["issue-warning"]}>No issues found</div>}
                {issues.map((issue) => <div className={styles.issue} key={issue.number}>
                    <div className={issue.isOpen ? styles.open : styles.closed} style={{flex: "1"}}>{issue.number}</div>
                    <div style={{flex: "2"}}>{issue.milestone}</div>
                    <div style={{flex: "5"}}>
                        <a href={issue.url} target="_blank" rel="noreferrer">
                            {issue.title}
                        </a>
                    </div>
                </div>)}
            </div>
        </div>
    );
}
