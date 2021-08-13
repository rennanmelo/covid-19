(() => {
  document.getElementById("countries").addEventListener("change", handleChange);
  document.getElementById("date").addEventListener("change", handleChange);

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
})();

function loadCountries(data) {
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
}

function loadSummary(data) {
  let confirmed = document.getElementById("total-confirmed"),
    death = document.getElementById("total-deaths"),
    recovered = document.getElementById("total-recovered"),
    active = document.getElementById("total-actives");

  confirmed.innerText = data.Global.TotalConfirmed.toLocaleString("EN");
  death.innerText = data.Global.TotalDeaths.toLocaleString("EN");
  // The API is not giving the correct recovered data
  recovered.innerText = data.Global.TotalRecovered.toLocaleString("EN");
  active.innerText = (
    data.Global.TotalConfirmed -
    data.Global.TotalDeaths -
    data.Global.TotalRecovered
  ).toLocaleString("EN");
}

function handleChange() {
  let countriesField = document.getElementById("countries");
  let dateField = document.getElementById("date");

  if (countriesField.value !== "Global") {
    dateField.disabled = false;

    // Handling dates manually
    if (dateField.value) {
      let startDate = new Date(dateField.value);

      let endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + 1,
        -3,
        0,
        1,
        0
      );

      startDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() - 1, // Allow to get 3 days
        -3,
        0,
        0,
        0
      );

      fetch(
        `https://api.covid19api.com/country/${
          countriesField.value
        }?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
      )
        .then((response) => response.json())
        .then((json) => loadData(json));
    }
  } else {
    dateField.disabled = true;
    dateField.value = "";

    fetch("https://api.covid19api.com/summary")
      .then((response) => response.json())
      .then((json) => loadSummary(json));
  }
}

function loadData(data) {
  let confirmed = document.getElementById("total-confirmed"),
    death = document.getElementById("total-deaths"),
    recovered = document.getElementById("total-recovered"),
    active = document.getElementById("total-actives");

  let prevConfirmedVariation = data[1].Confirmed - data[0].Confirmed;
  let prevDeathsVariation = data[1].Deaths - data[0].Deaths;
  let prevRecoveredVariation = data[1].Recovered - data[0].Recovered;
  let prevActivesVariation = data[1].Active - data[0].Active;

  let currentConfirmedVariation = data[2].Confirmed - data[1].Confirmed;
  let currentDeathsVariation = data[2].Deaths - data[1].Deaths;
  let currentRecoveredVariation = data[2].Recovered - data[1].Recovered;
  let currentActivesVariation = data[2].Active - data[1].Active;

  confirmed.innerText = data[2].Confirmed.toLocaleString("EN");
  death.innerText = data[2].Deaths.toLocaleString("EN");
  // The API is not giving the correct recovered data
  recovered.innerText = data[2].Recovered.toLocaleString("EN");
  active.innerText = data[2].Active.toLocaleString("EN");

  insertDailyData(
    "daily-confirmed",
    currentConfirmedVariation,
    currentConfirmedVariation > prevConfirmedVariation
  );

  insertDailyData(
    "daily-deaths",
    currentDeathsVariation,
    currentDeathsVariation > prevDeathsVariation
  );

  insertDailyData(
    "daily-recovered",
    currentRecoveredVariation,
    currentRecoveredVariation > prevRecoveredVariation
  );

  insertDailyData(
    "daily-actives",
    currentActivesVariation,
    currentActivesVariation > prevActivesVariation
  );
}

function insertDailyData(element, value, increase) {
  if (increase) {
    document.getElementById(
      element
    ).innerHTML = `<img class='app__icon app__icon--increase' src='/assets/img/arrow.svg' /> Daily: ${value.toLocaleString(
      "EN"
    )}`;
  } else {
    document.getElementById(element).innerHTML = `
    <img class='app__icon' src= '/assets/img/arrow.svg' /> Daily: ${value.toLocaleString(
      "EN"
    )}`;
  }
}
