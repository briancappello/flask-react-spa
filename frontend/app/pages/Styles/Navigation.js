import React from 'react'
import { DocComponent } from 'components'


export default class Navigation extends DocComponent {
  description = 'A horizontal navbar. By default, its width is 100% of its parent. In this mode, you probably want to add the <code>padded</code> class (as shown below).'

  html = `\
<nav class="padded">  <!-- .padded adds left & right padding -->
  <a href="#" class="brand">
    Company.<span class="tld">com</span>
  </a>
  <div class="menu">
    <a href="#" class="active">About</a>
    <a href="#">Products</a>
    <a href="#">Support</a>
  </div>
  <div class="menu right">
    <a href="#">Login</a>
  </div>
</nav>
`
  navtop = `\
<body class="fixed-nav-top">
  <header>  <!-- <header> must be an immediate parent of <nav> -->
    <nav>
      <div class="container"> <!-- this container is optional; full-width by default -->
        <!-- brand and menu links here -->
      </div>
    </nav>
  </header>
  <main> <!-- use <main> to automatically get the correct margin-top -->
    <!-- page content here -->
  </main>
</body>
`

  render() {
    let headerTag = '<header>'
    return (
      <div>
        <h2 id="navigation">Navigation</h2>
        {this.renderDescription(this.description)}
        {this.renderHtml(this.html)}
        <p>
          You can also get a navbar that sticks to the top of the page by adding
          the <code>fixed-nav-top</code> class to any (grand)parent of{' '}
          <code>{headerTag}</code>.
        </p>
        <pre>
          <code>
            {this.navtop}
          </code>
        </pre>
      </div>
    )
  }
}
