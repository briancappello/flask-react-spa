import React from 'react';
import { DocComponent } from 'components';

export default class Navigation extends DocComponent {
    title = 'Navigation';

    html = `\
<nav>
    <div class="brand">
        Company Name
    </div>
    <a href="#">Link One</a>
    <a href="#">Two</a>
    <a href="#">Three</a>
    <a href="#">Four</a>
    <div class="pull-right">
        <a href="#">Right Link</a>
    </div>
</nav>
`
}
