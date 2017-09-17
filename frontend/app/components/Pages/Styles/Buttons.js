import React from 'react'
import { DocComponent } from 'components'


export default class Buttons extends DocComponent {
  title = 'Buttons'
  html = `\
<div class="row">
  <a href="#" class="button">Anchor Link Button</a>
  <button>Button Element</button>
  <input type="submit" value="Submit Input"/>
  <input type="button" value="Button Input"/>
</div>
<div class="row">
  <a href="#" class="button button-primary">Anchor Link Button</a>
  <button class="button-primary">Button Element</button>
  <input type="submit" class="button-primary" value="Submit Input"/>
  <input type="button" class="button-primary" value="Button Input"/>
</div>
`
}
