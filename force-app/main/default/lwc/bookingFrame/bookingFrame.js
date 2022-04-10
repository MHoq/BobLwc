import { LightningElement, wire, api, track } from 'lwc';
import getCapacityMgmt from '@salesforce/apex/bookingFrameController.getCapacityMgmt';
import createAllocation from '@salesforce/apex/bookingFrameController.createAllocation';
import popRemainingQTY from '@salesforce/apex/bookingFrameController.popRemainingQTY';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import updateTableData from '@salesforce/apex/bookingFrameController.updateTableData';
import {loadStyle} from 'lightning/platformResourceLoader';
import COLORS from '@salesforce/resourceUrl/colors';



const ashvilleCOLS = [
    { label: 'Book Date', fieldName: 'BookDate__c', type: 'date',typeAttributes: {day: "numeric",month: "numeric",year: "numeric"}, clipText: true, hideDefaultActions: true, cellAttributes:{ alignment: "center"}  },
    { label: 'Total Pounds', fieldName: 'TotalPounds__c', type: 'number', clipText: true, hideDefaultActions: true, cellAttributes:{ alignment: "center"}},
    { label: 'W<=15', fieldName: 'W_15__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: '15<W<30', fieldName: 'X15_W_30__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'W>=30', fieldName: 'W_30__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} }
];

const claytonCOLS = [
    { label: 'Book Date', fieldName: 'BookDate__c', type: 'date',typeAttributes: {day: "numeric",month: "numeric",year: "numeric"}, clipText: true, hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Total Pounds', fieldName: 'TotalPounds__c', clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"}},
    { label: 'BARE', fieldName: 'BARE__c', editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'H19', fieldName: 'H19__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'COATED', fieldName: 'COATED__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} }
];

const davenportCOLS = [
    { label: 'Book Date', fieldName: 'BookDate__c', type: 'date',typeAttributes: {day: "numeric",month: "numeric",year: "numeric"}, clipText: true, hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Total Pounds', fieldName: 'TotalPounds__c', clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"}},
    { label: 'BARE', fieldName: 'BARE__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'PAINTED', fieldName: 'PAINTED__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} }
];

const lincolinshireCOLS = [
    { label: 'Book Date', fieldName: 'BookDate__c', type: 'date',typeAttributes: {day: "numeric",month: "numeric",year: "numeric"}, clipText: true, hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Total Pounds', fieldName: 'TotalPounds__c',  clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"}},
    { label: 'WIDE', fieldName: 'WIDE__c', editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'SLIT', fieldName: 'SLIT__c', editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} }
];

const newportCOLS = [
    { label: 'Book Date', fieldName: 'BookDate__c', type: 'date',typeAttributes: {day: "numeric",month: "numeric",year: "numeric"}, clipText: true, hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Total Pounds', fieldName: 'TotalPounds__c', clipText: true, type: 'number',  hideDefaultActions: true, cellAttributes:{ alignment: "center"}},
    { label: '3105', fieldName: 'X3105__c', editable: true, clipText: true,  type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'HOMO', fieldName: 'HOMO__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: '3004', fieldName: 'X3004__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} }
];

const richmondCOLS = [
    { label: 'Book Date', fieldName: 'BookDate__c', type: 'date', typeAttributes: {day: "numeric",month: "numeric",year: "numeric"}, clipText: true, hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Total Pounds', fieldName: 'TotalPounds__c',  clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"}},
    { label: '3025', fieldName: 'X3025__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: '3105', fieldName: 'X3105__c', editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} }
];

const allocationCOLS = [
    { label: 'Book Date', fieldName: 'BookDate__c', type: 'date', typeAttributes: {day: "numeric",month: "numeric",year: "numeric"}, clipText: true, hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Customer Name', fieldName: 'CustomerName',  clipText: true, type: 'text', hideDefaultActions: true, cellAttributes:{ alignment: "center"}},
    { label: 'Due Date', fieldName: 'DueDate__c', type: 'date', typeAttributes: {day: "numeric",month: "numeric",year: "numeric"}, clipText: true, hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Product Group', fieldName: 'ProductGroup__c', clipText: true, type: 'text', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Lbs Left', fieldName: 'LbsLeft__c', clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Reserved', fieldName: 'Reserved__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Booked', fieldName: 'Booked__c',  editable: true, clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} }
];

const leadCOLS = [
    { label: 'Book Date', fieldName: 'BookDate__c', type: 'date', typeAttributes: {day: "numeric",month: "numeric",year: "numeric"}, clipText: true, hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Lbs Allotted', fieldName: 'LBS_Allotted__c',  clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"}},
    { label: 'Lbs Reserved', fieldName: 'Reserved__c', clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Lbs Booked', fieldName: 'Booked__c', clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Lbs Left', fieldName: 'LbsLeft__c', clipText: true, type: 'number', hideDefaultActions: true, cellAttributes:{ alignment: "center"} },
    { label: 'Product Group', fieldName: 'ProductGroup__c', clipText: true, type: 'text', hideDefaultActions: true, cellAttributes:{ alignment: "center"} }
];

const AshvilleGRP = [{label: 'W<=15',value: 'W<=15',},{label: '15<W<30',value: '15<W<30',},{label: 'W>=30',value: 'W>=30',}];
const ClaytonGRP = [{label: 'BARE',value: 'BARE',},{label: 'H19',value: 'H19',},{label: 'COATED',value: 'COATED',}];
const davenPortGRP = [{label: 'BARE',value: 'BARE',},{label: 'PAINTED',value: 'PAINTED',}];
const lincolnShireGRP = [{label: 'WIDE',value: 'WIDE',},{label: 'SLIT',value: 'SLIT',}];
const newPortGRP = [{label: '3105',value: '3105',},{label: 'HOMO',value: 'HOMO',},{label: '3004',value: '3004',}];
const richmondGRP = [{label: '3025',value: '3025',},{label: '3105',value: '3105',}];

export default class BookingFrame extends LightningElement {
    
    @track addICN = false;
    @track refreshICN = false;
    @track saveICN = false;
    @track allocPopUp = false;
    @track norecords = false;
    @track isLoading = false;
    @track viewTABLE = false;
    @track showLbs = false;
    @track noDATAFound = '';
    @track refreshTIMES = 0;
    @track accountRecord;
    @track custRecID = '';
    @track custRecName = '';
    @track poundsRemaining = ''
    @track columns = ashvilleCOLS;
    @track tableDATA = [];
    @track draftValues = [];
    @track error;
    

    @api frameFacility;
    @api frameView = 'Capacity Mgmt';
    @api frameBDate;
    @api frameDDate;
    @api frameGrp = '';
    @api frameAccid = '';

    //---Popup Variables---
    @track popBookDate = '';
    @track popDueDate = '';
    @track popFacility = '';
    @track popPrdtGrp = '';
    @track popReserve;
    @track popBooked;
    @track allocMSSG = '';
    @track popisLoading = false;

    headerMessage = '';
    productGRP;
    fields = ['Id, Name, Active__c'];
    displayFields = 'Name';

    facilityOptions = [
        { label: 'Ashville', value: 'Ashville' },
        { label: 'Clayton', value: 'Clayton' },
        { label: 'Davenport FIN', value: 'Davenport FIN' },
        { label: 'Lincolnshire', value: 'Lincolnshire' },
        { label: 'Newport', value: 'Newport' },
        { label: 'Richmond', value: 'Richmond' }
    ];



    @wire(getCapacityMgmt, { facility: '$frameFacility', viewBY: '$frameView',
         bookDate: '$frameBDate', refreshCount: '$refreshTIMES', selectedGrp: '$frameGrp', accID: '$frameAccid',
         dueDate: '$frameDDate' }) capacity(result){
            if(this.frameView == 'Allocation Mgmt' && result.data != undefined && result.data.length > 0) {
            this.tableDATA = result;
            this.tableDATA.data = result.data.map(row=>{
                return{...row, CustomerName: row.CustomerName__r.Name}
            });
        } else {
            this.tableDATA = result;
        }
        this.isLoading = false;  
        this.viewTABLE = false;      
        this.noDATAFound = '';
        if(this.tableDATA.data != undefined && this.tableDATA.data.length == 0) { 
            this.viewTABLE = true;
            this.noDATAFound = 'No Data Available';
        }
    };

    //---OnLoad of Booking Frame---
    connectedCallback() {
        this.refreshTIMES = 0;
        this.isLoading = true;
        this.refreshICN = true;
        this.saveICN = false;
        this.headerMessage = 'Allotted LBS (In Thousands) - Ashville';

        //---Load Static Resource---
        loadStyle(this, COLORS).then(()=>{}).catch(error=>{ }); 

    }

    renderedCallback() {
         
    }

    //---OnCall from Parent Component after selecting the options---
    @api
    callFrameLoad(facivalue, viewvalue, bkvalue) {
        refreshApex(this.tableDATA);
        this.isLoading = true;
        this.frameFacility = facivalue;
        this.frameView = viewvalue;
        this.frameBDate = bkvalue;

        if(viewvalue == 'Capacity Mgmt') {
            this.addICN = false;
            this.refreshICN = true;
            this.saveICN = false;
            this.headerMessage = 'Allotted LBS (In Thousands) - ' + facivalue;
            this.loadCapacityCOLMS(facivalue);
        } else if (viewvalue == 'Lead Times') {
            this.addICN = false;
            this.refreshICN = true;
            this.saveICN = false;
            this.headerMessage = 'Booking Lead Times (In Thousands) - ' + facivalue;
            this.columns = leadCOLS;
        } else if (viewvalue == 'Allocation Mgmt') {
            this.addICN = true;
            this.refreshICN = true;
            this.saveICN = false;
            this.headerMessage = 'Bookings - Reserves (In Thousands) - ' + facivalue;
            this.columns = allocationCOLS;
        } else if (viewvalue == 'Activity Review') {
            this.addICN = false;
            this.refreshICN = true;
            this.saveICN = false;
            this.headerMessage = 'Review Bookings (In Thousands) - ' + facivalue;
        } else if (viewvalue == 'Exceptions Report') {
            this.addICN = false;
            this.refreshICN = true;
            this.saveICN = false;
            this.headerMessage = 'Booking Lead Times Exceptions Report';
        }
        return 'Finished!'; 
    }       

    loadCapacityCOLMS(facility) {
        if(facility == 'Ashville') {
            this.columns = ashvilleCOLS;
        } else if(facility == 'Clayton') {
            this.columns = claytonCOLS;
        } else if(facility == 'Davenport FIN') {
            this.columns = davenportCOLS;
        } else if(facility == 'Lincolnshire') {
            this.columns = lincolinshireCOLS;
        } else if(facility == 'Newport') {
            this.columns = newportCOLS;
        } else if(facility == 'Richmond') {
            this.columns = richmondCOLS;
        }
        
    }

    async handleSave(event) {
        this.isLoading = true;  
        const updatedFields = event.detail.draftValues;
        const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id } });
        const result = await updateTableData({data: updatedFields, viewBY: this.frameView});
        if(result == 'Success') {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Updated Successfully',
                    variant: 'success'
                })
            );
            getRecordNotifyChange(notifyChangeIds);
            this.draftValues = [];
            refreshApex(this.tableDATA);
        } else {
            this.isLoading = false;  
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: result,
                    variant: 'error'
                })
            );
        }  
    }


    onaddClick(event){
        this.allocPopUp = true;
    }
    
    onclosepopUP(event){
        this.showLbs = false;
        this.allocPopUp = false;
        this.popBookDate = '';
        this.popDueDate = '';
        this.custRecID = '';
        this.custRecName = '';
        this.popFacility = '';
        this.popPrdtGrp = '';
        this.popReserve = null;
        this.popBooked = null;
        this.productGRP = [];
    }

    onrefreshClick(){
        //---Fetch new data from DB---
        this.isLoading = true;
        this.refreshTIMES = this.refreshTIMES + 1;
    }

    onsaveClick(event){
        
    }


    //-------Popup Action Items------
    onBookDateSelect(event){
        const bookDt = event.target.value;
        let inputName = this.template.querySelector(".BookDate");
        let day = this.dayoftheDate(bookDt);
        if(day == 'Saturday' || day == undefined) {
            inputName.setCustomValidity("");
            this.popBookDate = bookDt;
            this.fetchPopRemaining();
        } else {
            inputName.setCustomValidity("Please select only Saturday's");
        }
    }

    onDueDateSelect(event){
        this.popDueDate = event.detail.value;
    }

    handleLookup(event){
        this.custRecID = event.detail.data.record.Id;
        this.custRecName = event.detail.data.record.Name;   
    }

    onpopupFacilitySelect(event){
        this.popFacility = event.detail.value;
        this.productGRP = [];
        this.popPrdtGrp = null;
        this.showLbs = false;
        if(this.popFacility == 'Ashville') {
            this.productGRP = AshvilleGRP;
        } else if(this.popFacility == 'Clayton') {
            this.productGRP = ClaytonGRP;
        } else if(this.popFacility == 'Davenport FIN') {
            this.productGRP = davenPortGRP;
        } else if(this.popFacility == 'Lincolnshire') {
            this.productGRP = lincolnShireGRP;
        } else if(this.popFacility == 'Newport') {
            this.productGRP = newPortGRP;
        } else if(this.popFacility == 'Richmond') {
            this.productGRP = richmondGRP;
        }
    }

    onpopupGroupSelect(event){
        this.popPrdtGrp = event.detail.value;
        this.fetchPopRemaining();
    }

    onpopupReserve(event){
        this.popReserve = event.detail.value;
    }

    onpopupBooked(event){
        this.popBooked = event.detail.value;
    }

    handleClose(event){
        this.custRecID = '';
        this.custRecName = '';
    }

    onpopSave(event){
        if(this.popBookDate == '' || this.popDueDate == '' || this.custRecID == '' || this.popFacility == '' || this.popPrdtGrp == '') {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please enter all required values',
                    variant: 'error'
                })
            );
        } else {
            //---Insert Allocation record----
            createAllocation({ BookDate: this.popBookDate, DueDate: this.popDueDate, accID: this.custRecID, facility: this.popFacility, prdtGrp: this.popPrdtGrp, reserve: this.popReserve, booked: this.popBooked, Lbsremaining: this.poundsRemaining})
            .then(result => {     
                this.allocMSSG = result;
                if(this.allocMSSG == 'Success') {
                    refreshApex(this.tableDATA);
                    this.allocPopUp = false;
                    this.popBookDate = '';
                    this.popDueDate = '';
                    this.custRecID = '';
                    this.custRecName = '';
                    this.popFacility = '';
                    this.popPrdtGrp = '';
                    this.popReserve = null;
                    this.popBooked = null;
                    this.productGRP = [];  
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Successfully Allocated',
                            variant: 'success'
                        })
                    );
                } else {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: this.allocMSSG,
                            variant: 'error'
                        })
                    );
                }
            })
            .catch(error => {
                this.error = error;
            });
        }

    }

    fetchPopRemaining() {
        if(this.popBookDate == undefined || this.popPrdtGrp == '') {
            this.showLbs = false;
        } else {
            this.popisLoading = true;
            let fieldAPI = this.fetchGRPAPIname();
            popRemainingQTY({popBKDATE:this.popBookDate,popFACLTY:this.popFacility,popGRP:this.popPrdtGrp,capAPI:fieldAPI})
            .then((result) => {
                this.poundsRemaining = result;
                this.error = undefined;
                this.showLbs = true;
                this.popisLoading = false;
            })
            .catch((error) => {
                this.error = error;
                this.popisLoading = false;
            });
        }
        
    }

    //----------Validations---------------
    dayoftheDate(formatdate){
        var dayList = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        var dateval = new Date(formatdate + "T00:00:00.000-06:00");
        return dayList[dateval.getDay()];
    }

    fetchGRPAPIname() {
        let myAPI;
        if(this.popPrdtGrp == 'W<=15') {
            myAPI ='W_15__c';
        } else if(this.popPrdtGrp == '15<W<30') {
            myAPI ='X15_W_30__c';
        } else if(this.popPrdtGrp == 'W>=30') {
            myAPI ='W_30__c';
        } else if(this.popPrdtGrp == 'BARE') {
            myAPI ='BARE__c';
        } else if(this.popPrdtGrp == 'H19') {
            myAPI ='H19__c';
        } else if(this.popPrdtGrp == 'COATED') {
            myAPI ='COATED__c';
        } else if(this.popPrdtGrp == 'PAINTED') {
            myAPI ='PAINTED__c';
        } else if(this.popPrdtGrp == 'WIDE') {
            myAPI ='WIDE__c';
        } else if(this.popPrdtGrp == 'SLIT') {
            myAPI ='SLIT__c';
        } else if(this.popPrdtGrp == '3105') {
            myAPI ='X3105__c';
        } else if(this.popPrdtGrp == 'HOMO') {
            myAPI ='HOMO__c';
        } else if(this.popPrdtGrp == '3004') {
            myAPI ='X3004__c';
        } else if(this.popPrdtGrp == '3025') {
            myAPI ='X3025__c';
        } 
        return myAPI;
    }

}