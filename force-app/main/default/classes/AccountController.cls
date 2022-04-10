public with sharing class AccountController {
 
    @AuraEnabled( cacheable = true )
    public static List< Account > fetchAccounts() {
     
        return [ SELECT Id, Name, Industry, Effective_Date__c FROM Account LIMIT 10 ];
         
    }

    @AuraEnabled
    public static string updateAccounts( Object data ) {
        
        List < Account > accsForUpdate = ( List < Account > ) JSON.deserialize(
            JSON.serialize( data ),
            List < Account >.class
        );
        try {
            update accsForUpdate;
            return 'Success: Account(s) updated successfully';
        }
        catch (Exception e) {
            return 'The following exception has occurred: ' + e.getMessage();
        }

    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, AnnualRevenue, Industry, Phone from Account];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccs( String searchKey, String sortBy, String sortDirection) {
       
        Date myDate = Date.newInstance(2022, 1, 17);
        String sqlIndustry = 'Energy';
        String query = 'SELECT Id, Name, AccountNumber, Type, Industry, AccountUrl__c  FROM Account';
        system.debug('query---'+query);
        
        String bkSQL = ' AND Industry =:sqlIndustry AND Effective_Date__c<=:myDate ';
        //String bkSQL = '  ';
        
        if ( searchKey != null && searchKey != '' ) {
            String key = '%' + searchKey + '%';
            query += ' WHERE Name LIKE :key' + bkSQL;
        }
        
        system.debug('query---'+query);
        
        if ( sortBy != null && sortDirection != null ) {
            query += ' ORDER BY ' + sortBy + ' ' + sortDirection;
        }
        return Database.query( query );
    }      
}