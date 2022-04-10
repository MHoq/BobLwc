import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/ExploreCustomContactController.getContacts';
import getContactFields from '@salesforce/apex/ExploreCustomContactController.getContactFields';
import getFieldTypes from '@salesforce/apex/ExploreCustomContactController.getFieldTypes';

export default class ExploreReimplementDataTable extends LightningElement {
    @track columns = [
        { label: 'Id', fieldName: 'Id' },
        { label: 'Name', fieldName: 'Name' }
    ];
    @track selected = ['Id', 'Name'];
    @track fetchedContacts = [];

    @wire(getContactFields) wiredContactFields;
    @wire(getContacts, { selectedFields: '$selected' })
    wiredContacts({ error, data }) {
        if (data) {
            this.fetchedContacts = data;
        } else if (error) {
            console.log(error);
        }
    }

    handleSelectedFields(event) {
        //clean the array
        this.selected.splice(0, this.selected.length);
        this.fetchedContacts = [];
        this.columns = [];

        for (var option of this.template.querySelector('select').options) {
            if (option.selected) {
                this.selected.push(option.value);
            }
        }

        getContacts({ selectedFields: this.selected })
            .then(result => {
                this.fetchedContacts = result;
                this.handleFetchFieldTypes();
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleFetchFieldTypes() {
        getFieldTypes({ selectedFields: this.selected })
            .then(result => {
                this.columns = this.selected.map(field => {
                    const dType = result[field];
                    if (dType === 'STRING' || dType === 'ID') {
                        return { label: field, fieldName: field };
                    } else if (dType === 'DATE') {
                        return { label: field, fieldName: field, type: 'date' };
                    } else if (dType === 'DATETIME') {
                        return {
                            label: field,
                            fieldName: field,
                            type: 'datetime'
                        };
                    } else if (dType === 'Integer') {
                        return {
                            label: field,
                            fieldName: field,
                            type: 'Integer'
                        };
                    } else if (dType === 'BOOLEAN') {
                        return {
                            label: field,
                            fieldName: field,
                            type: 'text'
                        };
                    } else {
                        return { label: field, fieldName: field };
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
}