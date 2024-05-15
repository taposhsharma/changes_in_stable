function setPreviousPage() {
    // Get the element by its ID
    var element = document.getElementById("addConfig_a");
  
    // Change the opacity to 1(100%)
    element.style.opacity = "1";
    localStorage.setItem("previousUrl", window.location.pathname);
  }
  setPreviousPage();
  
  // Selecting the form element
  const form = document.querySelector(".custom-form");
  
  // handle select hospital starts
  
  function populateDropdown() {
      const dropdown = document.getElementById("hospitalDropdown");
    
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
      const dropdown = document.getElementById("hospitalDropdown");
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
  
  // handle select hospital ends 
  
  
  // Adding event listener for form submit
  form.addEventListener("submit", function (event) {
    console.log("submit clicked");
    event.preventDefault();
  
    const hospitalIdValue = document.getElementById("hospitalDropdown").value;
    const labelValue = document.getElementById("label").value;
    const textValue = document.getElementById("text").value;
    const actionValue = document.getElementById("action").value;
    const activityKeyValue = document.getElementById("activityKey").value;

    
    const resourceDetails = {
        hospitalId: hospitalIdValue,
        label: labelValue,
        text: textValue,
        action: actionValue,
        activityKey: activityKeyValue
    };
  
    console.log(resourceDetails);
  
    // Making the POST request
    fetch("http://localhost:3006/frontend/addresources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resourceDetails),
    })
      .then((response) => {
        console.log("response", response);
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Resource Added Successfully",
            showConfirmButton: false, // Remove the confirm button
            timer: 2000, // Automatically close after 1.5 seconds
          });
          form.reset();
          // You can perform further actions here after the request is successful
        } else {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Resource with this id already exists",
                showConfirmButton: false, // Remove the confirm button
                timer: 2000, // Automatically close after 1.5 seconds
              });
          console.error("Error in adding Resource");
        }
      })
      .catch((error) => {
        console.error("Error in adding Resource:", error);
      });
  });
  