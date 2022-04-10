public with sharing class caseDragDropWitnessController {
    public caseDragDropWitnessController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getCases(){
        return [SELECT Id, Subject, Status, Type, Description FROM Case];
         
    }      
}