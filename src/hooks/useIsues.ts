import {gql, useQuery} from "@apollo/client";
import {IssueModel} from "../services/IssueService";

const query = gql`
    query getIssues($first : Int!, $query: String!){
        search(first: $first, query: $query, type:ISSUE){
            nodes{
                ... on Issue{
                    number
                }
            }
        }
    }
`;

interface IssueVars {
    first: number
    query: string
}

interface SearchData {
    search: {
        nodes: [{
            number: number
        }]
    }
}

export const useIssues = (): { loading: boolean; issues: IssueModel[] } => {

    // get query from somewhere
    const {loading, data, error} = useQuery<SearchData, IssueVars>(
        query,
        {variables: {first: 10, query: "repo:atvenu/atvenu refund"}}
    );
    // todo rmk (18 Nov. 2021):do something with error!
    console.log("*** error ***", error); // todo rmk (18 Nov. 2021): remove
    let issues = [];
    if (!loading) {
        console.log("*** data ***", data); // todo rmk (18 Nov. 2021): remove
        issues = data.search.nodes.map(issue => new IssueModel(issue));
    }

    // todo rmk (18 Nov. 2021): return not configured
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
