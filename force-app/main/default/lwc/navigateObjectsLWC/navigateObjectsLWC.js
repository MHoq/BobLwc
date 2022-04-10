import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';

export default class LwcNavigation extends NavigationMixin(LightningElement) {

    @api recordId;

    @wire(CurrentPageReference) pageRef;

    constructor() {

        super();

        // console.log('pageRef=====' + this.pageRef.state.testAtt);

    }

    navigateToHomePage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
        apiName: 'Account'
            },
        });
    }    

    navigateToRecordViewPage() {

        this[NavigationMixin.Navigate]({

            type: 'standard__recordPage',

            attributes: {

                recordId: recordId,

                actionName: 'view'

                // objectApiName : 'Case' Optional parameter

            }

        })

    }

}