(async () => {
  let response = await Promise.allSettled([
    fetch("https://api.covid19api.com/countries"),
    fetch("https://api.covid19api.com/summary"),
  ]);

  // Verify if the promises was fulfilled
  if (response[0].status == "fulfilled") {
    console.log(await response[0].value.json());
  }
  if (response[1].status == "fulfilled") {
    console.log(await response[1].value.json());
  }
})();
