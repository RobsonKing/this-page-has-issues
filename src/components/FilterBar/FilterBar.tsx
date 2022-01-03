import * as React from "react";
import {Filters} from "../../hooks/useIssues";

interface Props {
    filters: Filters
}

export function FilterBar({
                              filters: {
                                  showOpenIssues,
                                  setOpenFilter,
                                  showClosedIssues,
                                  setClosedFilter
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
    </div>;
}
