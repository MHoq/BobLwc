import { LightningElement, track } from 'lwc';

export default class DisplayContacts extends LightningElement {

    @track greeting = 'Welcome Roberto';

    @track contacts = [
        {    
            Id : '00938',
            Name : 'Bobby'
        },    
        {    
            Id : '00338',
            Name : 'Sam'
        },    
        {    
            Id : '00358',
            Name : 'Ken'
        },    
        {    
            Id : '00258',
            Name : 'Jim'
        }        
    ];


}