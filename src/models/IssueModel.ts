import {GetIssues_search_nodes_Issue} from "../services/__generated__/getIssues";
import {IssueState} from "../../__generated__/globalTypes";

export default class IssueModel {

    constructor(private readonly issue: GetIssues_search_nodes_Issue) {
    }

    get title(): string {
        return this.issue.title;
    }

    get number(): number {
        return this.issue.number;
    }

    get avatarUrl(): string {
        return this.issue.author.avatarUrl;
    }

    get author(): string {
        return this.issue.author.login;
    }

    get milestone(): string {
        return this.issue.milestone?.title;
    }

    // todo: closed, fixed...
    get isOpen(): boolean {
        return this.issue.state === IssueState.OPEN;
    }

    get url(): string {
        return this.issue.url;
    }
}
