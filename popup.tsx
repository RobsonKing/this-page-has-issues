import * as ReactDOM from "react-dom";
import * as React from "react";
import {useState} from "react";
import RepoConfig from "./src/components/RepoConfig/RepoConfig";
import IssuesBrowser from "./src/components/IssuesBrowser/IssuesBrowser";
import ErrorBoundary from "./src/ErrorBoundary/ErrorBoundary";

const Popup = (): React.FC<null> => {
    const [showConfig, setShowConfig] = useState(false);

    if (showConfig) {
        return <RepoConfig hide={() => setShowConfig(false)}/>;
    }
    return <IssuesBrowser showConfig={() => setShowConfig(true)}/>;
};

ReactDOM.render(
    <ErrorBoundary>
        <Popup/>
    </ErrorBoundary>,
    document.getElementById('app')
);
