// helloExpressions.js

import { LightningElement } from 'lwc';

export default class TrackExample extends LightningElement {
    firstName = '';
    lastName = '';

    handleChange(event) {
        const field = event.target.name;
        if (field === 'firstName') {
            this.firstName = event.target.value;
        } else if (field === 'lastName') {
            this.lastName = event.target.value;
        }
    }

    get uppercasedFullName() {
        return `FN=${this.firstName} LN=${this.lastName}`.trim().toUpperCase();
    }
}