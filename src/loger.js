const { JSDOM } = require("jsdom");
const jquery = require("jquery")(new JSDOM().window);
require("dotenv").config();

const {getTokenResponse,getSessionStorage}  = require('./chopShared')

var logList = [];
var tokenResponse
var sessionStorage

function log(message, level){
    tokenResponse = getTokenResponse()
    sessionStorage = getSessionStorage()
    // Convert to a consistent environment label to determine where logs are stored
    // var buildEnv = __BUILD_ENVIRONMENT__ == "production" ? "prod" : "test";
    var buildEnv = "test"

    // Set a default level if none exists
    level = level || "debug";

    // Only send "info" and higher logs for prod
    if (buildEnv == "prod" && (level != "error" & level != "warn" & level != "info")) {
        return;
    }

    // Set app name - TODO - Move somewhere else
    var APP_NAME = "healthchart-inpatient-asthma";

    // Build log message
    var data = {
        application: APP_NAME,
        environment: buildEnv,
        level: level,
    };
//    
    // Check tokenResponse is defined
    if (tokenResponse) {
        data.patFHIRId = tokenResponse.patient;
        data.encounter = tokenResponse.encounter;
        data.csn = tokenResponse.csn;
        data.patient = tokenResponse.eptId;
        data.user = tokenResponse.userId;
    }
   

    // Get EHR environment
    var runtimeEnv = sessionStorage["env"];
    // console.log(runtimeEnv,"snsnf,msdnf,msndf")
    if (runtimeEnv) {
        data.ehr = runtimeEnv;
    }
     

    // Conditionally add keys to log object
    if (typeof message === "object") {
        jQuery.extend(data, message);
    } else if (typeof message === "string") {
        data.msg = message;
    } else {
        return;
    }
   

    // // Add date if not set
    if (!data.date) {
        data.date = new Date().toISOString();
    }
    // console.log(data) 
    // Send message to logging server
    try{
        jquery.ajax({
            type:"POST",
            url: "http://localhost:3006/file/logs",
            data: JSON.stringify(data),
            contentType: "application/json",
            timeout:2000
        });
    } catch (error) {}
}

function logD(message, level) {
    try {
        var tmpObj = {
            message: message,
            level: level || "debug"
        };

        logList.push(tmpObj);
        // console.log(logList)
    } catch (error) {}
}

function flushLogs() {
    try {
        logList.forEach(function(v) {
            log(v.message, v.level);
        });

        // Reset log list
        logList = [];
    } catch (error) {}
}

module.exports =  {
    log,
    logD,
    flushLogs
};