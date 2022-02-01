import {useQuery} from "@apollo/client";
import IssueService from "../services/IssueService";
import IssueModel from "../models/IssueModel";
import {GetIssues, GetIssues_search_nodes_Issue, GetIssuesVariables} from "../services/__generated__/getIssues";
import {useState} from "react";

export interface Filters {
    showOpenIssues: boolean
    showClosedIssues: boolean
    setOpenFilter: (boolean) => void
    setClosedFilter: (boolean) => void

    searchOption: SearchOption
    setSearchOption: (SearchOption) => void
}

interface Return {
    loading: boolean
    issues: IssueModel[]
    filters: Filters
    search: string
}

export enum SearchOption {
    PARTIAL = "partial",
    FULL = "full",
}

export const useIssues = (url: URL): Return => {
    let issues = [];
    const issueService = new IssueService();
    const [filters, setFilters] = useState({
        showOpenIssues: true,
        showClosedIssues: true
    });
    const [searchOption, setSearchOption] = useState(SearchOption.FULL);

    const {loading, data, error} = useQuery<GetIssues, GetIssuesVariables>(
        issueService.getIssueQueryForCurrentPage(),
        {variables: issueService.getQueryParams(url, filters)}
    );
    if (error) {
        console.log("Failed to query", error);
    } else if (!loading) {
        issues = data.search.nodes.map(issue => new IssueModel(<GetIssues_search_nodes_Issue>issue));
    }

    return {
        loading,
        issues,
        filters: {
            ...filters,
            setOpenFilter: (value) => setFilters({
                ...filters,
                showOpenIssues: value
            }),
            setClosedFilter: (value) => setFilters({
                ...filters,
                showClosedIssues: value
            }),
            searchOption,
            setSearchOption
        },
        search: issueService.getQueryParamsAsString(url, filters),
    };
};

