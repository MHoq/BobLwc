import {
    LightningElement
} from 'lwc';
 

export default class TrackedProperties extends LightningElement {
    message = 'Hello , Lightning web component !!';
    handleClick() {
        this.message = 'Lightning web Components Rocks ';
        console.log('Updated Message  ' + this.message);
    }
}