import {useQuery} from "@apollo/client";
import IssueService from "../services/IssueService";
import IssueModel, {GithubIssue} from "../models/IssueModel";

interface IssueVars {
    first: number
    query: string
}

// todo rmk (20 Nov. 2021): cam we get rid pf these
interface SearchData {
    search: {
        nodes: GithubIssue[]
    }
}

export const useIssues = (url: URL): { loading: boolean; issues: IssueModel[] } => {
    let issues = [];
    const issueService = new IssueService();

    const {loading, data, error} = useQuery<SearchData, IssueVars>(
        issueService.getIssueQueryForCurrentPage(),
        {variables: issueService.getQueryParams(url)}
    );
    if (error) {
        console.log("Failed to query", error);
    } else if (!loading) {
        issues = data.search.nodes.map(issue => new IssueModel(issue));
    }

    return {loading, issues};
};

