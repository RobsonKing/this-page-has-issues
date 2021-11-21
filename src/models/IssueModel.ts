//todo replace with auto generated
export interface GithubIssue {
    number: number
    title: string
    // todo: enum?
    state: string
    url: string
    milestone: {
        title: string
    }
}

export default class IssueModel {

    constructor(private readonly issue: GithubIssue) {
    }

    get title(): string {
        return this.issue.title;
    }

    get number(): number {
        return this.issue.number;
    }

    get milestone(): string {
        return this.issue.milestone?.title;
    }

    // todo: closed, fixed...
    get isOpen(): boolean {
        return this.issue.state === "OPEN";
    }

    get url(): string {
        return this.issue.url;
    }
}
