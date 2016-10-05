import React from 'react';
import { DocComponent } from 'components';

export default class Forms extends DocComponent {
    title = 'Forms'
    html = `\
<form>
    <div class="row">
        <div class="half column">
            <label for="exampleEmailInput">Your email</label>
            <input class="full-width" type="email" placeholder="test@mailbox.com" id="exampleEmailInput"/>
        </div>
        <div class="half column">
            <label for="exampleRecipientInput">Reason for contacting</label>
            <select class="full-width" id="exampleRecipientInput">
                <option value="Option 1">Questions</option>
                <option value="Option 2">Admiration</option>
                <option value="Option 3">Can I get your number?</option>
            </select>
        </div>
    </div>
    <label for="exampleMessage">Message</label>
    <textarea class="full-width" placeholder="Hi Dave …" id="exampleMessage"></textarea>
    <div class="row">
        <label class="pull-right">
            <input type="checkbox"/>
            <span class="label-body">Send a copy to yourself</span>
        </label>
        <input class="button-primary" type="submit" value="Submit"/>
    </div>
</form>
`
}
