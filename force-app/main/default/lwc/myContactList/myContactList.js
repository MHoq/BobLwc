import { LightningElement } from 'lwc';

export default class MyContactList extends LightningElement {
    value = 'inProgress';

    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
            { label: 'On Hold', value: 'onHold' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}