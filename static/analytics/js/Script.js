var startTime;
let ipAddress_send;
let DeviceType;
let uuid_send;
let geoloc;
let socket;
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

function getUserLocation(ip_add) {
  var apiUrl = '/analytics/get-ip-geolocation?format=json';
  var xhr = new XMLHttpRequest();
  xhr.open('POST', apiUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.onload = function() {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      console.log(response)
      geoloc = response;
      trackPageView();
    }
  }
  xhr.send(JSON.stringify({ip_address: ip_add,}))
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
  var timestamp = Date.now().toString(); 
  var randomNum = Math.floor(Math.random() * 1000).toString();
  var uniqueId = timestamp + randomNum;
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
  console.log(geoloc)
  var pageData = {
    uuid:uuid_send,
    url: window.location.href,
    title: document.title,
    // duration: calculateDuration(startTime),
    timestamp: new Date().toISOString(),
    deviceType: DeviceType,
    userAgent: getUserAgent(),
    ipAddress: ipAddress_send,
    geoLocation: geoloc.message,
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/analytics/track-page-view', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      console.log(response)

      var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";

      socket = new WebSocket(ws_scheme+'://'
      + window.location.host
      +'/ws/realtime/'
      +uuid_send+'/'
      +response.message+'/');

      
      socket.onopen = function (event) {
        socket.send(JSON.stringify({"message":{'is_active':true,'uuid':uuid_send}}));
        console.log('WebSocket connection established');
      };

      socket.onmessage = function (event) {
        const userCount = event.data;
        console.log('Real-time user count:', userCount);
      };

      socket.onclose = function (event) {
        console.log('WebSocket connection closed');
      };
    }
  }
  xhr.send(JSON.stringify(pageData));
}

// window.addEventListener('beforeunload', function() {
// trackPageView();
// });
