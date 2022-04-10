import { LightningElement, api, track } from 'lwc';

export default class PreviewDialog extends LightningElement 
{

    @track open = false;

    @api
    openModal(){

        alert('open');
        this.open = true;
    }


}