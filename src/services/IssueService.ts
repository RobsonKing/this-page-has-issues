import {DocumentNode, gql} from "@apollo/client";

const PAGE = "*PAGE*";
//https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests
// todo rmk (10 Nov. 2021): is:open  OPTIONAL ARGUMENTS!
// todo rmk (10 Nov. 2021):sort https://docs.github.com/en/search-github/getting-started-with-searching-on-github/sorting-search-results
// todo rmk (09 Nov. 2021): page info?
// todo rmk (10 Nov. 2021):is there a better way to build the url?  git hub ignores special characters, quotes mean the
//  words must be together, but need and end so it doesn't find child pages or other URLs

const ISSUE_QUERY = gql`
    query GetIssues($first : Int!, $query: String!){
        search(first: $first, query: $query,type:ISSUE){
            nodes{
                ... on Issue{
                    number
                    milestone{
                        title
                    }
                    state
                    title
                    author{
                        login
                    }
                    url
                }
            }
        }
    }`;

export default class IssueService {

    /*
    * all ids replaced with 'x'
    * looks something like: /place/thing/x/reports/?id=x
    */
    buildPageSearchString(url): string {
        // todo rmk (12 Nov. 2021):this is where options to make the search string will go
        return `${url.pathname}${url.search}`.replace(/\d+/g, 'x');
    }

    getQueryParams(url): { first: number; query: string } {
        const repo = "atvenu/atvenu";
        const urlSearchString = this.buildPageSearchString(url);
        const query = `repo:${repo} "start(${PAGE})end"`;
        const pageQuery = query.replace(PAGE, urlSearchString);
        return {
            first: 10,
            query: pageQuery
        };
    }

    getIssueQueryForCurrentPage(): DocumentNode {
        return ISSUE_QUERY;
    }
}

