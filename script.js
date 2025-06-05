const url=`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd
&order=market_cap_desc
&per_page=50
&page=1
&sparkline=false
`
const cryptoTableBox=document.querySelector(".crypto-table-wrapper")
const searchElement=document.querySelector("#search")
const filterBtn=document.querySelector(".filter-btn")
const filterMenuElement=document.querySelector(".filter-menu")
const applyBtn=document.querySelector(".apply-btn")
const overlay = document.querySelector(".overlay");

let coins=[]

fetch(url,).then((data)=>{
    return data.json()
}).then((data)=>{
    coins=data
    renderElements(coins)
})

function formatMarketCap(value) {
    if (value >= 1_000_000_000_000) {
      return (value / 1_000_000_000_000).toFixed(1) + 'T';
    } else if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1) + 'B';
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(1) + 'K';
    } else {
      return value;
    }
  }
  

function renderElements(coins){
    cryptoTableBox.innerHTML=""
    const cryptoTable = document.createElement("table");
    cryptoTable.classList.add("crypto-table");
    if (coins.length==0){
      const newParagraphElement=document.createElement("p")
      newParagraphElement.textContent="No results found"
      newParagraphElement.classList.add("no-results");
      cryptoTableBox.appendChild(newParagraphElement);
      return
    }

    cryptoTable.innerHTML = `
            <tr class="table-header">
                <th>Coin</th>
                <th>Price</th>
                <th>24h</th>
                <th>Market Cap</th>
            </tr>
                    `
        coins.forEach((coin) => {
            const changeClass = coin.price_change_percentage_24h > 0 ? 'up' : 'down';
            const priceChange = coin.price_change_percentage_24h;
            const formattedChange =
                priceChange > 0
                  ? `+${priceChange.toFixed(1)}%`
                  : `${priceChange.toFixed(1)}%`;
            cryptoTable.innerHTML += `
                    <tr>
                        <td class="coin-name-wrapper"><img src=${coin.image} width="25px" height="25px"><p class="coin-name">${coin.symbol}</p></td>
                        <td class="coin-price">${coin.current_price}$</td>
                        <td class="coin-price-change ${changeClass}">${formattedChange}</td>
                        <td class="coin-market-cap">${formatMarketCap(coin.market_cap)}</td>
                    </tr>
            `;

        });
        cryptoTableBox.appendChild(cryptoTable);
}

searchElement.addEventListener("input",()=>{
    const filteredCoins=coins.filter((coin)=>{
    return coin.name.toLowerCase().includes(searchElement.value.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchElement.value.toLowerCase())
  })
  renderElements(filteredCoins)
})

filterBtn.addEventListener("click",()=>{
  filterMenuElement.classList.toggle("active")
  overlay.classList.toggle("active");
})

applyBtn.addEventListener("click",()=>{
  const minPriceValue=parseFloat(document.querySelector("#min-price").value)
  const maxPriceValue=parseFloat(document.querySelector("#max-price").value)
  const priceChangeValue=document.querySelector("#price-change").value
  const marketCapValue=document.querySelector("#market-cap").value

  const filteredCoins=coins.filter((coin)=>{
    let priceOk = true;

    if (!isNaN(minPriceValue)) {
      priceOk = coin.current_price >= minPriceValue;
    }
    
    if (!isNaN(maxPriceValue)) {
      priceOk = priceOk && coin.current_price <= maxPriceValue;
    }
    let priceChangeOk = true;

    if (priceChangeValue === "gainers") {
      priceChangeOk = coin.price_change_percentage_24h > 0;
    } else if (priceChangeValue === "losers") {
      priceChangeOk = coin.price_change_percentage_24h < 0;
    }

    let marketCapOk=true
    if(marketCapValue==="mil"){
      marketCapOk=coin.market_cap>1_000_000
    }
    else if(marketCapValue==="ten-mil"){
      marketCapOk=coin.market_cap>10_000_000
    }
    else if(marketCapValue==="hundred-mil"){
      marketCapOk=coin.market_cap>100_000_000
    }
    else if(marketCapValue==="bil"){
      marketCapOk=coin.market_cap>1_000_000_000
    }
    else if(marketCapValue==="ten-bil"){
      marketCapOk=coin.market_cap>10_000_000_000
    }
    else if(marketCapValue==="hundred-bil"){
      marketCapOk=coin.market_cap>100_000_000_000
    }
    else if(marketCapValue==="tril"){
      marketCapOk=coin.market_cap>1_000_000_000_000
    }
    else {
      marketCapOk = true;
    }
    return priceOk && priceChangeOk && marketCapOk

  })
  renderElements(filteredCoins)
  filterMenuElement.classList.remove("active");
  overlay.classList.remove("active");

})


