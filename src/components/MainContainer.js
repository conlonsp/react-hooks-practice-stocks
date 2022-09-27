import React, {useState, useEffect} from "react";
import StockContainer from "./StockContainer";
import PortfolioContainer from "./PortfolioContainer";
import SearchBar from "./SearchBar";

function MainContainer() {
  const [stocks, setStocks] = useState([])
  const [myStocks, setMyStocks] = useState([])
  const [sort, setSort] = useState('')
  const [filter, setFilter] = useState('Tech')

  useEffect(() => {
    fetch('http://localhost:3001/stocks')
    .then(r => r.json())
    .then(stocks => setStocks(stocks))
  }, [])

  useEffect(() => {
    if(sort === 'Alphabetically') {
      const sortNames = sortByName()
      setStocks(sortNames)
    } else if(sort === 'Price') {
      const sortPrice = sortByPrice()
      setStocks(sortPrice)
    }
  }, [ sort ])

  const filteredListings = [...stocks].filter(stock => {
    return stock.type === filter
  })
 
  function handleFilter(event) {
    setFilter(event.target.value)
  }

  function sortByName() {
    return [...stocks].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  function sortByPrice() {
    return [...stocks].sort((a,b) => a.price - b.price)
  }

  function handleSort(event) {
    setSort(event.target.value)
  }

  function buyStock(stock) {
    if(!myStocks.includes(stock)) {
      const myStocksUpdated = [...myStocks, stock]
      setMyStocks(myStocksUpdated)
    } else {
      alert(`${stock.name}'s stock has already been purchased.`)
    }
  }

  function sellStock(stock) {
    const soldStock = myStocks.filter(myStock => myStock.id !== stock.id)
    setMyStocks(soldStock)
  }

  return (
    <div>
      <SearchBar
        sort={sort}
        handleSort={handleSort}
        handleFilter={handleFilter}
      />
      <div className="row">
        <div className="col-8">
          <StockContainer
            stocks={filteredListings}
            buyStock={buyStock}
          />
        </div>
        <div className="col-4">
          <PortfolioContainer
            stocks={myStocks}
            sellStock={sellStock}
          />
        </div>
      </div>
    </div>
  );
}

export default MainContainer;
