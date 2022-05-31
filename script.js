// Import the functions you need from the SDKs you need

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// TODO: Replace with your app's Firebase project configuration

// Get a reference to the database service
var database = firebase.database();

const firebaseConfig = {
  apiKey: "AIzaSyBb8EjvqYwTSHHmE8kkld-hjWDa7AcOcNk",
  authDomain: "weatherapptwo.firebaseapp.com",
  projectId: "weatherapptwo",
  storageBucket: "weatherapptwo.appspot.com",
  messagingSenderId: "626928376740",
  appId: "1:626928376740:web:b75c2c5e637f54151f7f31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const key = "5ea545d6d1b049d3a1d115918222805";
const apiBaseUrl = 'https://api.weatherapi.com/v1';

const getWeather = async (city) => {
  const weatherEndPoint = '/current.json';
  const requestParams = `?key=${key}&q=${city}&aqi=yes`;
  const urlToFetch = apiBaseUrl + weatherEndPoint + requestParams;

  const response = await fetch(urlToFetch)
    .then((data) => data.json())
    .catch((error) => console.log(error));
  console.log(response.location.name);
  document.getElementById('localtime').innerHTML = 'Local Time in ' + response.location.name + '<br>' + ' ' + response.location.localtime;
  document.getElementById('degree').innerHTML = response.current.temp_c + '°';
  document.getElementById('location').innerHTML = response.location.name;
  document.getElementById('conditions').innerHTML = response.current.condition.text;
  document.getElementById('condimg').src = 'https:' + response.current.condition.icon;
  document.getElementById('country').innerHTML = response.location.country;
  document.getElementById('humidity').innerHTML = 'Humidity: ' + response.current.humidity + ' %';
  document.getElementById('windspeed').innerHTML = 'Wind speed: ' + response.current.wind_kph + ' km/h';
  document.getElementById('flagimg').src = 'https://countryflagsapi.com/png/' + response.location.country;
  console.log(response);

  if (response.current.condition.text === 'Sunny' || response.current.condition.text === 'Clear' && response.current.is_day === 1) {
    document.getElementById('card').style.backgroundImage = "url('day.jpg')";
  } else if (response.current.condition.text === 'Partly cloudy') {
    document.getElementById('card').style.backgroundImage = "url('cloud.jpg')";
  } else if (response.current.condition.text.indexOf('rain')) {
    document.getElementById('card').style.backgroundImage = "url('rain.jpg')";
  } else {
    document.getElementById('card').style.backgroundImage = "url('night.jpg')";
  }

  getPhotoRef(city);
  return response;
};

const getPhotoRef = async (photoCity) => {
  const photoRefFetch = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + photoCity + ',%20IL&key=AIzaSyCWThpogVzskhqv5em8s5lS1D9w2rNNquE&inputtype=textquery&fields=name,photos'
  const response = await fetch(photoRefFetch, {
    mode: 'no-cors' // 'cors' by default
  })
  console.log(response);
  //const photoref = (photoResponse.candidates[0].photos[0].photo_reference);
  getPhoto(photoref);
}

const getPhoto = async (photoref) => {
  const photoFetch = 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' + photoref + '&key=AIzaSyCWThpogVzskhqv5em8s5lS1D9w2rNNquE&maxwidth=1920&maxheight=1080';
  document.body.style.backgroundImage = "url(" + photoFetch + ")";
}

const getSelectedWeather = () => {
  let select = document.getElementById('selectedcity');
  let selectedValue = select.options[select.selectedIndex].value;
  getWeather("'" + selectedValue + "'");
}



const cities = ["Adana", "Adıyaman", "Afyon", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydin", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "İçel (Mersin)", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Mugla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Sirnak", "Bartin", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Duzce"
];

for (let i = 0; i < cities.length; i++) {
  document.getElementById('selectedcity').innerHTML += '<option value="' + cities[i] + '">' + cities[i] + '</option>';
}

navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en,+CA&key=AIzaSyCWThpogVzskhqv5em8s5lS1D9w2rNNquE';
  var MAPS = 'https://maps.googleapis.com/maps/api/place/photo?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en,+CA&key=AIzaSyCWThpogVzskhqv5em8s5lS1D9w2rNNquE';


  $.getJSON(GEOCODING).done(function (location) {
    const tryWeather = getWeather(location.results[8].formatted_address);
  })

}

function error(err) {
  const tryWeather = getWeather('Adana');
}
