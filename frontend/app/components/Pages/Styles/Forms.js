import React from 'react'
import { DocComponent } from 'components'


export default class Forms extends DocComponent {
  title = 'Forms'
  html = `\
<form>
  <div class="row">
    <div class="half col">
      <label for="exampleEmailInput">Your email</label>
      <input class="full-width" type="email" placeholder="test@mailbox.com" id="exampleEmailInput"/>
    </div>
    <div class="half col">
      <label for="exampleRecipientInput">Reason for contacting</label>
      <select class="full-width" id="exampleRecipientInput">
        <option value="question">Question</option>
        <option value="praise">Praise</option>
        <option value="other">Other</option>
      </select>
    </div>
  </div>
  <label for="exampleMessage">Message</label>
  <textarea class="full-width" placeholder="Hi Dave …" id="exampleMessage"></textarea>
  <div class="row">
    <div class="inline-form">
      <label class="right">
        <input type="checkbox"/>
        <span class="label-body">Send a copy to yourself</span>
      </label>
      <input class="button-primary" type="submit" value="Submit"/>
    </div>
  </div>
</form>
`
}
