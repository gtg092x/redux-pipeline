import React from 'react';
import classNames from 'classnames';

export default function ModelViewer({model, className}) {
    return (
        <div className={classNames(className)}>
            <h3>Model</h3>
            <pre><code>{JSON.stringify(model, null, 2)}</code></pre>
        </div>
    );
}