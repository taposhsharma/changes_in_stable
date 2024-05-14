const { reject } = require("lodash");
const medsdata = require("../src/medsdata");


const mockdata = (endpoint,data)=>{
    // console.log("dtat",data ,endpoint)
    if(endpoint=="FHIR/R4/MedicationRequest"){
        return "http://localhost:3006/file/medsdata"
    }
  
    else if(endpoint=="epic/2017/Clinical/Utility/GetMedications/GetMedications"){
        data= JSON.parse(data)
        if(data.GrouperID=="119944"){
            return "http://localhost:3006/file/biologic"
        }
        else if(data.GrouperID=="113258"){
            return "http://localhost:3006/file/controller"
        }else if(data.GrouperID=="101365"){
            return "http://localhost:3006/file/systemic"
        }

    }
    else if(endpoint=="FHIR/R4/List"){
        if(data.code=='hospital-problems'){
            return "http://localhost:3006/file/hospitalproblem"
        }
    }else if(endpoint=="FHIR/R4/Encounter"){
        return "http://localhost:3006/file/encounter"
    }else if(endpoint=="FHIR/R4/Condition"){
        return "http://localhost:3006/file/condition/"+data.encounter
    }else if(endpoint =="epic/2014/Clinical/Patient/GETMEDICATIONADMINISTRATIONHISTORY/MedicationAdministration"){
        return 'http://localhost:3006/file/getmedicationadministration'
    }
// console.log(endpoint)
}

module.exports = mockdata