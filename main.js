const apiKey =  process.env.API_KEY
document.querySelector("#searchBtn").addEventListener("click", searchVin);
async function searchVin() {
  const vin = document.querySelector("#vinInput").value;

  const url = `https://cis-vin-decoder.p.rapidapi.com/vinDecode?vin=${vin}`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "cis-vin-decoder.p.rapidapi.com",
    },
  };

  // fetch('./data.json')
  // .then((response) => response.json())
  // .then((json) => console.log(json));
  document.querySelector("#name").innerHTML = `<span id="year"></span>
    <span id="make"></span>
    <span id="model"></span>`;
  document.querySelector(
    "#data"
  ).innerHTML = `<img class="h-12 w-12 mx-auto spinning text-black" src="https://simpleicon.com/wp-content/uploads/loading.svg" alt="">`;
  // const response = await (await fetch('./data.json')).text()
  let response = await await fetch(url, options);
  document.querySelector("#data").innerHTML = "";

  console.log(response.ok);
  if (!response.ok){
    let issue = JSON.parse(await response.text()).detail
    console.log(issue)
    document.querySelector("#message").innerHTML =
      errorMessage(issue)
    return
  }else document.querySelector("#message").innerHTML =
  successMessage()

  response = await response.text();
  const result = JSON.parse(response).data;
  Object.keys(result).forEach((key) => {
    if (typeof result[key] != "string") return;
    if (key == "ModelYear")
      document.querySelector("#year").innerText = result[key];
    if (key == "Make") document.querySelector("#make").innerText = result[key];
    if (key == "Model")
      document.querySelector("#model").innerText = result[key];
    let li = itemTemplate(key, result[key]);
    document.querySelector("#data").innerHTML += li;
    itemTemplate(key, result[key]);
  });
  // console.log(result);
}

function itemTemplate(label, info) {
  return `<div class="w-1/2 item pr-2"><div id="label">${label}</div>
<div id="info">${info}</div></div>`;
}
function errorMessage(message){
  return `<div class="flex w-fit p-4 mb-4 text-sm mx-auto text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
  <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
  <span class="sr-only">Info</span>
  <div>
    <span class="font-medium">Error!</span> ${message}
  </div>
</div>`
}
function successMessage(){
  return`<div class="flex w-fit mx-auto p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
  <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
  <span class="sr-only">Info</span>
  <div>
    <span class="font-medium">Success!</span> We Were able to find your vehicle.
  </div>
</div>`
}