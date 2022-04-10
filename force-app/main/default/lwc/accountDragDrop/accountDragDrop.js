import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountSearchController.getAccounts1';
// Guatape - worked on Marta
// marta 2 Change

export default class AccountDragDrop extends LightningElement {
    @wire(getAccounts) accounts;

    handleDragStart(event){
        event.dataTransfer.setData( "account_id", event.target.dataset.item );

    }
}