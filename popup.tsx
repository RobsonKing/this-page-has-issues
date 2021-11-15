// import "core-js/stable";
// import "regenerator-runtime/runtime";

import {render, h} from 'preact';
import Issues from "./src/components/Issues/Issues";

render(
    <div>
        <Issues/>
    </div>,
    document.getElementById('app')
);
