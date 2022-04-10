public class AccountLWCController {
    @AuraEnabled(cacheable=true)
   public static List<Account> getAccountList() {
       return [SELECT Id, Name FROM Account];
   }
   @AuraEnabled
   public static List<Contact> getContacts(String accountId){
       return [Select Id,FirstName,LastName,Email,Phone from Contact where accountId=:accountId];
        
   }  
}