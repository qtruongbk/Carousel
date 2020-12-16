export default async function getDataFromAPI(sqlcmm) {
   var myHeaders = new Headers();
   myHeaders.set('Accept', 'application/json');
   myHeaders.set('Content-Type', 'application/json');
   myHeaders.set('Cache-Control', 'no-cache');
   return fetch('https://randomuser.me/api/0.4/?randomapi',
   {
     method: 'GET',
     headers: myHeaders,
   }).then(response => response.json()).catch(error => console.log('error', error));
}