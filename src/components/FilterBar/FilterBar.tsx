import * as React from "react";
import {Filters} from "../../hooks/useIssues";
import styles from './style.scss';
import {SearchOption} from "../../services/IssueService";

interface Props {
    filters: Filters
}

export function FilterBar({
                              filters: {
                                  showOpenIssues,
                                  setOpenFilter,
                                  showClosedIssues,
                                  setClosedFilter,
                                  searchOption,
                                  setSearchOption,
                              }
                          }: Props): React.FC<Props> {
    return <div>
        <label>
            Open
            <input
                name="open"
                type="checkbox"
                checked={showOpenIssues}
                onChange={(event) => {
                    setOpenFilter(event.target.checked);
                }}/>
        </label>
        <label>
            Closed
            <input
                name="closed"
                type="checkbox"
                checked={showClosedIssues}
                onChange={(event) => {
                    setClosedFilter(event.target.checked);
                }}/>
        </label>
        <span className={styles['exact-label']}>Search by: </span>
        <label>
            Full Url
            <input
                value={SearchOption.FULL}
                name="match"
                type="radio"
                checked={searchOption === SearchOption.FULL}
                onChange={(event) => {
                    setSearchOption(event.target.value);
                }}
            />
        </label>
        <label>
            Partial Url
            <input
                value={SearchOption.PARTIAL}
                name="match"
                type="radio"
                checked={searchOption === SearchOption.PARTIAL}
                onChange={(event) => {
                    setSearchOption(event.target.value);
                }}
            />
        </label>
    </div>;
}
