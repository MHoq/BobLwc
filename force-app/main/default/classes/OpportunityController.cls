public with sharing class OpportunityController {
    public OpportunityController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpps( String searchKey, String sortBy, String sortDirection) {
       
        system.debug( sortBy + ' ' + sortDirection );
        
        if ( sortBy ==  'OppUrl__c' )
            sortBy = 'Name';
        
        String query = 'SELECT Id, OppUrl__c, Name,StageName,CloseDate FROM Opportunity';
        system.debug('query---'+query);
        if ( searchKey != null && searchKey != '' ) {
            String key = '%' + searchKey + '%';
            query += ' WHERE Name LIKE :key';
        }
        if ( sortBy != null && sortDirection != null ) {
            query += ' ORDER BY ' + sortBy + ' ' + sortDirection;
        }
        return Database.query( query );
    }    
}