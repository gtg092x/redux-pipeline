import React from 'react';
//Component, title, description, props, codeSegments
function getContainers() {
    return {
        'basic': {
            title: 'Basic',
            description: 'This is a description',
            codeSegments: [{
                title: 'Code One',
                sample: 'var foo'
            }],
            component: (<p>Hey!</p>)
        }
    };
}

export default getContainers;

function gh() {
    return (<p>My GH Example</p>);
}

export {gh};
