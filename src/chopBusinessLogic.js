const { JSDOM } = require("jsdom");
// const { method } = require("lodash")
// const { timeSecond } = require('d3');
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const visitData = require("./encdata");
const medsdata = require("./medsdata");
const {
  systemsteriod,
  Controller,
  biologic,
} = require("./medicationrequestdata");
const hospiatalProblem = require("./hospitalproblem");
const medadmin = require("./medadmindata");

let hospitalConfig;
const customHosts = require("./chopcustomHosts");
const { search } = require("./http");
const { dateFromString, stringFromDate } = require("../utilities/utility");
const { getcsnToDatMap, getEncDat } = require("./chopdat");
const {
  addEHRListener,
  ehrHandshake,
  ehrToken,
  executeAction,
  setEHRToken,
} = require("./chopehrcomms");
const {
  getExternalEncounters,
  filterExternalEncounters,
} = require("./chophie");
const {
  getAsthmaActionPlan,
  getAsthmaCarePlan,
  chopFilterCarePlans,
  getCarePlans,
  setCarePlans,
} = require("./aap");

var {
  getcsnList,
  setcsnList,
  getcsnToFhirIdMap,
  setcsnToFhirIdMap,
  setTokenResponse,
  today,
  getTokenResponse,
  setState,
  getState,
  setSessionStorage,
  getSessionStorage,
} = require("./chopShared");

var carePlans = [];
var allowcustomhosts;

const _ = require("lodash");
const jquery = require("jquery")(new JSDOM().window);
const chartConfig1 = require("./healthChartConfig");
var chartConfig;
const { each } = require("jquery");
var rowMap;
var counterLookback;
// var today = new Date();
var csnToFhirIdMap = {};
var csnList = [];
var state;
var csnToDatMap

var encounters = [];
var medPlot = [];
var locations = [];
var fhirMeds = [];

var locationMap = {};
var encMap = {};
var encDateMap = {};
var medIdMap = {};

var acuteCareList = [];

var medAdminList = [];
var medAdminMap = {};

var hospitalProblemMap = {};

var asthmaDxRegex = /^493\.?|^J45\.?/i;
var croupDxRegex = /croup|laryngotracheobronchitis/i;
var truncateMedRegex = /^([^\d]*)\d+/;
var albuterolRegex = /accuneb|proair|ventolin|proventil|albuterol/i;

let tokenResponse;
let sessionStorage;
// let healthchart;

// Function for date math
function dateMath(offset, date) {
  date = date || new Date();
  return d3.timeSecond.offset(date, offset);
}
var chartConfigrows = JSON.parse(JSON.stringify(chartConfig1));
async function buildApp(
  hospital,
  tokenResponse1,
  state1,
  sessionStorage1,
  config,
  allowcustomhosts
) {
  // console.log(tokenResponse1);
  try {
    
    // console.log(chartConfigrows.rows)
    chartConfig = chartConfig1
    chartConfig.rows = JSON.parse(JSON.stringify(chartConfigrows.rows));
    rowMap = chartConfig.rowMap = {};
    chartConfig.rows.forEach(function (v, i) {
      chartConfig.rowMap[v.name] = i;
    });
    carePlans = [];
    setCarePlans(carePlans)
    allowcustomhosts = allowcustomhosts;
    csnToFhirIdMap = {};
    csnList = [];
    state;

    encounters = [];
    medPlot = [];
    locations = [];
    fhirMeds = [];

    locationMap = {};
    encMap = {};
    encDateMap = {};
    medIdMap = {};

    acuteCareList = [];

    medAdminList = [];
    medAdminMap = {};

    hospitalProblemMap = {};

    hospitalConfig = config;

    await setTokenResponse(tokenResponse1);
    csnToFhirIdMap = getcsnToFhirIdMap();
    tokenResponse = getTokenResponse();

    csnList = getcsnList();

    await setState(state1);
    state = getState;
    await setSessionStorage(sessionStorage1)
    sessionStorage = getSessionStorage();
    // console.log("session storage",sessionStorage["env"])
    const requestTime = Date.now();
    await import("d3")
      .then((d3) => {
        function dateMath(offset, date) {
          date = date || new Date();
          return d3.timeSecond.offset(date, offset);
        }

        var dates = {
          end: new Date(),
          focusStart: dateMath(-36720000),
          line: dateMath(-31536000),
          contextStart: dateMath(-63072000),
        };
        chartConfig.chart.dates = dates;
        counterLookback = chartConfig.chart.dates.line;
      })
      .catch((error) => {
        console.error("Error loading d3:", error);
      });

    switch (hospital) {
      case "CHOP":
        const result = await getChopPreliminaryData();

        const result2 = await getChopRemainingData();
        const result3 = await chopProcess();
        break;
      default:
      // console.log("there is no hospital code for this");
    }

    const response = {
      chartConfig,
      encounters,
      encMap,
      medPlot,
      carePlans,
    };

    // console.log(response);
    return response;
  } catch (error) {
    console.log("Error:", error);
  }
}

async function getChopPreliminaryData() {
  try {
    

    let deferreds = [];
    deferreds.push.apply(deferreds, await getChopEHRMedicationsRequest());

    //mock data
    deferreds.push.apply(
      deferreds,
      await chopFhirMedCallback(medsdata, "random", { status: 200 })
    );

    // deferreds.push.apply(
    //   deferreds,
    //   await splitFhirRequest(
    //     3,
    //     today,
    //     chopFhirMedCallback,
    //     "FHIR/R4/MedicationRequest",
    //     {
    //       patient: tokenResponse.patient,
    //     }
    //   )
    // );

    //mock data
    hospiatalProblem.entry.forEach(function (list) {
      if (!list.resource || !list.resource.entry) {
        return;
      }

      var encId = list.resource.encounter.reference.replace("Encounter/", "");

      list.resource.entry.forEach(function (problem) {
        if (!hospitalProblemMap[encId]) {
          hospitalProblemMap[encId] = [];
        }
        hospitalProblemMap[encId].push(problem.item.reference);
      });
    });



    // try {
    //   deferreds.push(
    //     await search("FHIR/R4/List", {
    //       code: "hospital-problems",
    //       patient: tokenResponse.patient,
    //     }).then(function (bundle, state, xhr) {
    //       try {
    //         //  console.log("hospital problem Map", bundle)
    //         if (!bundle.entry) {
    //           return;
    //         }
    //         bundle.entry.forEach(function (list) {
    //           if (!list.resource || !list.resource.entry) {
    //             return;
    //           }

    //           var encId = list.resource.encounter.reference.replace(
    //             "Encounter/",
    //             ""
    //           );

    //           list.resource.entry.forEach(function (problem) {
    //             if (!hospitalProblemMap[encId]) {
    //               hospitalProblemMap[encId] = [];
    //             }
    //             hospitalProblemMap[encId].push(problem.item.reference);
    //           });
    //         });
    //       } catch (error) {

    //         console.log(error.stack, "error");
    //       }
    //     })
    //   );
    // } catch (error) {
    //   console.log("hospiatal problem error ", error);
    // }

    //mock data
    deferreds.push.apply(
      deferreds,
      await chopEncounterCallback(visitData, "random", { status: 200 })
    );


    // deferreds.push.apply(
    //   deferreds,
    //   await splitFhirRequest(
    //     3,
    //     today,
    //     chopEncounterCallback,
    //     "FHIR/R4/Encounter",
    //     {
    //       patient: tokenResponse.patient,
    //       _include: "Encounter:Location",
    //     }
    //   )
    // );
   
    // try{
    //   deferreds.push.apply(await getAsthmaActionPlan());
    // }catch(error){
    //   console.log(error)
    // }
    // try{
    //   deferreds.push(await getAsthmaCarePlan())
    // }catch(error){
      
    // }
    
    // try{
    //   deferreds.push(getExternalEncounters(encounters));
    // }catch(error){
    //   console.log(error)
    // }

    if (allowcustomhosts) {
     

      if (customHosts[sessionStorage["env"]]) {
        if (typeof getControlTool === "function") {
          try{
            deferreds.push.apply(deferreds, getControlTool());
          }catch(error){
            console.log(error)
          }
          
        }

        if (typeof getAsthmaActionPlan === "function") {
          try{
            deferreds.push(await getAsthmaActionPlan());
          }catch(error){
            console.log(error)
          }
          
        
        }

        if (typeof getAsthmaCarePlan === "function") {
          try{
            deferreds.push(await getAsthmaCarePlan());
          }catch(error){
            console.log(error)
          }
          
         
        }

        if (typeof getExternalEncounters === "function") {
          try{
            deferreds.push(getExternalEncounters(encounters));
          }catch(error){
            console.log(error)
          }
          
          
        }
      }
    }


    await Promise.allSettled(deferreds);
    return deferreds;
  } catch (error) {
   
    console.error("Error:", error); // Log the error
    
  }
}

async function getChopRemainingData() {
  // console.log("in getRemaining Data, before filterLocation, encounters array ", encounters);
  // console.log("encMap before filterLocation ", encMap);
  var deferreds = [];
  // console.log("hello i am in get remaining data");
  // Filter locations to enable filtering during encounter chopProcessing
  await chopFilterLocations();

  // // console.log("locationMap after filterLocation ", locationMap);
  // // console.log("encounters before chopPreFilterEncounters ", encounters);
  // // Perform a pre-filtering of the encounters to obtain base information about each for encMap
  // // and remove those that don't meet initial criteria. Will still need to filter based on dx and meds.
  const result = await chopPreFilterEncounters(deferreds);



  // // // Obtain admin history for meds classified as "inpatient"
  // // // This includes acute encounters (e.g. IP and ED) as well
  // // // as clinic administered medications.

  // souvik comment
  if (medAdminList.length > 0) {
    deferreds.push(await getMedAdmin());
  }
  // console.log("medadkjdslkjf", medAdminMap)
  // // // Attach encounter ID to meds in medIdMap
  chopAddMedContext();

  // // // Filter on care plans;
  // setCarePlans(carePlans);
  chopFilterCarePlans(encMap);
  carePlans = getCarePlans();
  // console.log("i changed it in my appjs",chartConfig.chart.dates)

  if (allowcustomhosts) {
    if (customHosts[sessionStorage["env"]]) {
      if (typeof getEncDat === "function" && csnList.length > 0) {
        try{
          deferreds.push(await getEncDat());
          csnToDatMap = getcsnToDatMap()
        }
        catch(error){
          console.log(error)
        }
      }
    }
  }

  await Promise.allSettled(deferreds);
  return deferreds;
}

async function chopProcess() {
  try {
    // Get time object. Date.now() is more efficient, which is
    // why we attempt to get this first, but it is not available
    // in all versions of IE.
    var endTime = Date ? Date.now() : new Date();

    // Log total transaction time of all requests, which includes time related
    // to the deferred flows.
    // logD({"transaction.total.duration.ms": endTime - requestTime} , "info");

    // Display the failure message if something went wrong
    // if (chart.failure) {
    //     failureSplash();
    //     return;
    // }

    // Waiting until remaining data is back to link
    // medications to encounters;
    chopLinkMedAdmin();

    // // Build medication visualization object to pass to visualization library
    chopBuildMedVisObj();

    // Post-chopProcess encounters after medications have been linked
    chopPostFilterEncounters();

    // // Filter external encounters
    filterExternalEncounters();
    // console.log(chartConfig.rows.dates)

    // Build visualization
    return;
    // render();
  } catch (error) {
    console.log("chopProcess", error);
    // chart.failure = true;
    // failureSplash();
    // log(error.stack, "error");
    return;
  }
}

async function splitFhirRequest(
  splits,
  splitTimeDiff,
  callback,
  endpoint,
  data,
  method,
  headers
) {
  try {
    var deferreds = [];
    for (var i = 1; i <= splits; i++) {
      // souvik comment
      // data.Date = [
      //     "le" + new Date(today - (splitTimeDiff / splits * (i - 1))).toISOString().slice(0, 10),
      //     "gt" + new Date(today - (splitTimeDiff / splits * i)).toISOString().slice(0, 10)
      // ];
      deferreds.push(
        await search(endpoint, data, method, headers).then(callback)
      );
    }
    return deferreds;
  } catch (error) {
    console.log("splitfhirrequest error ", error);
  }
}

async function chopFhirMedCallback(meds, state, xhr) {
  try {
    if (xhr.status != 200) {
      // console.log("fhirmeds")
      // ref.failure = true;
      console.log(this.type + " " + this.url + " " + xhr.status, "error");
      return;
    }
    if (meds.entry && meds.entry[meds.entry.length - 1].resource.issue) {
      // TODO - Not a great error message. Should think about improving
      console.log(
        this.type + " " + this.url + " 409 (Malformed Response)",
        "warn"
      );
    }
    if (meds.total === 0 || !meds.entry) {
      // console.log("fhirmeds")
      meds.entry = [];
    }
    // TODO - May want to consider adding a map to see if the a previous request
    // returned this medication.

    fhirMeds.push.apply(fhirMeds, meds.entry);
    // console.log("fhirmeds", fhirMeds)
  } catch (error) {
    // chart.failure = true;
    console.log(error);
    // log(error.stack, "error");
  }
}

async function chopEncounterCallback(enc, state, xhr) {
  try {
    // console.log("hererdsfsdkjhfkjs",xhr,state)
    if (xhr.status != 200) {
      // ref.failure = true;
      console.log(this.type + " " + this.url + " " + xhr.status, "error");
      return;
    }
    if (enc.entry && enc.entry[enc.entry.length - 1].resource.issue) {
      // TODO - Not a great error message. Should think about improving
      console.log(
        this.type + " " + this.url + " 409 (Malformed Response)",
        "warn"
      );
    }
    if (enc.entry) {
      enc.entry.forEach(function (v) {
        if (v.resource.resourceType == "Encounter") {
          encounters.push(v.resource);
        } else if (v.resource.resourceType == "Location") {
          locations.push(v.resource);
        }
      });
    }

    // console.log("in encounterCallback", encounters);
  } catch (error) {
    console.log("here", error);
  }
}
// this will required promise settlement
async function getChopEHRMedicationsRequest() {
  try {
    var deferreds = [];
    var grouper = [
      {
        id: "119944",

        row: "Biologic",
      },
      {
        id: "113258",
        row: "Controller",
      },
      {
        id: "101365",
        row: "Systemic Steroid",
      },
    ];

    //mock data
    chopPreFilterMedications(
      systemsteriod.MedicationOrders,
      "Systemic Steroid"
    );
    chopPreFilterMedications(biologic.MedicationOrders, "Biologic");
    chopPreFilterMedications(Controller.MedicationOrders, "Controller");


    // await Promise.allSettled(
    //   grouper.map(async function (grouper) {
    //     try {
    //       deferreds.push(
    //         await search(
    //           "epic/2017/Clinical/Utility/GetMedications/GetMedications",
    //           JSON.stringify({
    //             PatientID: tokenResponse.patient,
    //             PatientIDType: "FHIR",
    //             GrouperID: grouper.id,
    //             NumberDaysToIncludeDiscontinuedAndEndedOrders: 731,
    //             ProfileView: "3",
    //           }),
    //           "POST",
    //           {
    //             "Content-Type": "application/json",
    //           }
    //         ).then(function (meds, state, xhr) {
    //           try {
    //             // TODO - Need to check for "error" responses from EHR when there aren't any results to return
    //             if (!meds.MedicationOrders) {
    //               meds.MedicationOrders = [];
    //             }
    //             // Pre-filter immediately to prep for encounter linking.
    //             chopPreFilterMedications(meds.MedicationOrders, grouper.row);
    //           } catch (error) {
    //             // chart.failure = true;
    //             console.log(error.stack, "error");
    //           }
    //         })
    //       );

    //       return deferreds;
    //     } catch (error) {
    //       console.log("error in groper", error);
    //     }
    //   })
    // );
  } catch (error) {
    console.log("Grouper Error", error);
  }
}

// medication request function
function chopPreFilterMedications(medications, row) {
  // Looping through medications. Not using the filter method
  // since the data needs to be compressed based on medication type.
  medications.forEach(function (med) {
    // Check for failure and immediately exit to reduce computation time
    // if (chart.failure) {
    //     return false;
    // }

    if (!med.StartDate && !med.StartDateTime) {
      return false;
    }

    // Ignore historical medications for now
    if (med.OrderMode == "Outpatient" && !med.DispenseQuantity) {
      return false;
    }

    // Obtain medication order date
    var start = dateFromString(med.StartDateTime || med.StartDate);
    var startStr = stringFromDate(start);
    var end = dateFromString(med.EndDateTime || med.EndDate);

    // Verify medications were written before the current time
    if (
      (med.OrderMode == "Inpatient" &&
        end &&
        end < chartConfig.chart.dates.contextStart) ||
      (med.OrderMode == "Outpatient" &&
        (start > today || start < chartConfig.chart.dates.contextStart))
    ) {
      return;
    }

    // Get order ID from the resource
    var ordId;
    med.IDs.forEach(function (id) {
      if (id.Type == "Internal") {
        ordId = id.ID;
      }
    });

    // Get medication name and truncate as necessary
    var medName = med.Name.match(truncateMedRegex);
    medName = medName ? medName[1].trim() || med.Name : med.Name;
    if (medName) {
      medName =
        medName.length > 35 ? medName.substr(0, 35).trim() + "..." : medName;
    }

    // Create a date map, which will be used to query the "List" resource
    // based on enconter IDs found in the encounter date map.
    // First, check if key exists for the specified date
    if (!medIdMap[ordId]) {
      medIdMap[ordId] = {};
    }

    // Create an order ID map, which will accept the encounter ID link
    // identified during the linking chopProcess and passed to the HealthChart
    // visualization library
    medIdMap[ordId].start = start;
    medIdMap[ordId].startStr = startStr;
    medIdMap[ordId].end = end || null;
    medIdMap[ordId].row = row;
    medIdMap[ordId].name = medName;
    medIdMap[ordId].orderMode = med.OrderMode;
    medIdMap[ordId].clinicAdmin = med.IsClinicAdministered;
    medIdMap[ordId].hoverDetails = [
      {
        key: "Date",
        value: startStr,
      },
    ];

    // Generate list to check all inpatient orders for administration
    // during acute care visits
    if (med.OrderMode == "Inpatient") {
      medAdminList.push({
        ID: ordId,
        Type: "Internal",
      });
    }
  });
}

function chopAddMedContext() {
  // console.log("fhirMeds ", hospitalConfig.medContextIndex);
  fhirMeds.forEach(function (v) {
    var encId;
    if (v.resource.encounter && v.resource.encounter.reference) {
      encId = v.resource.encounter.reference.replace("Encounter/", "");
    }
    if (!encId) {
      console.log(
        "Could not locate encounter medication was ordered in: " +
          v.resource.id,
        "warn"
      );
      return;
    }
    v.resource.identifier.forEach(function (id) {
      if (id.system.indexOf(hospitalConfig.medContextIndex) >= 0) {
        if (medIdMap[id.value] && v.resource.encounter.reference) {
          medIdMap[id.value].encId = medIdMap[id.value].group = encId;
        }
      }
    });
    // Check for albuterol and make a note on encounter map
    // If the encounter does not exist in the encounter map, it's likely
    // because it is beyond the date boundary HealthChart is interested in
    if (
      encMap[encId] &&
      v.resource.medicationReference &&
      albuterolRegex.test(v.resource.medicationReference.display)
    ) {
      encMap[encId]._albuterol = true;
    }

    // console.log(encMap[encId])
  });
}

function chopLinkMedAdmin() {
  // Loop on medication administration map
  _.each(medAdminMap, function (adminList, ordId) {
    // Check if the medication was administered at a clinic.
    if (medIdMap[ordId].clinicAdmin) {
      // Loop on medAdminMap to determine if the admin
      // datetime falls on an encounter date.
      adminList.forEach(function (admin) {
        // Encounter already linked or encounter not found on admin date
        if (admin.group || !encDateMap[admin.dateStr]) {
          return;
        }
        // If there is only one encounter on that day, attribute the
        // administration to that encounter
        if (encDateMap[admin.dateStr].length == 1) {
          admin.group = encDateMap[admin.dateStr][0].id;
        } else {
          // Loop on encounter by date
          encDateMap[admin.dateStr].forEach(function (enc) {
            if (enc.contactType != 101) {
              return;
            }
            // Widen the boundary window by two hours after and 30
            // minutes before to account for documentation errors.
            var tmpEnd = new Date(enc.end);
            tmpEnd.setMinutes(tmpEnd.getMinutes() + 120);
            var tmpStart = new Date(enc.start);
            tmpStart.setMinutes(tmpStart.getMinutes() - 30);
            // Associate with the encounter if it falls within the time boundary
            if (admin.date >= tmpStart && admin.date < tmpEnd) {
              admin.group = enc.id;
            }
          });
        }
      });
    } else {
      // Loop on medAdminMap to attribute an administration to
      // its ordering encounter
      // TODO - Could probably restructure this during the admin
      // return call
      adminList.forEach(function (admin) {
        // Make sure we have information about the encounter
        if (encMap[medIdMap[ordId].group]) {
          admin.group = medIdMap[ordId].group;
        } else {
          console.log(
            "Could not link med administration to encounter: " + ordId,
            "warn"
          );
        }
      });
    }
  });
}

function chopBuildMedVisObj() {
  // Map to ensure we are only plotting a single mark per encounter
  // per medication class.
  var medMap = {
    Controller: {},
    "Systemic Steroid": {},
    Biologic: {},
  };

  // Loop on admins first because they are prioritized
  _.each(medAdminMap, function (med, ordId) {
    med.forEach(function (admin) {
      if (admin.group && medIdMap[ordId].row === "Systemic Steroid") {
        encMap[admin.group]._steroid = true;
      }
      // Check if the med has  been added to the "Asthma Meds Administered" list
      if (
        encMap[admin.group] &&
        encMap[admin.group].detailMap["Asthma Meds Administered"].value.indexOf(
          medIdMap[ordId].name
        ) < 0
      ) {
        encMap[admin.group].detailMap["Asthma Meds Administered"].value.push(
          medIdMap[ordId].name
        );
      }

      // Check if a mark already exists for the encounter/group
      // If so, we don't want another mark for the same
      // encounter/medication class combo
      if (medMap[medIdMap[ordId].row][admin.group] !== undefined) {
        return;
      }

      // Flag that this encounter/medication class combo has
      // been accounted for
      medMap[medIdMap[ordId].row][admin.group] = true;

      // Check if it falls within the counter range
      if (admin.date > counterLookback) {
      
        chartConfig.rows[rowMap[medIdMap[ordId].row]].count++;
        // console.log(chartConfig.rows[rowMap[medIdMap[ordId].row]])
      }

      // Add the compressed data point to the medication array
      var tmpObj = {
        row: medIdMap[ordId].row,
        group: admin.group,
        hoverDetails: [
          {
            key: "Date",
            value: admin.dateStr,
          },
        ],
        start: admin.date,
        shape: "square",
      };

      // If the administration couldn't be linked to an encouter, we
      // need to provide basic details about the administration.
      // This situation should be infrequent, but important
      // to account for
      if (!admin.group) {
        tmpObj.details = [
          {
            label: "Date",
            value: admin.dateStr,
          },
          {
            label: "Medication",
            value: [medIdMap[ordId].name],
          },
        ];
      }
      medPlot.push(tmpObj);
    });
  });

  _.each(medIdMap, function (med, ordId) {
    // Ignore medicaitons classified as "inpatient" since they
    // are handled by the admin loop.
    // TODO - Do we care about when these were ordered? Mainly pertains
    // to biologics
    if (med.orderMode == "Inpatient") {
      return;
    }

    if (
      med.group &&
      encMap[med.group] &&
      medIdMap[ordId].row === "Systemic Steroid"
    ) {
      encMap[med.group]._steroid = true;
    }

    // Check if the med has been added to the "Asthma Meds Ordered" list
    if (
      encMap[med.group] &&
      encMap[med.group].detailMap["Asthma Meds Ordered"].value.indexOf(
        medIdMap[ordId].name
      ) < 0
    ) {
      encMap[med.group].detailMap["Asthma Meds Ordered"].value.push(
        medIdMap[ordId].name
      );
    }

    // Check if a mark already exists for the encounter/group
    // If so, we don't want another mark for the same
    // encounter/medication class combo
    if (medMap[medIdMap[ordId].row][med.group] !== undefined) {
      return;
    }

    // Flag that this encounter/medication class combo has
    // been accounted for
    medMap[medIdMap[ordId].row][med.group] = true;

    // Check if it falls within the counter range
    if (med.start > counterLookback) {
      chartConfig.rows[rowMap[medIdMap[ordId].row]].count++;
    }

    // Add the compressed data point to the medication array
    var tmpObj = {
      row: medIdMap[ordId].row,
      group: med.group,
      hoverDetails: [
        {
          key: "Date",
          value: med.startStr,
        },
      ],
      start: med.start,
      shape: "circle",
    };
    medPlot.push(tmpObj);
  });
}

// /*****************************************************
// ***************** Problem Functions ******************
// ******************************************************/

// // Validates that each encounter discharge diagnosis set
// // includes asthma but not croup.
function checkDx(dxList) {
  var asthmaDx = false;
  var croupDx = false;
  dxList.forEach(function (dx) {
    if (asthmaDxRegex.test(dx.code)) {
      asthmaDx = true;
    }
    if (dx.text && croupDxRegex.test(dx.text)) {
      croupDx = true;
    }
  });
  return asthmaDx && !croupDx;
}

async function chopFilterLocations() {
  locations.forEach(function (v) {
    if (v.extension) {
      v.extension.forEach(function (ext, i) {
        ext.valueCodeableConcept.coding.forEach(function (coding, j) {
          if (
            locationMap[v.id] === undefined &&
            coding.system.indexOf(hospitalConfig.filterLocationCodingIndex) >= 0
          ) {
            locationMap[v.id] = {
              name: v.name,
              specialty: coding.display,
              code: coding.code,
            };
          }
        });
      });
    }
    if (v.identifier) {
      v.identifier.forEach(function (id, i) {
        if (locationMap[v.id] === undefined) {
          locationMap[v.id] = {};
        }
        if (
          id.system &&
          id.system.indexOf(hospitalConfig.filterLocationIdIndex) >= 0
        ) {
          locationMap[v.id].internalId = id.value;
        }
      });
    }
  });
  // console.log("filer location", encounters)
}

async function chopPreFilterEncounters(deferred) {
  try {
    // console.log("sfjsdlfsdkljfdsljflk",encounters)
    const filterEncounters = await Promise.allSettled(
      encounters.map(async function (resource) {
        // Check status of encounter. Encounters with unknown status can be discarded.
        // This is typically from billing encounters that aren't used for clinical care
        // console.log(resource)
        if (resource.status == "unknown") {
          return false;
        }

        // Convert period to start and end date
        var start = (resource.start = dateFromString(resource.period.start));
        // console.log(new Date())
        // console.log(start);
        var startStr = stringFromDate(start);
        var end = (resource.end = dateFromString(resource.period.end));
        var endStr = stringFromDate(end);

        // Do not chopProcess future encounters
        if (!start || start > today) {
          return false;
        }

        // Due to splitting of requests, the EHR can return duplicate entries
        // if the encounter spans multiple days. Check if we've already chopProcessed this encounter
        if (encMap[resource.id]) {
          return false;
        }

        // Create global encounter map for direct access when enhancing
        // information from other APIs (e.g. medications)
        // Use the FHIR ID as the key
        encMap[resource.id] = {
          _start: start,
          _end: end,
          detailMap: {
            "Asthma Meds Ordered": {
              value: [],
            },
            "Asthma Meds Administered": {
              value: [],
            },
            Date: {
              value: startStr,
            },
            "Full Visit Report": {
              link: visitReport,
            },
            Type: {},
          },
        };

        // Obtain contact serial number (EHR encounter ID)
        resource.identifier.forEach(function (id, j) {
          if (
            id.system.indexOf(hospitalConfig.preFilterEncounterCsnIndex) >= 0
          ) {
            // Add csn to encounter object
            resource.csn = id.value;
            encMap[resource.id]._csn = resource.csn;

            // Add to CSN list to obtain DATs, which are used to
            // link to encounter reports
            csnList.push(resource.csn);
            setcsnList(csnList);
            // Add to CSN map to link care plan to encounter
            csnToFhirIdMap[resource.csn] = resource.id;
            setcsnToFhirIdMap(csnToFhirIdMap);
          }
        });

        // Do not proceed if encounter is currently active
        if (!end) {
          return false;
        }

        // Extract encounter type and class (if they exist)
        resource.type.forEach(function (type) {
          type.coding.forEach(function (v) {
            // console.log(v)
            if (
              v.system.indexOf(hospitalConfig.preFilterEncounterTypeIndex) >= 0
            ) {
              resource.contactType = +v.code;
              resource.contactName = v.display;
            } else if (
              v.system.indexOf(hospitalConfig.preFilterEncounterClassIndex) >= 0
            ) {
              // console.log(resource)
              resource.adtClass = +v.code;
              resource.adtClassName = v.display;
            }
          });
        });
        // console.log("resource", resource)
        // encDateMap is used to link clinic administered meds to outpatient encounters
        // so restricting to office visits
        if (resource.contactType == 101) {
          // Creating this complex of an encounter date map may be
          // superflous now that we can link meds to encounter IDs.
          // Can likely assume that all office visits start and stop
          // on the same day.
          if (!encDateMap[startStr]) {
            encDateMap[startStr] = [];
          }

          // Adding full resource since I will need to sort on CSN
          encDateMap[startStr].push(resource);
          if (startStr != endStr) {
            if (!encDateMap[endStr]) {
              encDateMap[endStr] = [];
            }
            encDateMap[endStr].push(resource);
          }
        }

        // Customer owned values
        if ([1, 3, 4, 5].indexOf(resource.adtClass) >= 0) {
          // Add encounter to the acute care list, which will be used to obtain
          // medication administration records.
          acuteCareList.push(resource);
        }
        // console.log("acuratecarelist",resource)
        // Check status of encounter. The values don't match up in EHR as you would expect.
        if (
          !(
            resource.status in
            {
              arrived: 1,
              finished: 1,
              "in-progress": 1,
              triaged: 1,
              planned: 1,
            }
          )
        ) {
          return false;
        }
        // console.log("resorce",resource)
        // Set visualization group to the encounter ID and populate the hover details
        // with basic information about the encounter. Hover details will be expanded
        // on within each encounter type.
        resource.group = resource.id;
        resource.hoverDetails = [
          {
            key: "Date",
            value: startStr,
          },
        ];

        // Check for "inpatient" admission
        //   1 - Inpatient
        //   5 - Observation
        if ([1, 5].indexOf(resource.adtClass) >= 0) {
          // console.log("helloooooo")
          // console.log("resorce",resource)
          // Retrieve Condition resource from the reference provided as part
          // of the "list" resource for hospital problems, if it exists
          try {
            // console.log("resorce",resource)
            if (hospitalProblemMap[resource.id]) {
              hospitalProblemMap[resource.id].forEach(async function (
                reference
              ) {
                try{
                  deferred.push(
                    await search("FHIR/R4/" + reference).then(function (
                      condition,
                      state,
                      xhr
                    ) {
                      try {
                        if (encMap[resource.id]._validDx) {
                          return false;
                        }
                        // TODO - Future state could consider capturing the data
                        // and chopProcessing later
                        if (condition.code) {
                          condition.code.coding.forEach(function (dx) {
                            if (asthmaDxRegex.test(dx.code)) {
                              encMap[resource.id]._validDx = true;
                            }
                            if (dx.text && croupDxRegex.test(dx.text)) {
                              encMap[resource.id]._croupDx = true;
                            }
                          });
                        }
                      } catch (error) {
                        chart.failure = true;
                        log(error.stack, "error");
                      }
                    })
                  );
                }catch(error){
                  console.log(error)
                }
               
              });
            }
          } catch (error) {
            console.log(error);
          }

         
          try {
            deferred.push(
              await search("FHIR/R4/Condition", {
                patient: tokenResponse.patient,
                category: "encounter-diagnosis",
                encounter: resource.id,
              }).then(function (encDx, state, xhr) {
                try {
                  encDx.entry.forEach(function (entry) {
                    if (encMap[resource.id]._validDx) {
                      return;
                    }
                    if (entry.resource.code) {
                      encMap[resource.id]._validDx = checkDx(
                        entry.resource.code.coding
                      );
                    }
                  });
                } catch (error) {
                  chart.failure = true;
                  log(error.stack, "error");
                }
              })
            );
          } catch (error) {
            console.log(error);
          }
          // Add details about the encounter to the encounter map
          encMap[resource.id].row = resource.row = "Inpatient";
          encMap[resource.id].detailMap.Type.value = resource.adtClassName;
          // console.log("enejknfje", encMap);
          // Add location to hover details
          resource.hoverDetails.push({
            key: "Location",
            value: resource.adtClassName,
          });
          // Check for ICU stays
          if (resource.location) {
            // Get location name
            resource.location.forEach(function (loc, i) {
              // Verify the location has a "period" key
              if (loc.period && loc.location.reference) {
                var locationId = loc.location.reference.replace(
                  "Location/",
                  ""
                );
                if (
                  chartConfig.icuList &&
                  locationMap[locationId] &&
                  locationMap[locationId].internalId &&
                  chartConfig.icuList.indexOf(
                    locationMap[locationId].internalId
                  ) !== -1
                ) {
                  // Add metadata and change the color and shape based
                  // on the value defined in the legend
                  encMap[resource.id].detailMap["ICU Visit"] = {
                    highlight: true,
                  };
                  resource._icu = true;
                  resource.shape =
                    chartConfig.rows[rowMap[resource.row]].legend.alt.shape;
                  resource.color =
                    chartConfig.rows[rowMap[resource.row]].legend.alt.color;
                }
              }
            });
          }
          // Check for "emergency" visit
        } else if (resource.adtClass == 3) {
          // Check if this is an encounter we should plot

          deferred = await getEncDiagnosis(resource, deferred);

          // console.log("this should be print before send of result")

          // Add details about the encounter to the encounter map
          encMap[resource.id].row = resource.row = "Emergency Only";
          encMap[resource.id].detailMap.Type.value = resource.adtClassName;

          // Add location to hover details
          resource.hoverDetails.push({
            key: "Location",
            value: resource.adtClassName,
          });
          // chopProcess all other visits
        } else {
          // Souvik debug
          // console.log("resource.adtClass  " + resource.adtClass);
          // Set visit type
          encMap[resource.id].detailMap.Type.value =
            resource.contactName || resource.adtClassName;

          if (resource.location) {
            // Get location name
            resource.location.forEach(function (loc, i) {
              // Verify the location has a "period" key
              if (resource.contactType == 3) {
                if (loc.period) {
                  resource.fullLocationName = loc.location.display;
                  // For encounters with multiple locations the application will display the last one
                  encMap[resource.id].detailMap.Location = {
                    value:
                      loc.location.display.length > 25
                        ? loc.location.display.substr(0, 25) + "..."
                        : loc.location.display,
                  };
                  resource.deptId = loc.location.reference.replace(
                    "Location/",
                    ""
                  );
                }
                return;
              }
              resource.fullLocationName = loc.location.display;
              // For encounters with multiple locations the application will display the last one
              encMap[resource.id].detailMap.Location = {
                value:
                  loc.location.display.length > 25
                    ? loc.location.display.substr(0, 25) + "..."
                    : loc.location.display,
              };
              // souvik debug
              // console.log("In prefilter", encMap[resource.id]);
              resource.deptId = loc.location.reference.replace("Location/", "");
            });
          } else {
            encMap[resource.id].detailMap.Location = {
              value: "Unknown",
            };
          }

          // Check for valid location, which also sets the row
          // TODO - These two functions should be separated
          if (!isValidLocation(resource)[0]) {
            // console.log(resource)
            return false;
          } else {
            resource = isValidLocation(resource)[1];
            // console.log("sfsdlkjfklsdjfl",resource);
          }

          // console.log("numberof resource",resource)
          // Check for a valid contact type. Office visit or urgent care
          if (resource.contactType == 3) {
            // Add encounter to the acute care list, which will be used to obtain
            // medication administration records.
            acuteCareList.push(resource);
            encMap[resource.id].detailMap.Type.value = "Urgent Care";
            resource._uc = true;
            resource.shape =
              chartConfig.rows[rowMap[resource.row]].legend.alt.shape;
            // console.Console.log("resource", resource)
          } else if (resource.contactType != 101) {
            // console.log(resource, "sjdhfdjkshfkjdshfkjdsh");
            return false;
          }

          // Add location to hover details
          resource.hoverDetails.push({
            key: "Location",
            value: resource.fullLocationName,
          });

          // Check for valid encounter diagnosis
          // console.log(resource.id)
          await getEncDiagnosis(resource, deferred);
        }

        // console.log("hellldopfdsfjdhfkjd")

        // If the code gets here, this is an encounter we are interested in
        return true;
      })
    );
    // Sorting encounter date map entries by CSN. May not be necessary anymore
    // but possibly helpful when linking admins to encounters.
    _.each(encDateMap, function (v) {
      v.sort(function (a, b) {
        if (a.csn < b.csn) {
          return -1;
        }
        if (a.csn > b.csn) {
          return 1;
        }
        return 0;
      });
    });

    encounters = encounters.filter(
      (_, i) => filterEncounters[i].value === true
    );

    // console.log("ensdfskdfl",encounters)

    return deferred;
  } catch (error) {
    console.log("prefilterecncounter Error ", error);
  }
}

function isValidLocation(resource) {
  var internalId;
  if (locationMap[resource.deptId]) {
    internalId = locationMap[resource.deptId].internalId;
  }

  // Check if this department should be ignored
  if (
    internalId &&
    chartConfig.ignoredDepts &&
    chartConfig.ignoredDepts[internalId]
  ) {
    return [false, resource];
  }

  // Check for organization specific filtering
  if (chartConfig.orgDeptMap && chartConfig.orgDeptMap[internalId]) {
    encMap[resource.id].row = resource.row = chartConfig.orgDeptMap[internalId];
    return [true, resource];
  }
  // souvik debug
  // console.log("reource: ", resource);
  // Use standardized mapping from FHIR service
  if (locationMap[resource.deptId]) {
    switch (locationMap[resource.deptId].code) {
      case "3":
        // console.log("allegry");
        encMap[resource.id].row = resource.row = "Allergy";
        return [true, resource];
      case "82":
        // console.log("hello")
        encMap[resource.id].row = resource.row = "Primary Care";
        return [true, resource];
      case "105":
        // Urgent care visit, which are plotted under Emergency Only
        encMap[resource.id].row = resource.row = "Emergency Only";
        return [true, resource];
      case "110":
        encMap[resource.id].row = resource.row = "Pulmonary";
        return [true, resource];
    }
  }
  return [false, resource];
}

function chopPostFilterEncounters() {
  // Loop over encounters after additional context has been added
  // to determine which encounters to include
  encounters = encounters.filter(function (resource) {
    // console.log("post filter ", resource);
    if (!encMap[resource.id]) {
      return false;
    }
    // Check for a valid dx
    if (!encMap[resource.id]._validDx || encMap[resource.id]._croupDx) {
      return false;
    }
    if ([1, 5].indexOf(resource.adtClass) >= 0) {
      if (!encMap[resource.id]._steroid) {
        return false;
      }
    }
    if (resource.adtClass == 3) {
      if (!encMap[resource.id]._steroid && !encMap[resource.id]._albuterol) {
        return false;
      }
    }
    // Increment the counter
    if (resource.start > counterLookback) {
      // followedBy(resource.row);
      // Add to the global counter
      chartConfig.rows[rowMap[resource.row]].count++;
      // console.log(chartConfig.rows)
      // TODO - Need to define ICU visits
      if (resource._icu || resource._uc) {
        chartConfig.rows[rowMap[resource.row]].legend.count++;
      }
    }
    return true;
  });
}

const getEncDiagnosis = async (resource, deferred) => {
  try {
    // console.log(resource.id)

    //mock data
    let encDx = {};
    if (resource.id == "euLDMs1yHH3wEjXEmtmbv0A3") {
      // console.log("helllooo")
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=euLDMs1yHH3wEjXEmtmbv0A3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiSE.QmKBtynzEhr01JHN7KaZY5xZCOyQh2eH-if4b7iVCb.RmmJoFsDfZg.DhTEvBg3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiSE.QmKBtynzEhr01JHN7KaZY5xZCOyQh2eH-if4b7iVCb.RmmJoFsDfZg.DhTEvBg3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiSE.QmKBtynzEhr01JHN7KaZY5xZCOyQh2eH-if4b7iVCb.RmmJoFsDfZg.DhTEvBg3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "427679007",
                    display: "Mild intermittent asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.91",
                    display: "Unspecified asthma, with status asthmaticus",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.22",
                    display: "Mild intermittent asthma with status asthmaticus",
                  },
                ],
                text: "Mild intermittent asthma with status asthmaticus",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/euLDMs1yHH3wEjXEmtmbv0A3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133188",
                },
                display: "Emergency",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "eOEet6qLLSEijc1iC5y8A4A3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 2,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=eOEet6qLLSEijc1iC5y8A4A3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdIm.BbyZxEQUbb9V-EDbHIIBW0DwcyMEkjPCijbEV51IpA3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdIm.BbyZxEQUbb9V-EDbHIIBW0DwcyMEkjPCijbEV51IpA3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdIm.BbyZxEQUbb9V-EDbHIIBW0DwcyMEkjPCijbEV51IpA3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "427679007",
                    display: "Mild intermittent asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.92",
                    display: "Unspecified asthma, with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Mild intermittent asthma with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eOEet6qLLSEijc1iC5y8A4A3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133184",
                },
                display: "Emergency",
              },
            },
            search: {
              mode: "match",
            },
          },
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdImMsqlwcxMQqhi1iBfSPeegZX6b3d5QEhdy4Ha4EfgP1A3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdImMsqlwcxMQqhi1iBfSPeegZX6b3d5QEhdy4Ha4EfgP1A3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdImMsqlwcxMQqhi1iBfSPeegZX6b3d5QEhdy4Ha4EfgP1A3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "427679007",
                    display: "Mild intermittent asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.91",
                    display: "Unspecified asthma, with status asthmaticus",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.22",
                    display: "Mild intermittent asthma with status asthmaticus",
                  },
                ],
                text: "Mild intermittent asthma with status asthmaticus",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eOEet6qLLSEijc1iC5y8A4A3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133184",
                },
                display: "Emergency",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "e4LaS4sGigpkTxY6ilo3gEQ3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=e4LaS4sGigpkTxY6ilo3gEQ3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWid1qTVecyCfoiNu-L6N7gi9d4O4WVV7QQcAJfNzEA4wBItXpVS1a7mITq.4SPqnlJg3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWid1qTVecyCfoiNu-L6N7gi9d4O4WVV7QQcAJfNzEA4wBItXpVS1a7mITq.4SPqnlJg3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWid1qTVecyCfoiNu-L6N7gi9d4O4WVV7QQcAJfNzEA4wBItXpVS1a7mITq.4SPqnlJg3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/e4LaS4sGigpkTxY6ilo3gEQ3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133205",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "eJax.3V2SXJDD.zDnyfzy5g3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=eJax.3V2SXJDD.zDnyfzy5g3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiRAVuynt4vtwMAIMXPRd8tEPKtZPErCWMZx0GvLLQGXUC.DoRBco-2ivO88RonRVeA3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiRAVuynt4vtwMAIMXPRd8tEPKtZPErCWMZx0GvLLQGXUC.DoRBco-2ivO88RonRVeA3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiRAVuynt4vtwMAIMXPRd8tEPKtZPErCWMZx0GvLLQGXUC.DoRBco-2ivO88RonRVeA3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "427679007",
                    display: "Mild intermittent asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.90",
                    display: "Unspecified asthma(493.90)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.20",
                    display: "Mild intermittent asthma, uncomplicated",
                  },
                ],
                text: "Mild intermittent asthma, unspecified whether complicated",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eJax.3V2SXJDD.zDnyfzy5g3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133191",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "eVF-DJJeSAYYhQG4l7OaZ2A3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 2,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=eVF-DJJeSAYYhQG4l7OaZ2A3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ1bqqA79qJdhZcpNhm5JuN4RV6aAIIT39nUstz7DCIF0Q3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ1bqqA79qJdhZcpNhm5JuN4RV6aAIIT39nUstz7DCIF0Q3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ1bqqA79qJdhZcpNhm5JuN4RV6aAIIT39nUstz7DCIF0Q3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "707512002",
                    display:
                      "Uncomplicated moderate persistent asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.90",
                    display: "Unspecified asthma(493.90)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.40",
                    display: "Moderate persistent asthma, uncomplicated",
                  },
                ],
                text: "Moderate persistent asthma without complication",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eVF-DJJeSAYYhQG4l7OaZ2A3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133198",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ066d2jutuUcMOnxCntPmMyv-f9ZmTIs2LNTrM2FGDGfw3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ066d2jutuUcMOnxCntPmMyv-f9ZmTIs2LNTrM2FGDGfw3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ066d2jutuUcMOnxCntPmMyv-f9ZmTIs2LNTrM2FGDGfw3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eVF-DJJeSAYYhQG4l7OaZ2A3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133198",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "ec51kmFLswd43eF3tVxl5iA3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=ec51kmFLswd43eF3tVxl5iA3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiWCs2LmbfvBqRcPDiKXUDCSol16Ds-ZuMwXOPVYkYKklEQu.a9eEo0aPzQ3pXKnsXQ3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiWCs2LmbfvBqRcPDiKXUDCSol16Ds-ZuMwXOPVYkYKklEQu.a9eEo0aPzQ3pXKnsXQ3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiWCs2LmbfvBqRcPDiKXUDCSol16Ds-ZuMwXOPVYkYKklEQu.a9eEo0aPzQ3pXKnsXQ3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/ec51kmFLswd43eF3tVxl5iA3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133203",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "elUgpw0Sa9VqWJJb6n2BJPA3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=elUgpw0Sa9VqWJJb6n2BJPA3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXauPOxH0Mmu8390oLkTsUSSqEFi-xZ5TJE5EtfGI9GOEOfvWKMYBcRl750JyyQeMw3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXauPOxH0Mmu8390oLkTsUSSqEFi-xZ5TJE5EtfGI9GOEOfvWKMYBcRl750JyyQeMw3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiXauPOxH0Mmu8390oLkTsUSSqEFi-xZ5TJE5EtfGI9GOEOfvWKMYBcRl750JyyQeMw3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/elUgpw0Sa9VqWJJb6n2BJPA3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133194",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "eFzbodhqV8RJ4yAzfRh7UyQ3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=eFzbodhqV8RJ4yAzfRh7UyQ3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiR57bd1gmT0CpUKOSQ86BWtSpCiMluKT0QYGR49vOEY2kZKBduhFV5enXjpNeMd1gQ3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiR57bd1gmT0CpUKOSQ86BWtSpCiMluKT0QYGR49vOEY2kZKBduhFV5enXjpNeMd1gQ3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiR57bd1gmT0CpUKOSQ86BWtSpCiMluKT0QYGR49vOEY2kZKBduhFV5enXjpNeMd1gQ3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eFzbodhqV8RJ4yAzfRh7UyQ3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133208",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "eL0PyrCZ-4638FHl.IRBvRw3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=eL0PyrCZ-4638FHl.IRBvRw3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWieG4shxirIe2Q17k25jvB6sAXLtJ-wHpwiKoYPT.rMs8tfteo2Mq4Na519a.LDpX-A3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWieG4shxirIe2Q17k25jvB6sAXLtJ-wHpwiKoYPT.rMs8tfteo2Mq4Na519a.LDpX-A3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWieG4shxirIe2Q17k25jvB6sAXLtJ-wHpwiKoYPT.rMs8tfteo2Mq4Na519a.LDpX-A3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eL0PyrCZ-4638FHl.IRBvRw3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133206",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "edxRb2-cSfStwNNCrgw8PrQ3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 0,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=edxRb2-cSfStwNNCrgw8PrQ3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            fullUrl: "urn:uuid:1edf7166-40ef-497f-9109-4261d975bcd7",
            resource: {
              resourceType: "OperationOutcome",
              issue: [
                {
                  severity: "warning",
                  code: "processing",
                  details: {
                    coding: [
                      {
                        system: "urn:oid:1.2.840.114350.1.13.20.3.7.2.657369",
                        code: "4101",
                        display: "Resource request returns no results.",
                      },
                    ],
                    text: "Resource request returns no results.",
                  },
                },
              ],
            },
            search: {
              mode: "outcome",
            },
          },
        ],
      };
    }

    // console.log("encdx",encDx)

    encDx.entry.forEach(function (entry) {
      // console.log("entry", entry.resource);

      // Check if the resource has already been validated
      if (encMap[resource.id]._validDx) {
        return;
      }

      if (entry.resource.code) {
        // If the entry has a code, validate it
        encMap[resource.id]._validDx = checkDx(entry.resource.code.coding);
        // console.log("Validated DX:", encMap[resource.id]._validDx);
      }
    });

    // console.log("Code after setTimeout");
    // console.log(resource.id)

    // deferred.push(
    //   await search("FHIR/R4/Condition", {
    //     patient: tokenResponse.patient,
    //     category: "encounter-diagnosis",
    //     encounter: resource.id,
    //   }).then(function (encDx, state, xhr) {
    //     try {

    //       encDx.entry.forEach(function (entry) {
    //         if (encMap[resource.id]._validDx) {
    //           return;
    //         }
    //         if (entry.resource.code) {
    //           encMap[resource.id]._validDx = checkDx(
    //             entry.resource.code.coding
    //           );
    //         }
    //       });

    //       return deferred;
    //     } catch (error) {
    //       // chart.failure = true;
    //       console.log(error, "error");
    //     }
    //   })
    // );
  } catch (error) {
    console.log("getEncDiagnosisError ", error);
  }
};

function visitReport(elem, data) {
  try {
    var csnToDatMap = getcsnToDatMap();
    console.log(data.row + " encounter report click event.", "info");
    executeAction({
      action: "Epic.Clinical.Informatics.Web.LaunchActivity",
      args: {
        ActivityKey: "REPORTVIEWER",
        Parameters: {
          REPORTPROVIDER: "MR_REPORTS",
          REPORTCONTEXT:
            "11^R99#,EPT," +
            tokenResponse.eptIdIn +
            "," +
            csnToDatMap[data._csn] +
            ",1",
        },
      },
    });
  } catch (error) {
    log(error.stack, "error");
  }
}

async function readFileFromURL(url) {
  try {
    // console.log("hiiiiii")
    const response = await axios.get(url, { responseType: "text" });
    // console.log(response.data);

    return response;
  } catch (error) {
    throw new Error("Error reading file from URL: " + error.message);
  }
}

// Function to read content from local file
async function readFileFromLocalPath(filePath) {
  try {
    return await fs.promises.readFile(filePath, "utf8");
  } catch (error) {
    throw new Error("Error reading local file: " + error.message);
  }
}

// Function to read file content based on input
async function readFile(input) {
  // console.log("hellooo")
  if (input.startsWith("http://") || input.startsWith("https://")) {
    // Input is a URL
    return await readFileFromURL(input);
  } else {
    // Input is a local file path
    return await readFileFromLocalPath(input);
  }
}

async function getMedAdmin() {
  try {
    // mock data
    medadmin.Orders.forEach(function (d) {
      // This should never happen, but adding check
      // just in case.
      if (!medIdMap[d.OrderID.ID]) {
        return;
      }
      //mock data
      d.MedicationAdministrations.forEach(function (admin) {
        var adminDate = dateFromString(admin.AdministrationInstant);
        if (
          admin.AdministrationInstant &&
          adminDate > chartConfig.chart.dates.contextStart
        ) {
          if (!medAdminMap[d.OrderID.ID]) {
            medAdminMap[d.OrderID.ID] = [];
          }
          medAdminMap[d.OrderID.ID].push({
            date: adminDate,
            dateStr: stringFromDate(adminDate),
          });
        }
      });
    });

    // return await search(
    //   "epic/2014/Clinical/Patient/GETMEDICATIONADMINISTRATIONHISTORY/MedicationAdministration",
    //   JSON.stringify({
    //     PatientID: tokenResponse.patient,
    //     PatientIDType: "FHIR",
    //     ContactID: tokenResponse.csn,
    //     ContactIDType: "CSN",
    //     OrderIDs: medAdminList,
    //   }),
    //   "POST",
    //   {
    //     "Content-Type": "application/json",
    //   }
    // ).then(function (adminHistory, state, xhr) {
    //   try {
    //     if (!adminHistory.Orders) {
    //       return;
    //     }
    //     adminHistory.Orders.forEach(function (d) {
    //       // This should never happen, but adding check
    //       // just in case.
    //       if (!medIdMap[d.OrderID.ID]) {
    //         return;
    //       }
    //       d.MedicationAdministrations.forEach(function (admin) {
    //         var adminDate = dateFromString(admin.AdministrationInstant);
    //         if (
    //           admin.AdministrationInstant &&
    //           adminDate > chartConfig.chart.dates.contextStart
    //         ) {
    //           if (!medAdminMap[d.OrderID.ID]) {
    //             medAdminMap[d.OrderID.ID] = [];
    //           }
    //           medAdminMap[d.OrderID.ID].push({
    //             date: adminDate,
    //             dateStr: stringFromDate(adminDate),
    //           });
    //         }
    //       });
    //     });
    //   } catch (error) {
    //     chart.failure = true;
    //     log(error.stack, "error");
    //   }
    // });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  buildApp,
};
