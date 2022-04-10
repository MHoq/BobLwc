import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import search from '@salesforce/apex/LookupController.search';
import searchDB from '@salesforce/apex/LookupController.searchDB';
const DELAY = 300;

export default class SearchComponent extends LightningElement {
    @api valueId;
    @api valueName;
    @api objName = 'Account';
    @api iconName = 'standard:account';
    @api labelName;
    @api readOnly = false;
    @api currentRecordId;
    @api placeholder = 'Search';
    @api createRecord;
    @api fields = ['Name'];
    @api displayFields = 'Name';
    @api componentName;

    @track error;

    searchTerm;
    delayTimeout;

    searchRecords;
   @api selectedRecord;
    objectLabel;
    isLoading = false;

    field='Name';
    field1;
    field2;

    ICON_URL = '/apexpages/slds/latest/assets/icons/{0}-sprite/svg/symbols.svg#{1}';

@api required;
    connectedCallback(){

        let icons           = this.iconName.split(':');
        this.ICON_URL       = this.ICON_URL.replace('{0}',icons[0]);
        this.ICON_URL       = this.ICON_URL.replace('{1}',icons[1]);
        if(this.objName.includes('__c')){
            let obj = this.objName.substring(0, this.objName.length-3);
            this.objectLabel = obj.replaceAll('_',' ');
        }else{
            this.objectLabel = this.objName;
        }
        this.objectLabel    = this.titleCase(this.objectLabel);
        console.log('objectLabel::'+this.objectLabel);
       /* let fieldList;
        if( !Array.isArray(this.displayFields)){
            fieldList       = this.displayFields.split(',');
        }else{
            fieldList       = this.displayFields;
        }
        
        if(fieldList.length > 1){
            this.field  = fieldList[0].trim();
            this.field1 = fieldList[1].trim();
        }
        if(fieldList.length > 2){
            this.field2 = fieldList[2].trim();
        }
        let combinedFields = [];
        fieldList.forEach(field => {
            if( !this.fields.includes(field.trim()) ){
                combinedFields.push( field.trim() );
            }
        });

        this.fields = combinedFields.concat( JSON.parse(JSON.stringify(this.fields)) );
        */
    }

    @api whereclause = '';
    
    handleInputChange(event){
        console.log('handleInputChange');
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        //this.isLoading = true;
        this.delayTimeout = setTimeout(() => {
            //if(searchKey.length >= 2){
                /*search({ 
                    objectName : this.objName,
                    fields     : this.fields,
                    searchTerm : searchKey 
                })*/
                searchDB({
                    objectName: this.objName,
                    fields: this.fields,
                    fld_API_Search: 'Name',
                    searchText: searchKey,
                    whereclause: this.whereclause
                })
                .then(result => {
                    console.log(' JSON.stringify(result)::'+ JSON.stringify(result));
                    let stringResult = JSON.stringify(result);
                    let allResult    = JSON.parse(stringResult);
                    allResult.forEach( record => {
                        console.log('field::'+record);
                        console.log('this.field:'+this.field);
                       // console.log('this.field1::'+this.field1);

                        record.FIELD1 = record[this.field];
                        //record.FIELD2 = record[this.field1];
                        /*if( this.field2 ){
                            record.FIELD3 = record[this.field2];
                        }else{
                            record.FIELD3 = '';
                        }*/
                    });
                    this.searchRecords = allResult;
                    console.log('searchRecords::'+JSON.stringify(this.searchRecords));
                    
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally( ()=>{
                    //this.isLoading = false;
                });
            //}
        }, DELAY);
    }

    handleSelect(event){
        console.log('handle select');
        this.showError = false;
        let recordId = event.currentTarget.dataset.recordId;
        console.log('recordId::'+recordId);
         console.log('recordId::'+JSON.stringify(event.currentTarget.dataset));
        
        let selectRecord = this.searchRecords.find((item) => {
            return item.Id === recordId;
        });
        this.selectedRecord = selectRecord;
        console.log(' this.selectedRecord::'+ JSON.stringify(this.selectedRecord));
        
        const selectedEvent = new CustomEvent('lookup', {
            bubbles    : true,
            composed   : true,
            cancelable : true,
            detail: {  
                data : {
                    record          : selectRecord,
                    recordId        : recordId,
                    currentRecordId : this.currentRecordId,
                    componentName : this.componentName
                }
            }
        });
        this.dispatchEvent(selectedEvent);
    }

    /*handleClose(){
        console.log('handle close');
        this.selectedRecord = undefined;
        this.searchRecords  = undefined;
        this.showError = false;
        const selectedEvent = new CustomEvent('lookup', {
            bubbles    : true,
            composed   : true,
            cancelable : true,
            detail: {  
                record ,
                recordId,
                currentRecordId : this.currentRecordId,
                componentName : this.componentName
            }
        });
        this.dispatchEvent(selectedEvent);
    }*/

    handleClose(event){
        const custEvent = new CustomEvent(
            'passtoparent', {
                detail: { closed : 'closed'} 
            });

        this.dispatchEvent(custEvent);

        this.selectedRecord = undefined;
        this.searchRecords  = undefined;
        this.showError = false;
        const selectedEvent = new CustomEvent('lookup', {
            bubbles    : true,
            composed   : true,
            cancelable : true,
            detail: {  
                record ,
                recordId,
                currentRecordId : this.currentRecordId,
                componentName : this.componentName
            }
        });
        this.dispatchEvent(selectedEvent);
    }

    titleCase(string) {
        var sentence = string.toLowerCase().split(" ");
        for(var i = 0; i< sentence.length; i++){
            sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
        return sentence;
    }

    @track showError = false;
    @track errorMessage = 'Complete this field.';
    @api
    checkValidity(){
        let isValid = true;
        if(this.required){
            isValid = !!this.selectedRecord;
        }
        if(isValid) this.showError = false;
        else {
            this.errorMessage = 'Complete this field.';
            this.showError = true;
        }
        return isValid;
    }

    @api
    setError(message){
        this.errorMessage = message;
        this.showError = true;
    }

    @api
    getLabel(){
        return this.labelName;
    }
}