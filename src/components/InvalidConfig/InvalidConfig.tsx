import * as React from "react";
import styles from './style.scss';

interface Props {
    showConfig: () => void
}

export default function InvalidConfig({showConfig}: Props): React.FC<Props> {
    return <div className={styles.container}>
        <span className={styles.title}>
           Your config is invalid or not setup
        </span>

        <div className={styles.footer}>
            <button onClick={showConfig}>Fix</button>
        </div>
    </div>;
}
