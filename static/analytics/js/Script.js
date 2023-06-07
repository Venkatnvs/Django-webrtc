var startTime;
let ipAddress_send;
let DeviceType;
let uuid_send;
let geoloc;
function trackPageView() {
  saveVisitorData()
}
function calculateDuration(startTime) {
  var endTime = new Date();
  var duration = Math.round((endTime - startTime) / 1000); // Convert to seconds
  return duration;
}
window.addEventListener('load', function() {
  startTime = new Date();
  getUserIpAddress()
  trackVisitor()
  getDeviceType()
});

function getDeviceType() {
    var userAgent = navigator.userAgent;
    var isMobile = /Mobile/.test(userAgent);
    var isTablet = /Tablet/.test(userAgent);

    if (isMobile) {
        DeviceType = 'Mobile';
    } else if (isTablet) {
        DeviceType = 'Tablet';
    } else {
        DeviceType = 'Desktop';
    }
}

// function getUserDemographics() {
//   if (navigator && navigator.userAgent) {
//     let userAgent = navigator.userAgent;
//     var age, gender;
    
//     // Example: Extracting age and gender from user agent
//     if (userAgent.toLowerCase().indexOf('age=') !== -1) {
//       age = userAgent.toLowerCase().split('age=')[1].split(';')[0].trim();
//     }
//     if (userAgent.toLowerCase().indexOf('gender=') !== -1) {
//       gender = userAgent.toLowerCase().split('gender=')[1].split(';')[0].trim();
//     }

//     // Return user demographics
//     return {
//       age: age,
//       gender: gender
//     };
//   }

//   // Return null if user demographics cannot be obtained
//   return null;
// }

// Function to get user's approximate location based on IP address
function getUserLocation(ip_add) {
  // Make an AJAX request to an IP geolocation service
  // var apiUrl = '/analytics/get-ip-geolocation?format=json';
  // var xhr = new XMLHttpRequest();
  // xhr.open('POST', apiUrl, true);
  // xhr.setRequestHeader('Content-Type', 'application/json');
  // xhr.onload = function() {
  //   if (xhr.status === 200) {
  //     var response = JSON.parse(xhr.responseText);
  //     console.log(response)
  //   }
  //   else{
  //     ipAddress_send = NaN;
  //   }
  // }
  console.log(ip_add)
  fetch('/analytics/get-ip-geolocation?format=json',{
    method: "POST",
    body: JSON.stringify({
      ip_address: ip_add,
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }})
    .then(response => response.json())
    .then((json) =>{
      geoloc = json;
      console.log(json)
    });
  // var ip_address = {
  //   ip:ipAddress_send,
  // }
  // xhr.send(JSON.stringify(ip_address))
}

function trackVisitor() {
  var visitorId = localStorage.getItem('visitorId');
  
  if (!visitorId) {
    visitorId = this.crypto.randomUUID();
    localStorage.setItem('visitorId', visitorId);
    uuid_send = visitorId
  }
  else{
    uuid_send = visitorId
  }
}

function generateUniqueId() {
  var timestamp = Date.now().toString(); // Get current timestamp as a string
  var randomNum = Math.floor(Math.random() * 1000).toString(); // Generate a random number as a string
  var uniqueId = timestamp + randomNum; // Concatenate the timestamp and random number
  return uniqueId;
}

function getUserIpAddress() {
  var apiUrl = '/analytics/get-ip-address?format=json';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', apiUrl, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var ipAddress = response.ip;
      
      ipAddress_send = ipAddress;
      getUserLocation(ipAddress);
    }
    else{
      ipAddress_send = NaN;
    }
  };
  
  xhr.send();
}

function getUserAgent() {
  var userAgent = navigator.userAgent;
  return userAgent;
}

function saveVisitorData() {
  var pageData = {
    uuid:uuid_send,
    url: window.location.href,
    title: document.title,
    duration: calculateDuration(startTime),
    timestamp: new Date().toISOString(),
    deviceType: DeviceType,
    userAgent: getUserAgent(),
    ipAddress: ipAddress_send,
    geoLocation: geoloc.message,
  };

  // Send the page data to the server
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/analytics/track-page-view', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(pageData));
}

// var demographics = getUserDemographics();
// console.log(demographics);

window.addEventListener('beforeunload', function() {
  trackPageView();
});