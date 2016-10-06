import React, { Component } from 'react';

import { PageContent } from 'components';

import BlockQuote from './BlockQuote';
import Buttons from './Buttons';
import Code from './Code';
import Forms from './Forms';
import Grid from './Grid';
import Lists from './Lists';
import Navigation from './Navigation';
import Tables from './Tables';
import Typography from './Typography';

export default class Styles extends Component {
    html = `\
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Super Skeleton</title>
</head>
<body>
    <header>
        <nav>
            <a class="brand">
                superskeleton<span class="tld">com</span>
            </a>
            <div class="menu">
                <!-- top-level menu links -->
            </div>
        </nav>
    </header>
    <main class="container">
        <!-- your content here -->
    </main>
    <footer>
    </footer>
</body>
</html>
`

    render() {
        return (
            <PageContent>
                <h1>Styles</h1>
                <p>The included styles are a fork of <a href="https://github.com/WhatsNewSaes/Skeleton-Sass">Skeleton Sass</a>, which in turn is based on <a href="http://getskeleton.com/" target="_blank">Skeleton</a>.</p>
                <h3>Site Template</h3>
                <p>Content should be wrapped in <code>.container</code>. It defaults to <code>max-width: 1200px</code>.</p>
                <pre><code>{this.html}</code></pre>

                <Navigation/>
                <BlockQuote/>
                <Grid/>
                <Typography/>
                <Buttons/>
                <Forms/>
                <Lists/>
                <Code/>
                <Tables/>
            </PageContent>
        );
    }
}
