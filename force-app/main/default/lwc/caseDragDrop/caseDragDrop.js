import { LightningElement,wire,track } from 'lwc';

import getCases from '@salesforce/apex/caseDragDropWitnessController.getCases';

export default class CaseDragDrop extends LightningElement {
    @wire(getCases) cases;

    handleDragStart(event){
        event.dataTransfer.setData( "case_id", event.target.dataset.item );
    }

    allowDrop(event){
        event.preventDefault();
    }    

}