const BASE_URL = "https://api.exchangerate-api.com/v4/latest";
const dropdowns = document.querySelectorAll("select");
const fromImg = document.querySelector("#from-img");
const toImg = document.querySelector("#to-img");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;
    select.append(option);
  }
  if (select.name === "from") select.value = "USD";
  if (select.name === "to") select.value = "INR";
  updateFlag(select);
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

function updateFlag(element) {
  let countryCode = countryList[element.value];
  let imgTag = element.name === "from" ? fromImg : toImg;
  imgTag.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

document.querySelector("#converterForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const amount = document.querySelector("#amount").value;
  const fromCurr = document.querySelector("select[name='from']").value;
  const toCurr = document.querySelector("select[name='to']").value;
  const msg = document.querySelector("#msg");

  if (amount === "" || isNaN(amount)) {
    msg.innerText = "Please enter a valid amount.";
    return;
  }

  const url = `${BASE_URL}/${fromCurr}`;
  console.log("Fetching URL:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    const rate = data.rates[toCurr];
    if (!rate) throw new Error("Invalid rate data");
    const convertedAmount = (amount * rate).toFixed(2);
    msg.innerText = `${amount} ${fromCurr} = ${convertedAmount} ${toCurr}`;
  } catch (err) {
    msg.innerText = "Failed to fetch exchange rate.";
    console.error(err);
  }
});
