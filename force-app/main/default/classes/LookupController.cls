public with sharing class LookupController {
    public LookupController() {

    }
      @AuraEnabled(cacheable=true)
    public static List<sObject> lookUp(String searchTerm, String objectName, String filters, String recordId, String fields) {

        Integer limitNum = 20;

        String finalQuery = 'SELECT ' + fields + ' FROM ' + objectName;

        if(String.isBlank(recordId)){
            if(String.isNotBlank(searchTerm)){
                finalQuery += ' WHERE Name Like  \'%' + searchTerm + '%\' ';
            }
            
            if(String.isNotBlank(filters)){
                finalQuery += String.isNotBlank(searchTerm) ? ' AND ' : ' WHERE ';
                finalQuery += filters; 
            }
        }else{
            // finalQuery += ' WHERE Id =  \'' + recordId + '\'';
            finalQuery += ' WHERE Id =  \'' + recordId + '\'';
            if(String.isNotBlank(filters)){
                finalQuery += ' AND ';
                finalQuery += filters;
            }
        }

        finalQuery+= ' LIMIT ' + limitNum;

        System.debug('Final Query::::' + finalQuery);

        List<sObject> lookUpList = database.query(finalQuery);
        System.debug(' lookUpList : '+lookUpList);
        return lookUpList;  
    }


     @AuraEnabled
    public static List<sObject> search(String objectName, List<String> fields, String searchTerm){
        String searchKeyword = searchTerm + '*';
        String returningQuery = '';
        returningQuery = objectName+' ( Id, '+String.join(fields,',')+')';
        String query = 'FIND :searchKeyword IN ALL FIELDS RETURNING '+returningQuery+' LIMIT 20';
        System.debug(' query '+query);
        List<List<sObject>> searchRecords = Search.Query(Query);
        return searchRecords.get(0);
    }

    @AuraEnabled
    public static Map<String,  List<Option>> getCustomPicklistValues(String objectName, List<String> fieldsList){
      
            Map<String, List<Option>> mapFieldpicklistValues = new Map<String, List<Option>>();
            Schema.SObjectType s = Schema.getGlobalDescribe().get(objectName) ;
            Schema.DescribeSObjectResult r = s.getDescribe() ;
            Map<String,Schema.SObjectField> fields = r.fields.getMap() ;


            for(String fieldName: fieldsList){
                //Map<String,String> picklistvalues = new  Map<String,String>();
                List<Option> optionsList = new List<Option>();
                for( Schema.PicklistEntry pickListVal : fields.get(fieldName).getDescribe().getPicklistValues()){
                    //picklistvalues.put(pickListVal.getValue(), pickListVal.getLabel());
                    Option op = new Option();
                    op.label = picklistVal.getlabel();
                    op.value = pickListVal.getValue();
                    optionsList.add(op);
                }
                if(optionsList.size() > 0){
                    mapFieldpicklistValues.put(fieldName, optionsList);
                }

            }

            return mapFieldpicklistValues;
    }

    public class Option {
        @AuraEnabled public String label;
        @AuraEnabled public String value;
    }

    @AuraEnabled
    public static List<sObject> searchDB(String objectName, List<String> fields,
                                  String fld_API_Search , String searchText ,String whereclause)
    {
        
        if(String.escapeSingleQuotes(searchText.trim()).length() == 0) {
            List<sObject> sOBJ = new List<sObject>();
            return sOBJ;
        }
        
        searchText='\'%' + String.escapeSingleQuotes(searchText.trim()) + '%\'';
        Set<Id> userIds = new Set<Id>();
        String query = '';
        
        if(whereclause == null){
            whereclause = '';
        }
        query = 'SELECT '+String.join(fields,',')+
                
                ' FROM '+objectName+
                
                ' WHERE '+fld_API_Search+' LIKE '+searchText + whereclause +
                
                ' LIMIT 20';
        
        
        
        
        return Database.query(query);
        
    }
}