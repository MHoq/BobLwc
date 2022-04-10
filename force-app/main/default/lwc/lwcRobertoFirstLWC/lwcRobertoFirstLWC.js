import { LightningElement, track } from 'lwc';
// Bobby
// Import custom labels
import lwc_custom_label from '@salesforce/label/c.seemefromlwc';


export default class HelloWorld extends LightningElement {
    @track greeting = 'Liliana! Cancun';

    // Expose the labels to use in the template.

		label = {
				lwc_custom_label
		};

    
    changeHandler(event) {
        this.greeting = event.target.value;
    }

    inputHandler(event) {

        alert('inputHandler');
        this.template.querySelector('c-preview-dialog').openModal();
    }  
    
    
}