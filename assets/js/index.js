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
