(async () => {
  let response = await Promise.allSettled([
    fetch("https://api.covid19api.com/countries"),
    fetch("https://api.covid19api.com/summary"),
  ]);

  // Verify if the promises was fulfilled
  if (response[0].status == "fulfilled") {
    loadCountries(await response[0].value.json());
  }
  if (response[1].status == "fulfilled") {
    loadSummary(await response[1].value.json());
  }
})();

const loadCountries = (data) => {
  let countries = document.getElementById("countries");

  // Order the countries
  data.sort((a, b) => {
    let x = a.Country.toUpperCase();
    let y = b.Country.toUpperCase();

    return x === y ? 0 : x > y ? 1 : -1;
  });

  for (countryIndex in data) {
    // Create an option html element to each country
    countries.options[countries.options.length] = new Option(
      data[countryIndex].Country,
      data[countryIndex].Country
    );
  }
};

const loadSummary = (data) => {
  let confirmed = document.getElementById("total-confirmed"),
    death = document.getElementById("total-deaths"),
    recovered = document.getElementById("total-recovered"),
    active = document.getElementById("total-actives");

  console.log(data);

  confirmed.innerText = data.Global.TotalConfirmed.toLocaleString("EN");
  death.innerText = data.Global.TotalDeaths.toLocaleString("EN");
  // The API is not giving the correct recovered data
  recovered.innerText = data.Global.TotalRecovered.toLocaleString("EN");
  active.innerText = (
    data.Global.TotalConfirmed -
    data.Global.TotalDeaths -
    data.Global.TotalRecovered
  ).toLocaleString("EN");
};
