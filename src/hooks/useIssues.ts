import {useQuery} from "@apollo/client";
import IssueService from "../services/IssueService";
import IssueModel from "../models/IssueModel";
import {GetIssues, GetIssues_search_nodes_Issue, GetIssuesVariables} from "../services/__generated__/getIssues";

export const useIssues = (url: URL): { loading: boolean; issues: IssueModel[] } => {
    let issues = [];
    const issueService = new IssueService();

    const {loading, data, error} = useQuery<GetIssues, GetIssuesVariables>(
        issueService.getIssueQueryForCurrentPage(),
        {variables: issueService.getQueryParams(url)}
    );
    if (error) {
        console.log("Failed to query", error);
    } else if (!loading) {
        issues = data.search.nodes.map(issue => new IssueModel(<GetIssues_search_nodes_Issue>issue));
    }

    return {loading, issues};
};

