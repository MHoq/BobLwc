import { LightningElement, wire } from 'lwc';
import fetchProducts from '@salesforce/apex/ProductController1.fetchProducts';

const columns = [
    { label: 'Product Name', fieldName: 'Name' },
    { label: 'Product Family', fieldName: 'Family' },
    { label: 'Unit Price', fieldName: 'UnitPrice', type: 'currency' },
    { label: 'Is Active?', fieldName: 'IsActive', type: 'boolean' }
];

export default class ProductListShowParentFields extends LightningElement {

    records;
    wiredRecords;
    error;
    columns = columns;
    draftValues = [];

    @wire( fetchProducts )  
    wiredAccount( value ) {

        this.wiredRecords = value;
        const { data, error } = value;

        if ( data ) {
            
            let tempRecords = JSON.parse( JSON.stringify( data ) );
            tempRecords = tempRecords.map( row => {
                return { ...row, Name: row.Product2.Name, Family: row.Product2.Family };
            })
            this.records = tempRecords;
            this.error = undefined;

        } else if ( error ) {

            this.error = error;
            this.records = undefined;

        }

    }  

}