import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';

import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

import getAccs from '@salesforce/apex/AccountController.getAccs';


const columns = [
    
    {
        label: 'Name',
        fieldName: 'AccountUrl__c',
        type: 'url',
        typeAttributes: 
                {label: { fieldName: 'Name' }, 
                target: '_blank'},
        sortable: true
    },
     {
        label: 'Account Number',
        fieldName: 'AccountNumber',
        type: 'text',
        sortable: true
    },    
    {
        label: 'Type',
        fieldName: 'Type',
        type: 'text',
        sortable: true
    },
    {
        label: 'Industry',
        fieldName: 'Industry',
        type: 'text',
        sortable: true
    }    
];

export default class LightningDatatableExample extends LightningElement {

    valuemulti = ['option1'];

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: INDUSTRY_FIELD })
    industryValues;

    @track popBookDate = '';
    @track value;
    @track error;
    @track data;
    @api sortedDirection = 'asc';
    @api sortedBy = 'Name';
    @api searchKey = '';
    result;

    @track boolVisible = false;  
    
    @track page = 1; 
    @track items = []; 
    @track data = []; 
    @track columns; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 10; 
    @track totalRecountCount = 0;
    @track totalPage = 0;

    industryValue = "";
    industryValues;

    @wire(getAccs, {searchKey: '$searchKey', sortBy: '$sortedBy', sortDirection: '$sortedDirection'})
    wiredAccounts({ error, data }) {
        if (data) {

            var tempAccountsList = [];

            let NameUrl;

            this.boolVisible = true;

            /* for ( var i = 0; i < data.length; i++ ) {
                 let tempRecord = Object.assign({}, data[i]); //cloning object  
                tempRecord.NameUrl = "/" + tempRecord.Id;  
                tempAccountsList.push(tempRecord); 
                

             } */

             //this.data = tempAccountsList;

             //this.data =  tempAccountsWithIndustry;  

            /*data.forEach(accRec => {

                //let tempConRec = `/${accRec.Id}`; 
                //tempConRec.NameUrl = '/' + tempConRec.Id;
                //data.push(tempConRec);

                    accRec['NameUrl'] = `/${accRec.Id}`;
                    //accRec.Name = accRec.Name + ' MEX';
                    //accRec.Name = accRec.Name + ' MEX';
                    console.log(accRec.Name);
                    console.log(accRec.NameUrl);

                    
                });*/

            //console.log( this.popBookDate );
        
            this.items = data;
            this.totalRecountCount = data.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = columns;

            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }
    /*wiredAccounts({ error, data }) {
        if (data) {

            console.log( this.popBookDate );
        
            this.items = data;
            this.totalRecountCount = data.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = columns;

            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }*/

        onBookDateSelect(event){
        const bookDt = event.target.value;
        let inputName = this.template.querySelector(".EffectiveDate");
        console.log(inputName.value);
        this.popBookDate = bookDt;

    }

   handleActive(event) {
        console.log( 'handleActive' );
        //const tab = event.target;
        //this.tabContent = `Tab ${event.target.value} is now active`;
    }    

    //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    //clicking on next button this method will be called
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }

    handleSelect () {

    }  

    //this method displays records page by page
    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.items.slice(this.startingRecord, this.endingRecord);

        this.startingRecord = this.startingRecord + 1;
    }    
    
    sortColumns( event ) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        return refreshApex(this.result);
        
    }
  
    handleKeyChange( event ) {
        //console.log( event.target.value );
        //console.log(this.template.querySelector('[data-id="Search_Acc"]').value);

        //this.searchKey = event.target.value;
        return refreshApex(this.result);
    }

    handleSearch( event ) {
        //console.log( event.target.value );
        //console.log(this.template.querySelector('[data-id="Search_Acc"]').value);

        this.searchKey = this.template.querySelector('[data-id="Search_Acc"]').value;
        return refreshApex(this.result);
    }    


    handleChange(event) {
            this.industryValue = event.target.value;
    }

     get options() {
        return [
            { label: 'Surgical', value: 'Surgical' },
            { label: 'Anesthesia', value: 'Anesthesia' },
            { label: 'Diagnostics', value: 'Diagnostics' },
            { label: 'Radiation', value: 'Radiation' },
        ];
    }

    get selectedValues() {
        return this.valuemulti.join(',');
    }

    handleCheckGroupChange(e) {
        //console.log(e.detail.name);
        //console.log(e.detail.value);
        //console.log(e.target.checked);
        console.log(e.target.value[0]);
        //console.log(e.target);
        console.log(e.target.options);
        //this.value = e.detail.value;
        //console.log(e.currentTarget.name);
    }

}