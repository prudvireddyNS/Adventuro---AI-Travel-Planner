// Function to send accommodation request
async function sendAccommodationRequest() {
  try {
    const response = await fetch('https://travel-planner-api-b6l8.onrender.com/adventuro/accommodation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: "Paris", 
        budget: "medium", 
        duration:"3 days"
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    console.log('Accommodation response:', data);
  } catch (error) {
    console.error('Error during accommodation request:', error);
  }
}

// Function to send transportation request
async function sendTransportationRequest(fromLocation, toLocation, budget) {
  try {
    const response = await fetch('https://travel-planner-api-b6l8.onrender.com/adventuro/transportation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from_location: fromLocation,
        to_location: toLocation,
        budget
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    console.log('Transportation response:', data);
  } catch (error) {
    console.error('Error during transportation request:', error);
  }
}

// Function to send activities request
async function sendActivitiesRequest(location, duration) {
  try {
    const response = await fetch('https://travel-planner-api-b6l8.onrender.com/adventuro/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location,
        duration
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    console.log('Activities response:', data);
  } catch (error) {
    console.error('Error during activities request:', error);
  }
}

// Example usage
// document.getElementById('generate-trip-btn').addEventListener('click', () => {
//   // Sample data, replace these with your actual input values
//   const accommodationLocation = "Paris";
//   const accommodationBudget = "medium";
//   const accommodationDuration = "3 days";
  
//   const transportationFromLocation = "New York";
//   const transportationToLocation = "Paris";
//   const transportationBudget = "high";

//   const activitiesLocation = "Paris";
//   const activitiesDuration = "3 days";

  // Call all requests when the Generate Trip button is clicked
  // sendAccommodationRequest();
  sendTransportationRequest("hyderabad ", " goa ", "medium");
  // sendActivitiesRequest("Goa","3 days" );
// });
