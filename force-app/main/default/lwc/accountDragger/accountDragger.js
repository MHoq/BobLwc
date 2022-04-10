import { LightningElement, wire } from 'lwc';

import getAccounts from '@salesforce/apex/AccountSearchController.getAccounts1';

export default class AccountDragger extends LightningElement {
    @wire(getAccounts) accounts;

    handleDragStart(event){
        event.dataTransfer.setData( "account_id", event.target.dataset.item );

    }

}