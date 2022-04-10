public with sharing class bookingFrameController {
	
	public static List<BookingAllocation__c> allocationJSONData;

    @AuraEnabled(cacheable=true)
    public static List<SObject> getCapacityMgmt(String facility, String viewBY, Date bookDate, Integer refreshCount, String selectedGrp, String accID, Date dueDate) {
        String SQL = '';
		ID recordTypeID;
        String bkSQL = '';
        Date next90Days;
        String wherePrdtGRP = '';
  
        if(bookDate == null) {
            bkSQL = 'ORDER BY BookDate__c ASC';
        } else {
            next90Days = Date.valueOf(bookDate).addDays(90);
            bkSQL = 'AND BookDate__c >=:bookDate AND BookDate__c <=:next90Days ORDER BY BookDate__c ASC';
        }

        if(viewBY == 'Allocation Mgmt' || viewBY == 'Lead Times') 
            wherePrdtGRP = (selectedGrp == '') ? '': 'AND ProductGroup__c=:selectedGrp ';
        
		if(viewBY == 'Capacity Mgmt') {
			recordTypeID = Schema.SObjectType.BookingCapacity__c.getRecordTypeInfosByName().get(facility).getRecordTypeId();
			SQL = 'SELECT Id, Name, RecordTypeId, Facility__c, BookDate__c, W_15__c,X15_W_30__c,W_30__c, BARE__c,H19__c,COATED__c, PAINTED__c, WIDE__c,SLIT__c, X3105__c,HOMO__c,X3004__c, X3025__c, TotalPounds__c FROM BookingCapacity__c WHERE RecordTypeId=:recordTypeID ' + bkSQL;
		} else if(viewBY == 'Allocation Mgmt') {
            String whereCustomer = (accID == '') ? '': 'AND CustomerName__c=:accID ';
            String whereDueDate = (dueDate == null) ? '': 'AND DueDate__c=:dueDate ';
			SQL = 'SELECT Id, Name, Facility__c, BookDate__c, DueDate__c, CustomerName__c, CustomerName__r.Name, ProductGroup__c, LbsLeft__c, Reserved__c, Booked__c FROM BookingAllocation__c WHERE Facility__c=:facility ' + wherePrdtGRP + whereCustomer + whereDueDate + bkSQL;
		} else if(viewBY == 'Lead Times') {
			SQL = 'SELECT Id, Name, Facility__c, BookDate__c, DueDate__c, CustomerName__c, CustomerName__r.Name, ProductGroup__c, LbsLeft__c, Reserved__c, Booked__c, LBS_Allotted__c FROM BookingAllocation__c WHERE Facility__c=:facility ' + wherePrdtGRP + bkSQL;
		}
        List<SObject> tableList = Database.query(SQL);
        return tableList;
    }

    @AuraEnabled
    public static string createAllocation(Date BookDate, Date DueDate, ID accID, String facility, String prdtGrp, Integer reserve, Integer booked, String Lbsremaining) {
        try{
			Integer INTreserve = (reserve == null) ? 0:reserve;
			Integer INTbook = (booked == null) ? 0:booked;
			Boolean CHECK = (INTreserve < 0 || INTbook < 0) ? true: false;
			if(CHECK)
				return 'Can\'t Save this Record';
			String[] split = Lbsremaining.split(' ');
			Integer splitINT = Integer.valueOf(split[0]);
			if(splitINT <= 0 && (INTreserve > 0 || INTbook > 0)) 
				CHECK = true;
			if(CHECK)
				return 'Can\'t Save this Record';			
			Integer Total = splitINT - (INTreserve + INTbook);
			if(Total < 0)
				CHECK = true;
			if(CHECK)
				return 'Can\'t Save this Record';
            BookingAllocation__c allocOBJ = new BookingAllocation__c();
            allocOBJ.Identifier__c = accID + '-' + BookDate + '-' + prdtGrp;
            allocOBJ.BookDate__c = BookDate;
            allocOBJ.DueDate__c = DueDate;
            allocOBJ.CustomerName__c = accID;
            allocOBJ.Facility__c = facility;
            allocOBJ.ProductGroup__c = prdtGrp;
            allocOBJ.Reserved__c = (reserve == null) ? 0:reserve;
            allocOBJ.Booked__c = (booked == null) ? 0:booked;
            Database.UpsertResult[] results = Database.upsert(new List<BookingAllocation__c>{allocOBJ}, BookingAllocation__c.Identifier__c);
        } catch(Exception error){
            return 'Error';
        }
        return 'Success';
    }

	@AuraEnabled
	public static string updateTableData(Object data, String viewBY) {
		try {
			List<BookingCapacity__c> capacityData;
			
			if(viewBY == 'Capacity Mgmt') {
				capacityData = (List<BookingCapacity__c>) JSON.deserialize(JSON.serialize(data),List<BookingCapacity__c>.class);
                Database.Update(capacityData);
			} else {
				allocationJSONData = (List<BookingAllocation__c>) JSON.deserialize(JSON.serialize(data),List<BookingAllocation__c>.class);
                String validateALLOC = validateAllocations(allocationJSONData);
				if(validateALLOC == 'Can\'t Save this Record')
					return validateALLOC;
				Database.Update(allocationJSONData);
			}
            return 'Success';
		} catch (Exception e) {
			return 'Error';
		}
	}

    @AuraEnabled
	public static string popRemainingQTY(Date popBKDATE, String popFACLTY, String popGRP, String capAPI) {
		try {
			List<BookingAllocation__c> allocationData = [SELECT Id, Name, Facility__c, BookDate__c,ProductGroup__c, LbsLeft__c FROM BookingAllocation__c WHERE BookDate__c=:popBKDATE AND Facility__c=:popFACLTY AND ProductGroup__c=:popGRP AND LbsLeft__c != null limit 1];
            if(allocationData.Size() > 0) {
                return String.valueOf(allocationData.get(0).LbsLeft__c) + ' Lbs Remaining';
            } else {
                ID recID = Schema.SObjectType.BookingCapacity__c.getRecordTypeInfosByName().get(popFACLTY).getRecordTypeId();
                List<BookingCapacity__c> capOBJ = Database.query('SELECT ID,Name,Facility__c,W_15__c,X15_W_30__c,W_30__c,BARE__c,H19__c,COATED__c,PAINTED__c,WIDE__c,SLIT__c,X3105__c,HOMO__c,X3004__c,X3025__c FROM BookingCapacity__c WHERE RecordTypeId=:recID AND BookDate__c=:popBKDATE AND Facility__c=:popFACLTY limit 1');
                return (String.valueOf(capOBJ.get(0).get(capAPI)) == null) ? '0 Lbs Remaining': String.valueOf(capOBJ.get(0).get(capAPI)) + ' Lbs Remaining';
            }
		} catch (Exception e) {
			return 'Error';
		}
	}
	
	//---Validate Allocation Records---
	public static string validateAllocations(List<BookingAllocation__c> tableData) {
		Boolean CHANGED = false;
		Map<Id,Integer> bMAP = new Map<Id,Integer>();
		Map<Id,BookingAllocation__c> tabelMAP = new Map<Id,BookingAllocation__c>(tableData);
		Map<Id,BookingAllocation__c> AllocMAP = new Map<Id,BookingAllocation__c>([SELECT Id,AvailableCapacity__c,CapacityQuantity__c,LBS_Allotted__c,LbsLeft__c,ProductGroup__c,Reserved__c,Booked__c,Identifier__c FROM BookingAllocation__c WHERE ProductGroup__c != null AND AvailableCapacity__c != null AND ID IN:tableData]);
		for(BookingAllocation__c allocLoop : AllocMAP.Values()) {
			CHANGED = false;
			Integer bValue = (allocLoop.Booked__c == null) ? 0:(Integer)allocLoop.Booked__c;
			bMAP.put(allocLoop.Id,bValue);
		
			if(tabelMAP.get(allocLoop.Id).Reserved__c != null && allocLoop.Reserved__c != tabelMAP.get(allocLoop.Id).Reserved__c) {
				allocLoop.Reserved__c = tabelMAP.get(allocLoop.Id).Reserved__c;
				if(allocLoop.Reserved__c < 0)
					return 'Can\'t Save this Record';
			}
				
			if(tabelMAP.get(allocLoop.Id).Booked__c != null && allocLoop.Booked__c != tabelMAP.get(allocLoop.Id).Booked__c) {
				CHANGED = true;
				allocLoop.Booked__c = tabelMAP.get(allocLoop.Id).Booked__c;
				if(allocLoop.Booked__c < 0)
					return 'Can\'t Save this Record';
			}
			
			if(CHANGED) {
				Integer bookValue = (Integer)allocLoop.Booked__c - bMAP.get(allocLoop.Id);
				Integer myINT = (allocLoop.Reserved__c != null) ? (Integer)allocLoop.Reserved__c-bookValue:-1;
				if(myINT < 0) {
					return 'Can\'t Save this Record';
				} else {
					allocLoop.Reserved__c = myINT;
					tabelMAP.get(allocLoop.Id).Reserved__c = myINT;
				}
					
			}
		}
		allocationJSONData.clear();
		allocationJSONData.addAll(tabelMAP.Values());
		return 'Proceed';
	}

}