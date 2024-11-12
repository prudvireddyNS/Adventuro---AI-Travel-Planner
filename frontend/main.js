function initializeAutocomplete() {
  // Initialize autocomplete for the source input field
  const sourceInput = document.getElementById("source");
  const sourceAutocomplete = new google.maps.places.Autocomplete(sourceInput);

  // Initialize autocomplete for the destination input field
  const destinationInput = document.getElementById("destination");
  const destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput
  );

  // Optional: Listen for place change events
  sourceAutocomplete.addListener("place_changed", function () {
    const place = sourceAutocomplete.getPlace();
    // console.log("Source Place:", place);
  });

  destinationAutocomplete.addListener("place_changed", function () {
    const place = destinationAutocomplete.getPlace();
    // console.log("Destination Place:", place);
  });
}

// Initialize autocomplete when the page is loaded
google.maps.event.addDomListener(window, "load", initializeAutocomplete);

let selectedBudget = null;
let selectedPeople = null;
let source, destination, noOfDays;

document.addEventListener("DOMContentLoaded", () => {
  // Select all budget and people cards
  const budgetCards = document.querySelectorAll(".budget-card");
  const peopleCards = document.querySelectorAll(".people-card");

  // Function to handle card selection
  const handleCardSelection = (cards, type) => {
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        // Deselect all cards in the same group
        cards.forEach((c) => c.classList.remove("selected"));

        // Select the clicked card
        card.classList.add("selected");

        // Store selected data
        if (type === "budget") {
          selectedBudget = card.getAttribute("data-budget");
        } else if (type === "people") {
          selectedPeople = card.getAttribute("data-people");
        }
      });
    });
  };
  function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const expiration = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > expiration; // Check if current time is past the expiration time
  }
  
  function isLoggedIn() {
    const token = localStorage.getItem("token");
    if (!token) return false; // No token found
  
    // Check if the token is expired
    return !isTokenExpired(token);
  }
  // Attach event handlers to both budget and people cards
  handleCardSelection(budgetCards, "budget");
  handleCardSelection(peopleCards, "people");

  const generateBtn = document.getElementById("generatebtn");
  generateBtn.addEventListener("click", () => {
    // document.getElementById("acccards").innerHTML = "";
    // document.getElementById("transcards").innerHTML = "";
    // document.getElementById("activiards").innerHTML = "";
    if (isLoggedIn()) {
      document.getElementsByClassName("tripcard").innerHTML = "";
      source = document.querySelector("#source").value;
      destination = document.querySelector("#destination").value;
      noOfDays = document.querySelector("#noofdays").value;
  
      if (selectedBudget && selectedPeople && source && destination && noOfDays) {
        document.querySelector("#trip_section").style.display = "flex";
        triggerShineEffect();
  
        console.log("API call sent");
        fetchAccommodationData();
        fetchTransportationData();
        fetchActivitiesData();
      } else {
        alert("Please select both a budget and people option!");
      }
    } else {
      alert("You need to be logged in to generate trip details.");
      window.location.href = "getstarted.html"; // Redirect to login page
    }
  });
  
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  setTimeout(() => {
    window.location.href = "getstarted.html";
  }, 500);
});



function triggerShineEffect() {
  const cards = document.querySelectorAll(".tripcard");
  // cards.innerHTML="";
  cards.forEach((card) => {
    card.classList.add("shine-effect");
  });
}


// Function to stop the shine effect after data is rendered
function stopShineEffect() {
  const cards = document.querySelectorAll(".tripcard");
  cards.innerHTML="";
  cards.forEach((card) => {
    card.classList.remove("shine-effect");
  });
}
let accommodationData = [];
let transportationData = [];
let ActivitesData=[]

// Arrays to track selected indices
let selectedAccommodationIndices = [];
let selectedTransportationIndices = [];
let selectedActivitesIndices=[];

// Function to fetch accommodation data from the API
async function fetchAccommodationData() {
  try {
    triggerShineEffect();
    const response = await fetch(
      "https://travel-planner-api-b6l8.onrender.com/adventuro/accommodation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: destination, // Now correctly using the scoped variable
          budget: selectedBudget,
          duration: `${noOfDays} days`, // Now correctly using the scoped variable
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }

    const data = await response.json();
    createAccommodationCards(data);
  } catch (error) {
    console.error("Error fetching accommodation data:", error);
  } finally {
    stopShineEffect();
  }
}

// Function to create accommodation cards dynamically
function createAccommodationCards(data) {
  accommodationData = data.accommodations; // Store data in the array
  const accCardsContainer = document.getElementById("acccards");
  accCardsContainer.innerHTML = ""; // Clear any existing cards

  accommodationData.forEach((acc, index) => {
    const card = document.createElement("div");
    card.className = "tripcard";
    card.setAttribute("data-index", index); // Set data-index attribute

    // Set card content
    card.innerHTML = `
      <div class="tripcard-header" id='shinecard'>
        <div class="hotel-details">
          <h2 class="hotel-name">${acc.name}</h2>
          <p class="hotel-price">${acc.price}</p>
          <p class="hotel-rating"><strong>Rating:</strong> ${acc.rating}</p>
        </div>
        <div class="acclogo">
          <video class="acclogovideo" src="images/14659871.mp4" autoplay muted loop></video>
        </div>
      </div>
      <div class="hidden-info">
        <p class="hotel-location"><strong>Location:</strong> ${acc.location}</p>
        <p class="hotel-room"><strong>Room Type:</strong> ${acc.room_type}</p>
        <p class="hotel-amenities"><strong>Amenities:</strong> ${acc.amenities.join(
          ", "
        )}</p>
      </div>
    `;

    // Add click event to toggle selection
    card.addEventListener("click", () => {
      const index = card.getAttribute("data-index");
      const isSelected = selectedAccommodationIndices.includes(index);

      if (isSelected) {
        // Deselect the card
        selectedAccommodationIndices = selectedAccommodationIndices.filter(
          (i) => i !== index
        );
        card.classList.remove("selected"); // Remove selected styling
      } else {
        // Select the card
        selectedAccommodationIndices.push(index);
        card.classList.add("selected"); // Add selected styling
      }

      console.log(
        "Selected Accommodations:",
        selectedAccommodationIndices.map((i) => accommodationData[i])
      );
    });

    // Append the card to the container
    accCardsContainer.appendChild(card);
  });
}

// Function to fetch transportation data from the API
async function fetchTransportationData() {
  try {
    triggerShineEffect();
    console.log("Fetching transport data");
    const response = await fetch(
      "https://travel-planner-api-b6l8.onrender.com/adventuro/transportation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_location: source, // Now correctly using the scoped variable
          to_location: destination,
          budget: selectedBudget,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }

    const data = await response.json();
    createTransportationCards(data);
  } catch (error) {
    console.error("Error fetching transportation data:", error);
  } finally {
    stopShineEffect();
  }
}

// Function to create transportation cards dynamically
function createTransportationCards(data) {
  transportationData = data.transportation_options; // Store data in the array
  const transCardsContainer = document.getElementById("transcards");
  transCardsContainer.innerHTML = ""; // Clear any existing cards

  transportationData.forEach((option, index) => {
    let videosrc;
    if (option.mode_of_transport === "Flight") {
      videosrc = "images/fight.mp4";
    }
    else if (option.mode_of_transport === "Bus" ||option.mode_of_transport === "Luxury Bus") {
      videosrc = "images/bus.mp4";
    }
    else  if (option.mode_of_transport === "Train") {
      videosrc = "images/train.mp4";
    }
    else if (option.mode_of_transport === "Private Taxi") {
      videosrc = "images/taxi.mp4";
    }
    else if (option.mode_of_transport === "Car Rental" ||option.mode_of_transport === "Car Rental (Luxury)") {
      videosrc = "images/car.mp4";
    }
    else{
      videosrc = "images/14659871.mp4";
    }
    const card = document.createElement("div");
    card.className = "tripcard";
    card.setAttribute("data-index", index); // Set data-index attribute

    // Set card content
    card.innerHTML = `
      <div class="transcarddiv">
        <div class="card-header">
          <div class="transport-details">
            <p class='card-p'><span>${option.departure_time}</span> &rarr; <span>${option.arrival_time}</span></p>
            <p class='card-p'><strong>Travel Duration:</strong> ${option.travel_duration}</p>
            <p class='card-p'><strong>Price:</strong> ${option.price}</p>
          </div>
          <div class="trans-video">
            <video class="acclogovideo" src=${videosrc} autoplay muted loop></video>
          </div>
        </div>
        <div class="hidden-info">
          <p class='card-p'><strong>Departure Location:</strong> ${option.departure_location}</p>
          <p class='card-p'><strong>Arrival Location:</strong> ${option.arrival_location}</p>
          <p class='card-p'><strong>Cancellation Policy:</strong> ${option.cancellation_policy}</p>
          <p class='card-p'><strong>Special Notes:</strong> ${option.special_notes}</p>
        </div>
      </div>
    `;

    // Add click event to toggle selection
    card.addEventListener("click", () => {
      const index = card.getAttribute("data-index");
      const isSelected = selectedTransportationIndices.includes(index);

      if (isSelected) {
        // Deselect the card
        selectedTransportationIndices = selectedTransportationIndices.filter(
          (i) => i !== index
        );
        card.classList.remove("selected"); // Remove selected styling
      } else {
        // Select the card
        selectedTransportationIndices.push(index);
        card.classList.add("selected"); // Add selected styling
      }

      console.log(
        "Selected Transportation:",
        selectedTransportationIndices.map((i) => transportationData[i])
      );
    });

    // Append the card to the container
    transCardsContainer.appendChild(card);
  });
}

// Function to fetch activities data from the API
async function fetchActivitiesData() {
  try {
    triggerShineEffect();
    const response = await fetch(
      "https://travel-planner-api-b6l8.onrender.com/adventuro/activities",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: destination, // Now correctly using the scoped variable
          duration: `${noOfDays} days`, // Now correctly using the scoped variable
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }

    const data = await response.json();
    createActivityCards(data);
  } catch (error) {
    console.error("Error fetching activities data:", error);
  } finally {
    stopShineEffect();
  }
}

// Function to create activity cards dynamically
function createActivityCards(data) {
  ActivitesData = data. activities;
  const activityCardsContainer = document.getElementById("activiards");
  // Clear any existing cards
  activityCardsContainer.innerHTML = "";

  // Assuming the data has an array of activities
  data.activities.forEach((activity,index) => {
    const card = document.createElement("div");
    card.className = "tripcard";
    card.setAttribute("data-index", index); // Set data-index attribute

    // Set card content
    card.innerHTML = `
      <h3>${activity.name}</h3>
      <p class='card-p'><strong>Location:</strong> ${activity.location}</p>
      <p class='card-p'><strong>Duration:</strong> ${activity.duration}</p>
      <p class='card-p'><strong>Price:</strong> ${activity.price}</p>
      <p class='card-p'><strong>Description:</strong> ${activity.description}</p>
      <a href="${activity.booking_link}" target="_blank">Book Now</a>
    `;

    // Add click event to toggle selection
    card.addEventListener("click", () => {
      const index = card.getAttribute("data-index");
      const isSelected = selectedActivitesIndices.includes(index);

      if (isSelected) {
        // Deselect the card
        sselectedActivitesIndices = selectedActivitesIndices.filter(
          (i) => i !== index
        );
        card.classList.remove("selected"); // Remove selected styling
      } else {
        // Select the card
        selectedActivitesIndices.push(index);
        card.classList.add("selected"); // Add selected styling
      }

      console.log(
        "Selected activites:",
        selectedActivitesIndices.map((i) => ActivitesData[i])
      );
    });

    // Append the card to the container
    activityCardsContainer.appendChild(card);
  });
}

const generateplanbtn = document.querySelector("#generateplanbtn");
generateplanbtn.addEventListener('click', () => {
  if(selectedAccommodationIndices.length===0||selectedActivitesIndices===0||selectedTransportationIndices===0){
    alert("please select the hotel ,transportaion and ")
  }
  fetchplan();
});

async function fetchplan() {
  try {
    const response = await fetch(
      "https://travel-planner-api-b6l8.onrender.com/adventuro/travel-plan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_location: source,
          to_location: destination,
          budget: selectedBudget,
          duration: `${noOfDays} days`,
          accommodation: selectedAccommodationIndices,
          transportation: selectedTransportationIndices,
          activities: selectedActivitesIndices,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }

    const data = await response.json();
    console.log(data);

    // Call the function to load the travel plan dynamically
    loadTravelPlan(data.travel_plan);
  } catch (error) {
    console.error("Error fetching travel plan:", error);
  }
}

function loadTravelPlan(travelPlan) {
  const planContainer = document.querySelector("#planContainer"); // Make sure this div exists in your HTML

  // Clear previous content
  planContainer.innerHTML = "";

  // Create elements for the travel plan
  const planDiv = document.createElement("div");
  planDiv.className = "vi-plan"; // Class starting with 'vi'
  
  // Travel Plan Title
  const title = document.createElement("h2");
  title.innerText = `Travel Plan from ${travelPlan.starting_location} to ${travelPlan.destination}`;
  planDiv.appendChild(title);

  // Trip Duration
  const duration = document.createElement("p");
  duration.innerText = `Trip Duration: ${travelPlan.trip_duration}`;
  planDiv.appendChild(duration);

  // Itinerary
  const itineraryDiv = document.createElement("div");
  itineraryDiv.className = "vi-itinerary"; // Class starting with 'vi'
  travelPlan.itinerary.forEach((day) => {
    const dayDiv = document.createElement("div");
    dayDiv.className = `vi-day-${day.day}`; // Class starting with 'vi' with day number
    dayDiv.innerHTML = `<h3>Day ${day.day}: ${day.description}</h3>`;

    // Add transportation details if available
    if (day.transportation) {
      const transportDetails = document.createElement("p");
      transportDetails.innerText = `Transport: ${day.transportation.mode_of_transport} from ${day.transportation.departure_location} to ${day.transportation.arrival_location} (Departure: ${day.transportation.departure_time}, Arrival: ${day.transportation.arrival_time})`;
      dayDiv.appendChild(transportDetails);
    }

    // Accommodation details if available
    if (day.accommodation) {
      const accommodationDetails = document.createElement("p");
      accommodationDetails.innerText = `Accommodation: ${day.accommodation.name} (${day.accommodation.room_type}) - Price: ${day.accommodation.price}`;
      dayDiv.appendChild(accommodationDetails);
    }

    // Activities
    if (day.activities && day.activities.length > 0) {
      const activitiesList = document.createElement("ul");
      day.activities.forEach((activity) => {
        const activityItem = document.createElement("li");
        activityItem.innerText = `${activity.name} at ${activity.location} - ${activity.description} (Price: ${activity.price})`;
        activitiesList.appendChild(activityItem);
      });
      dayDiv.appendChild(activitiesList);
    }

    itineraryDiv.appendChild(dayDiv);
  });

  planDiv.appendChild(itineraryDiv);
  planContainer.appendChild(planDiv);
}
