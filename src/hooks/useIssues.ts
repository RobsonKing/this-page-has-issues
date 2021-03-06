import {useLazyQuery} from "@apollo/client";
import IssueService, {SearchOption} from "../services/IssueService";
import IssueModel from "../models/IssueModel";
import {GetIssues, GetIssuesVariables} from "../services/__generated__/getIssues";
import {useEffect, useState} from "react";
import {useSavedSettings} from "./useRepoConfig";

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
    loadingMore: boolean
    issues: IssueModel[]
    filters: Filters
    search: string
    hasMore: boolean
    fetchMore: () => void
}

export const useIssues = (url: URL, repo: string): Return => {
    let issues = [];
    let hasMore = false;
    const [loadingMore, setLoadingMore] = useState(false);
    const issueService = new IssueService();
    const {loading: settingLoading, filters, setFilters, searchOption, setSearchOption} = useSavedSettings();
    const [loadIssues, {called, loading, data, error, fetchMore}] = useLazyQuery<GetIssues, GetIssuesVariables>(
        issueService.getIssueQueryForCurrentPage(),
        {
            fetchPolicy: "network-only" // !!! don't use the cache... always go to server
        }
    );
    useEffect(() => {
        if (!settingLoading) {
            loadIssues({variables: issueService.getQueryParams(url, repo, filters, searchOption)});
        }
    }, [settingLoading, filters, searchOption]);

    if (error) {
        console.log("Failed to query", error);
    } else if (called && !loading) {
        hasMore = data.search.pageInfo.hasNextPage;
        issues = data.search.edges.map(edge => new IssueModel(edge.node));
    }

    const isLoading = loading || settingLoading;
    return {
        loading: isLoading,
        loadingMore,
        issues,
        hasMore,
        fetchMore: async () => {
            setLoadingMore(true);
            await fetchMore({
                variables: {
                    cursor: data.search.pageInfo.endCursor,
                },
            });
            setLoadingMore(false);
        },
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
        search: isLoading ? "" : issueService.getQueryParamsAsString(url, repo, filters, searchOption),
    };
};

