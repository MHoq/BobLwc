import { LightningElement, wire } from 'lwc';
import fetchAccounts from '@salesforce/apex/AccountController.fetchAccounts';
import updateAccounts from '@salesforce/apex/AccountController.updateAccounts';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Industry', fieldName: 'Industry', editable: true },
    { label: 'Effective Date', fieldName: 'Effective_Date__c', type: 'date-local', editable: true, typeAttributes: {  
                                                                                                day: 'numeric',  
                                                                                                month: 'numeric',  
                                                                                                year: 'numeric'} }
];

export default class Sample extends LightningElement {

    records;
    wiredRecords;
    error;
    columns = columns;
    draftValues = [];

    @wire( fetchAccounts )  
    wiredAccount( value ) {

        this.wiredRecords = value; // track the provisioned value
        const { data, error } = value;

        if ( data ) {
                            
            this.records = data;
            this.error = undefined;

        } else if ( error ) {

            this.error = error;
            this.records = undefined;

        }

    }  

    async handleSave( event ) {

        const updatedFields = event.detail.draftValues;

        await updateAccounts( { data: updatedFields } )
        .then( result => {

            console.log( JSON.stringify( "Apex update result: " + result ) );
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account(s) updated',
                    variant: 'success'
                })
            );
            
            refreshApex( this.wiredRecords ).then( () => {
                this.draftValues = [];
            });        

        }).catch( error => {

            console.log( 'Error is ' + JSON.stringify( error ) );
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or refreshing records',
                    message: error.body.message,
                    variant: 'error'
                })
            );

        });

    }

}