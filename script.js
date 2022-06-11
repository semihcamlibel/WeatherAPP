// const opencageKey = 'c780dc47c66c42b2bffc687e9fb62a6d';
const weatherApiKey = "";
const geoCodingBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
const mapsBaseUrl = 'https://maps.googleapis.com/maps/api/place/photo?latlng=';
const placeBaseUrl = 'https://maps.googleapis.com/maps/api/place/';
const weatherApiBaseUrl = 'https://api.weatherapi.com/v1';
const googleKey = '';


//user location
navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  const locateLat = position.coords.latitude;
  const locateLong = position.coords.longitude;

  for (let i = 0; i < 500; i++) {
    if (locateLat) {
      getLocate(locateLat, locateLong);
      break;
    }
  }
}


const getLocate = async (latitude, longitude) => {

  var GEOCODING = `${geoCodingBaseUrl}${latitude}%2C${longitude}&language=en,+CA&key=${googleKey}`;
  var MAPS = `${mapsBaseUrl}${latitude}%2C${longitude}&language=en,+CA&key=${googleKey}`;
  const response = await fetch(GEOCODING)
    .then((data) => data.json())
    .catch((error) => console.log(error));

  getWeather(response.plus_code.compound_code);
}

function error(err) {
  const tryWeather = getWeather('Adana');
}



const getWeather = async (city) => {
  const weatherEndPoint = '/current.json';
  const requestParams = `?key=${weatherApiKey}&q=${city}&aqi=yes`;
  const urlToFetch = `${weatherApiBaseUrl}${weatherEndPoint}${requestParams}`;
  const response = await fetch(urlToFetch)
    .then((data) => data.json())
    .catch((error) => console.log(error));


  const {
    location: { localtime: localTime },
    current: { temp_c: degree },
    location: { name: cityName },
    location: { country: countryName },
    current: { humidity: humidity },
    current: { wind_kph: windSpeed },
    current: { is_day: isDay }
  } = response;


  const {
    condition: { text: condText },
    condition: { icon: condIcon },

  } = response.current;

  document.getElementById('localtime').innerHTML = 'Local Time in ' + cityName + '<br>' + ' ' + localTime;
  document.getElementById('degree').innerHTML = degree + '°';
  document.getElementById('location').innerHTML = cityName;
  document.getElementById('conditions').innerHTML = condText;
  document.getElementById('condimg').src = 'https:' + condIcon;
  document.getElementById('country').innerHTML = countryName;
  document.getElementById('humidity').innerHTML = 'Humidity: ' + humidity + ' %';
  document.getElementById('windspeed').innerHTML = 'Wind speed: ' + windSpeed + ' km/h';
  document.getElementById('flagimg').src = 'https://countryflagsapi.com/png/' + countryName;


  //CARD DIV BACGROUND 
  if (condText === 'Sunny' && isDay === 1) {
    document.getElementById('card').style.backgroundImage = "url('day.jpg')";
  } else if (condText.includes('cloudy') === true) {
    document.getElementById('card').style.backgroundImage = "url('cloud.jpg')";
  } else if (condText.includes('rain') === true) {
    document.getElementById('card').style.backgroundImage = "url('rain.jpg')";
  } else if (condText === 'Clear' || condText === 'Overcast' && isDay === 1) {
    document.getElementById('card').style.backgroundImage = "url('day.jpg')";
  } else {
    document.getElementById('card').style.backgroundImage = "url('night.jpg')";
  }

  getPhotoRef(city);
  return response;
};



// GOOGLE MAPS API - GET PHOTO REF WITH CITY NAME - NOT WORKING BEACUSE CORS
const getPhotoRef = async (photoCity) => {
  const photoRefFetch = `${placeBaseUrl}findplacefromtext/json?input=${photoCity},%20IL&key=${googleKey}&inputtype=textquery&fields=name,photos`;
  const response = await fetch(photoRefFetch, {
  })
  //const photoref = (photoResponse.candidates[0].photos[0].photo_reference);
  getPhoto(photoref);
}

//GOOGLE MAPS API - GET PHOTO WITH PHOTO REF - NOT WORKING BEACUSE CORS
const getPhoto = async (photoref) => {
  const photoFetch = `${placeBaseUrl}photo?photoreference=${photoref}&key=${googleKey}&maxwidth=1920&maxheight=1080`;
  document.body.style.backgroundImage = "url(" + photoFetch + ")";
}



// INDEX SELECT
const getSelectedWeather = () => {
  const select = document.getElementById('selectedcity');
  const selectedValue = select.options[select.selectedIndex].value;
  getWeather(`'${selectedValue}'`);
}

// TURKEY CITIES ARRAY
const cities = ["Adana", "Adıyaman", "Afyon", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydin", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "İçel (Mersin)", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Mugla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Sirnak", "Bartin", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Duzce"
];

for (let i = 0; i < cities.length; i++) {
  document.getElementById('selectedcity').innerHTML += `<option value="${cities[i]}"> ${cities[i]} </option>`;
}





// OTHER LOCATE API
/*
const tryOpenCage = async (latitude, longitude) => {
  const fetchUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${opencageKey}`;
  const response = await fetch(fetchUrl)
    .then((data) => data.json())
    .catch((error) => console.log(error));

  if (response.results[0].components.province) {
    getWeather(response.results[0].components.province);
    console.log(response);
  } else if (response.results[0].components.city) {
    getWeather(response.results[0].components.city);
    console.log(response);
  }
  else {
    getWeather(response.results[0].components.state);
    console.log(response);
  }
}
*/