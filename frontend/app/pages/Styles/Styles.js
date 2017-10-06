import React from 'react'
import Helmet from 'react-helmet'

import { HashLink, PageContent } from 'components'

import BlockQuote from './BlockQuote'
import Buttons from './Buttons'
import Code from './Code'
import Forms from './Forms'
import Grid from './Grid'
import Lists from './Lists'
import Navigation from './Navigation'
import Tables from './Tables'
import Typography from './Typography'

import './styles-layout.scss'


export default class Styles extends React.Component {
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
        superskeleton.<span class="tld">com</span>
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
    <!-- footer content -->
  </footer>
</body>
</html>
`

  render() {
    return (
      <PageContent className="row styles-grid">
        <Helmet>
          <title>Styles</title>
        </Helmet>
        <aside className="menu-col">
          <h4>Styles</h4>
          <ul>
            <li><span><HashLink to="#site-template">Site Template</HashLink></span></li>
            <li><span><HashLink to="#navigation">Navigation</HashLink></span></li>
            <li><span><HashLink to="#block-quotes">Block Quotes</HashLink></span></li>
            <li>
              <HashLink to="#grid">Grid</HashLink>
              <ul>
                <li><span><HashLink to="#columns">Columns</HashLink></span></li>
                <li><span><HashLink to="#fractions">Fractions</HashLink></span></li>
                <li><span><HashLink to="#column-offsets">Column Offsets</HashLink></span></li>
                <li><span><HashLink to="#fraction-offsets">Fraction Offsets</HashLink></span></li>
              </ul>
            </li>
            <li><span><HashLink to="#typography">Typography</HashLink></span></li>
            <li><span><HashLink to="#buttons">Buttons</HashLink></span></li>
            <li><span><HashLink to="#forms">Forms</HashLink></span></li>
            <li><span><HashLink to="#lists">Lists</HashLink></span></li>
            <li><span><HashLink to="#code">Code</HashLink></span></li>
            <li><span><HashLink to="#tables">Tables</HashLink></span></li>
          </ul>
        </aside>
        <div className="content-col">
          <h1 id="styles">Styles!</h1>
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
