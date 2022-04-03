import {RepoConfig} from "../../hooks/useRepoConfig";
import IssueService, {SearchOption} from "../../services/IssueService";
import * as React from "react";
import {useState} from "react";

interface NewIssueProps {
    url: URL
    config: RepoConfig
}

export default function NewIssueButtons({url, config}: NewIssueProps): React.FC<NewIssueProps> {
    const issueService = new IssueService();
    const uniquePageId = issueService.buildPageSearchString(url, SearchOption.FULL);
    const [copyText, setCopyText] = useState('Copy Page Id');
    const [logNewText, setLogNewText] = useState('Log New Issue');

    const copyPageId = (): void => {
        navigator.clipboard.writeText(uniquePageId);
        setCopyText('Copied!');
        setTimeout(() => {
            setCopyText('Copy Page Id');
        }, 1000);
    };
    const copyPageIdAndNavigate = (): void => {
        navigator.clipboard.writeText(uniquePageId);
        setLogNewText('Copied!');
        setTimeout(() => {
            window.open(`https://github.com/${config.repo}/issues/new/choose`, "_blank");
        }, 1000);
    };

    return <>
        <button onClick={copyPageId}>{copyText}</button>
        <button onClick={copyPageIdAndNavigate}>{logNewText}</button>
    </>;
}
