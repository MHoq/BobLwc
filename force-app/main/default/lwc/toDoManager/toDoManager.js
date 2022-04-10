import { LightningElement } from 'lwc';

export default class ToDoManager extends LightningElement {

    //time = "09:25 PM";
    greeting = "Good evening";

    getTime()
    {
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();

        this.time = `${this.getHour(hour)}:${this.getMinutes(min)}`;

    }
    connectedCallback(){

        this.getTime();

        //setInterval(this.getTime, 1000);

        setInterval(() => this.getTime, 1000);

        //console( "set interval called" );

    }

    getHour(hour){
        return hour === 0 ? 12 : hour > 12 ? ( hour - 12) : hour;
    }

    getMinutes(min){
    
        return (min < 10 ? "0" + min : min);

    }
}