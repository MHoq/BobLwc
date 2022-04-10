public with sharing class ExploreCustomContactController {
    public ExploreCustomContactController() {

    }

    @AuraEnabled
    public static Map<String, String> getFieldTypes(List<String> selectedFields){
        String objectName = 'Contact';
        Map<String, String> fieldTypeMap = new Map<String, String>();

        for(String field : selectedFields){

            Schema.DisplayType fieldType = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get(field).getDescribe().getType();
            fieldTypeMap.put(field, String.valueOf(fieldType));
        }
        return fieldTypeMap;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(List<String> selectedFields){
        String s = '';
        Integer i = 0;

        for(String field : selectedFields){
            if(i == 0){
                s+= field;
            }else{
                s+= ','+field;
            }
            i++;

        }
        String query = 'SELECT ' + s + ' FROM Contact';
        
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getContactFields(){
        SObjectType contactType = Schema.getGlobalDescribe().get('Contact');
        Map<String,Schema.SObjectField> mfields = contactType.getDescribe().fields.getMap();

        List<String> sObjectDetailsList = new List<String>();
        for(String s : mfields.keySet()){
            sObjectDetailsList.add(String.valueOf(mfields.get(s)));
        }
        return sObjectDetailsList;
    }
}