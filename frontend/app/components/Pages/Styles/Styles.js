import React, { Component } from 'react'
import Helmet from 'react-helmet'

import { PageContent } from 'components'

import BlockQuote from './BlockQuote'
import Buttons from './Buttons'
import Code from './Code'
import Forms from './Forms'
import Grid from './Grid'
import Lists from './Lists'
import Navigation from './Navigation'
import Tables from './Tables'
import Typography from './Typography'

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
      <PageContent className="row">
        <Helmet>
          <title>Styles</title>
        </Helmet>
        <aside className="two cols fixed">
          <h4>Styles</h4>
          <ul>
            <li>
              <a href="#site-template">Site Template</a>
            </li>
            <li>
              <a href="#navigation">Navigation</a>
            </li>
            <li>
              <a href="#block-quotes">Block Quotes</a>
            </li>
            <li>
              <a href="#grid">Grid</a>
              <ul>
                <li>
                  <a href="#columns">Columns</a>
                </li>
                <li>
                  <a href="#fractions">Fractions</a>
                </li>
                <li>
                  <a href="#column-offsets">Column Offsets</a>
                </li>
                <li>
                  <a href="#fraction-offsets">Fraction Offsets</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#typography">Typography</a>
            </li>
            <li>
              <a href="#buttons">Buttons</a>
            </li>
            <li>
              <a href="#forms">Forms</a>
            </li>
            <li>
              <a href="#lists">Lists</a>
            </li>
            <li>
              <a href="#code">Code</a>
            </li>
            <li>
              <a href="#tables">Tables</a>
            </li>
          </ul>
        </aside>
        <div className="ten cols offset-by-two">
          <h1 id="styles">Styles</h1>
          <p>
            The included styles are a fork of{' '}
            <a href="https://github.com/WhatsNewSaes/Skeleton-Sass">
              Skeleton Sass
            </a>, which in turn is based on{' '}
            <a href="http://getskeleton.com/" target="_blank">
              Skeleton
            </a>.
          </p>
          <h2 id="site-template">Site Template</h2>
          <p>
            Content should be wrapped in <code>.container</code>. It defaults to{' '}
            <code>max-width: 1200px</code>.
          </p>
          <pre>
            <code>
              {this.html}
            </code>
          </pre>

          <Navigation />
          <BlockQuote />
          <Grid />
          <Typography />
          <Buttons />
          <Forms />
          <Lists />
          <Code />
          <Tables />
        </div>
      </PageContent>
    )
  }
}
