const userForm = document.getElementById('user-form');
const userId = document.getElementById('user-id');
const userName = document.getElementById('user-name');
const userPhone = document.getElementById('user-phone');
const userAddress = document.getElementById('user-address');
var long;
var lat;

navigator.geolocation.getCurrentPosition((position) => {
  lat = position.coords.latitude;
  long = position.coords.longitude;
});
async function getGeolocation(lat, long) {
  const latlng = lat + "," + long;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=AIzaSyD_YWjLA9D5se_gD7W4-Ggg_dKJ-jUs_jc`
  )
    .then((res) => res.json())
    .then((data) => {
      let address_geo = data.results[0].formatted_address;
      console.log(address_geo);
      return (address_geo);
    })
    .catch((error) => {
      console.log(error);
    });
}


// Send POST to API to add user
async function addUser(e) {
  e.preventDefault();
  getGeolocation(lat,long);

  if (userId.value === '' || userAddress.value === '' || userName.value === '' || userPhone.value ==='') {
    alert('Please fill out the form');
  }
  //send body to API
  const sendBody = {
    userId: userId.value,
    userName:userName.value,
    userPhone:userPhone.value,
    address: userAddress.value
  };
  try {
    const res = await fetch('/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendBody)
    });
    if (res.status === 400) {
      throw Error('User already exists!');
    }
    alert('Successfully Logedin!');
    window.location.href = '/index.html';
  } catch (err) {
    alert(err);
    return;
  }
}
userForm.addEventListener('submit', addUser);
