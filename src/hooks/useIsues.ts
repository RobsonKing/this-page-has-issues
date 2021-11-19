import {gql, useQuery} from "@apollo/client";
import {IssueModel} from "../services/IssueService";

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

export const useIssues = (): { loading: boolean; issues: IssueModel[] } => {
    const {loading, data} = useQuery<SearchData>(
        query
    );
    let issues = [];
    if (!loading) {
        issues = data.search.nodes.map(issue => new IssueModel(issue));
    }

    return {loading, issues};
};


// useEffect(() => {
//     const getData = async (): Promise<void> => {
//         setIssues(await githubIssueService.getIssuesForCurrentPage());
//     };
//
//     // noinspection JSIgnoredPromiseFromCall
//     getData();
// }, []);
