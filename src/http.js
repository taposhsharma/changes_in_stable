const { getTokenResponse, getState } = require("./chopShared");
const mockdata = require("../middleware/mockData");
const {log,logD} = require('./loger')

const { JSDOM } = require("jsdom");

var urlRegex = /.*api\/(.*)/;

const _ = require("lodash");
const { error } = require("jquery");
const medsdata = require("./medsdata");
const jquery = require("jquery")(new JSDOM().window);
let tokenResponse, state;
function search(endpoint, data, method, headers) {
  try {
    tokenResponse = getTokenResponse();
    // console.log(tokenResponse)
    state = getState();
    // console.log(tokenResponse)
    method = method || "GET";

    // Build headers
    headers = headers || {};
    headers.Authorization = "Bearer " + tokenResponse.access_token;
    headers.accept = "application/json";

    // Initialize url variable
    var url;
    // Conditionally constructs endpoint based on the base URL
    if (endpoint.indexOf("chop.edu") >= 0) {
      url = endpoint;
    } else {
      url = state.baseUrl + endpoint;
    }

    // Get time object. Date.now() is more efficient, which is
    // why we attempt to get this first, but it is not available
    // in all versions of IE.
    var time = Date ? Date.now() : new Date();
    if (url.includes("fhir.epic.com")) {
      
      url = mockdata(endpoint,data)
      // console.log(url)
      return jquery.ajax({
        url:url,
        type:method,
        success:function(data){
          logD("api call successfull","info")
        },
        error:function (xhr, textStatus, errorThrown) {
          // Log the error here, but rely on the "then" fail function from the "when"
          // to determine if the application should fail
          console.log(
            this.type +
              " " +
              this.url +
              " " +
              xhr.status +
              " (" +
              (xhr.responseText || errorThrown) +
              ")",
            "error"
          );
        },
      })
    } else{
      return jquery.ajax({
        url: url,
        type: method,
        headers: headers,
        time: time,
        timeout: 20000,
        traditional: true,
        data: data,
        success: function (xhr) {
          // Only send metrics for Encounter and MedicationRequest requests
          if (
            this.url.indexOf("FHIR/R4/Encounter") === -1 &&
            this.url.indexOf("FHIR/R4/MedicationRequest") === -1
          ) {
            return;
          }

          // Get time object. Date.now() is more efficient, which is
          // why we attempt to get this first, but it is not available
          // in all versions of IE.
          var endTime = Date ? Date.now() : new Date();

          // Extract path and cache timestamp from url
          var urlMatch = this.url.match(urlRegex);
          var tmpObj = {
            "transaction.duration.ms": endTime - this.time,
          };

          if (urlMatch) {
            if (urlMatch[1]) {
              tmpObj.path = urlMatch[1];
            }
          }

          // Log transaction time for individual request
          // Uses logD to avoid holding up the current transactions
          logD(tmpObj, "info");
        },
        error: function (xhr, textStatus, errorThrown) {
          // Log the error here, but rely on the "then" fail function from the "when"
          // to determine if the application should fail
          log(
            this.type +
              " " +
              this.url +
              " " +
              xhr.status +
              " (" +
              (xhr.responseText || errorThrown) +
              ")",
            "error"
          );
        },
      });
    

    }
     
    // return url
    // Send request
  } catch (error) {
    // chartConfig.chart.failure = true;
    log(error.stack, "error");
   
  }
}

module.exports = {
  search,
};
