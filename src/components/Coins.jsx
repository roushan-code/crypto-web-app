import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { server } from "../index"
import { Button, Container, HStack,  Radio, RadioGroup } from '@chakra-ui/react';
import Loader from "./Loder.jsx";
import Error from './Error.jsx';
import CoinCard from './CoinCard.jsx';

const Coins = () => {

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState('inr');

  const currencySymbol = currency === 'inr' ? "₹" : currency === "eur" ? "€" : "$";

  const changePage = (page) => {
    setPage(page);
    setLoading(true);
  }

  const btns = new Array(132).fill(1)

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`);
        // console.log(data);
        setCoins(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoins();
  }, [currency, page]);

  if (error) return <Error message={"Error While Fetching Coins"} />

  return (
    <Container maxW={'container.xl'}>{loading ? <Loader /> : <>
      <RadioGroup value={currency} onChange={setCurrency} p={'8'}>
        <HStack spacing={'4'}>
          <Radio value='inr'>INR</Radio>
          <Radio value='usd'>USD</Radio>
          <Radio value='eur'>EUR</Radio>
        </HStack>
      </RadioGroup>

      <HStack wrap={'wrap'} justifyContent={'space-evenly'}>
        {coins.map((i) => (
          <CoinCard
            id={i.id}
            price={i.current_price}
            key={i.id}
            name={i.name}
            img={i.image}
            symbol={i.symbol}
            currencySymbol={currencySymbol} />
        ))};
      </HStack>
      <HStack w={'full'} overflow={'auto'} p={'8'}>
        {
          btns.map((item, index) => (
            <Button
              key={index}
              bgColor={'blackAlpha.900'}
              color={'white'}
              onClick={() => changePage(index + 1)}>{index + 1}</Button>
          ))
        }
      </HStack>
    </>}</Container>
  )
}





export default Coins