import { LightningElement, api } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled }  from 'lightning/empApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Lwc_PlatFormEvent extends LightningElement 
{

    subscription = {};
    @api channelName = '/event/User_Message__e';


    // Initializes the component
    connectedCallback() {       
        // Register error listener     
        this.registerErrorListener();
        this.handleSubscribe();
    }

    // Handles subscribe button click
    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const thisReference = this;
        const messageCallback = function(response) {
            console.log('New message received 1: ', JSON.stringify(response));
            console.log('New message received 2: ', response);
            
            var obj = JSON.parse(JSON.stringify(response));
            console.log('New message received 4: ', obj.data.payload.Message__c);
            console.log('New message received 5: ', this.channelName);
            const evt = new ShowToastEvent({
                title: 'Congrats!!',
                message: obj.data.payload.Message__c,
                variant: 'success',
            });

            thisReference.dispatchEvent(evt);
            // Response contains the payload of the new message received
        };  
    }; 
    
    registerErrorListener() {
        // Invoke onError empApi method
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }    
}