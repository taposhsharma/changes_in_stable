
function setPreviousPage() {
  // Get the element by its ID
  var element = document.getElementById("addConfig_a");

  // Change the opacity to 1(100%)
  element.style.opacity = "1";
  localStorage.setItem("previousUrl", window.location.pathname);
}
setPreviousPage();

// Selecting the form element
const formCheck = document.querySelector("#checkForm");

// handle select hospital for check config starts

function populateDropdown() {
  const dropdown = document.getElementById("hospitalDropdownCheck");

  // Create a default "Select" option
  let defaultOption = document.createElement("option");
  defaultOption.textContent = "Select a Hospital*";
  defaultOption.value = "";
  let hospitals = [];
  dropdown.appendChild(defaultOption);
  // fetch hospital data
  fetch("http://localhost:3006/frontend/getHospitalData")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // debug
      // console.log("hospitals data", data);
      // Assuming the response contains an array named 'hospitals'
      hospitals = data;
      // Now you can work with the 'hospitals' array

      // sort hospitals by hospital name
      hospitals.sort(function (hospital1, hospital2) {
        let hospital1Name = hospital1.hospital_name.toUpperCase();
        let hospital2Name = hospital2.hospital_name.toUpperCase();

        if (hospital1Name < hospital2Name) {
          return -1;
        }
        if (hospital1Name > hospital2Name) {
          return 1;
        }
        return 0;
      });
      // debug
      // console.log("hospitals", hospitals);
      hospitals.forEach((hospital) => {
        let option = document.createElement("option");
        option.textContent = hospital.hospital_name;
        option.value = hospital.id;
        dropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  // debug

  // Populate dropdown with hospitals
}

function logSelectedOption() {
  const dropdown = document.getElementById("hospitalDropdownCheck");
  dropdown.addEventListener("change", function () {
    // Find the selected hospital object
    const selectedHospital = hospitals.find(
      (hospital) => hospital.id == this.value
    );
    // Log the selected hospital or a message if default option is selected
    console.log(selectedHospital ? selectedHospital : "No hospital selected");
  });
}

// Populate the dropdown on page load
populateDropdown();
// Attach the event listener to log the selected option
logSelectedOption();

// handle select hospital for check config ends

function handleFormSubmit() {
  // Prevent default form submission
  console.log("submit clicked");

  // Show the config details div
  document.getElementById("configDetails").style.display = "block";

  // Optional: Add any additional logic after showing details (e.g., clear form)
  return false; // Explicitly return false to prevent form submission
}

// // Adding event listener for add form submit
// formCheck.addEventListener("submit", function (event) {
//   event.preventDefault();
//   const hospitalId = document.getElementById("hospitalDropdownCheck").value;
// });

// --------------------------------------------------------------------------------

// Selecting the form element
const formAdd = document.querySelector("#addForm");

// handle select hospital add config starts

function populateDropdownAdd() {
  const dropdown = document.getElementById("hospitalDropdownAdd");

  // Create a default "Select" option
  let defaultOption = document.createElement("option");
  defaultOption.textContent = "Select a Hospital*";
  defaultOption.value = "";
  let hospitals = [];
  dropdown.appendChild(defaultOption);
  // fetch hospital data
  fetch("http://localhost:3006/frontend/getHospitalData")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // debug
      // console.log("hospitals data", data);
      // Assuming the response contains an array named 'hospitals'
      hospitals = data;
      // Now you can work with the 'hospitals' array

      // sort hospitals by hospital name
      hospitals.sort(function (hospital1, hospital2) {
        let hospital1Name = hospital1.hospital_name.toUpperCase();
        let hospital2Name = hospital2.hospital_name.toUpperCase();

        if (hospital1Name < hospital2Name) {
          return -1;
        }
        if (hospital1Name > hospital2Name) {
          return 1;
        }
        return 0;
      });
      // debug
      // console.log("hospitals", hospitals);
      hospitals.forEach((hospital) => {
        let option = document.createElement("option");
        option.textContent = hospital.hospital_name;
        option.value = hospital.id;
        dropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  // debug

  // Populate dropdown with hospitals
}

function logSelectedOptionAdd() {
  const dropdown = document.getElementById("hospitalDropdownAdd");
  dropdown.addEventListener("change", function () {
    // Find the selected hospital object
    const selectedHospital = hospitals.find(
      (hospital) => hospital.id == this.value
    );
    // Log the selected hospital or a message if default option is selected
    console.log(selectedHospital ? selectedHospital : "No hospital selected");
  });
}

// Populate the dropdown on page load
populateDropdownAdd();
// Attach the event listener to log the selected option
logSelectedOptionAdd();

// handle select hospital add config ends

// Adding event listener for add form submit
formAdd.addEventListener("submit", function (event) {
  event.preventDefault();

  const hospitalId = document.getElementById("hospitalDropdownAdd").value;

  const medContextIndexValue =
    document.getElementById("medContextIndexAdd").value;
  const filterLocationCodingIndexValue = document.getElementById(
    "filterLocationCodingIndexAdd"
  ).value;
  const filterLocationIdIndexValue = document.getElementById(
    "filterLocationIdIndexAdd"
  ).value;
  const preFilterEncounterCsnIndexValue = document.getElementById(
    "preFilterEncounterCsnIndexAdd"
  ).value;
  const preFilterEncounterTypeIndexValue = document.getElementById(
    "preFilterEncounterTypeIndexAdd"
  ).value;
  const preFilterEncounterClassIndexValue = document.getElementById(
    "preFilterEncounterClassIndexAdd"
  ).value;

  const configDetails = {
    hospitalId: hospitalId,
    medContextIndex: medContextIndexValue,
    filterLocationCodingIndex: filterLocationCodingIndexValue,
    filterLocationIdIndex: filterLocationIdIndexValue,
    preFilterEncounterCsnIndex: preFilterEncounterCsnIndexValue,
    preFilterEncounterTypeIndex: preFilterEncounterTypeIndexValue,
    preFilterEncounterClassIndex: preFilterEncounterClassIndexValue,
  };

  console.log(configDetails);

  // Making the POST request
  fetch("http://localhost:3006/frontend/addConfig", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(configDetails),
  })
    .then((response) => {
      console.log("response: ", response);
      if (response.ok) {
        // Get the actual response data (assuming JSON format)
        return response.json(); // This returns a promise that resolves to the parsed JSON data
      } else {
        return Promise.reject(response); // Reject the promise with the response object for error handling
      }
    })
    .then((data) => {
      // This then block handles the parsed response data (if successful)
      console.log("Actual response data:", data);
      // Access data properties here (e.g., data.message, data.status)
      if (data.message === "Config File Already Exists!") {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: data.message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
      else if(data.message === "Config File Added Successfully!"){
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: data.message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
      else{
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong",
          showConfirmButton: false,
          timer: 3000,
        });
      }
      
      formAdd.reset();
    })
    .catch((error) => {
      // This catch block handles errors (including rejected promise from previous then block)
      // Handle errors here
      console.error("Error in adding config:", error.statusText || error); // Use error.statusText if available, otherwise default error message
    });
});
