import { LightningElement,wire,track } from 'lwc';
 
import getAccountList from '@salesforce/apex/AccountLWCController.getAccountList';
import getContacts from '@salesforce/apex/AccountLWCController.getContacts';
 
const columns = [{
        label: 'First Name',
        fieldName: 'FirstName'
    },
    {
        label: 'Last Name',
        fieldName: 'LastName'
    },
    {
        label: 'Email',
        fieldName: 'Email',
        type: 'email'
    },
    {
        label: 'Phone',
        fieldName: 'phone',
        type: 'phone'
    }
 
];
export default class AccountList extends LightningElement {
    @track accountId = '';
    @track contacts;
    @track columns = columns;
    //  invoke apex method with wire property and fetch picklist options.
    // pass 'object information' and 'picklist field API name' method params which we need to fetch from apex
    @wire(getAccountList) accounts;
    onValueSelection(event) {
        // eslint-disable-next-line no-alert
        const selectedAccount = event.target.value;
        this.accountId = event.target.value;
        if (selectedAccount != null) {
            getContacts({
                    accountId: selectedAccount
                })
                .then(result => {
                    this.contacts = result;
                    // eslint-disable-next-line no-console
                    console.log('result' + JSON.stringify(result) + selectedAccount);
                })
                .catch(error => {
                    this.error = error;
                });
        }
    }
}