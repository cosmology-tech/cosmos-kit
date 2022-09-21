import {
    SigningStargateClient,
    calculateFee,
    GasPrice
  } from '@cosmjs/stargate';
  
  type CoinDenom = string;
  
  export const gasEstimation = async (
    denom: CoinDenom,
    stargateClient: SigningStargateClient,
    address: string,
    msgs: object[],
    memo: string,
    modifier: number
  ) => {
    const defaultGasPrice = '0.0025' + denom;
    const getFee = (gas, gasPrice) => {
      if (!gas) gas = 200_000;
      if (!gasPrice) gasPrice = GasPrice.fromString(defaultGasPrice);
      return calculateFee(gas, gasPrice);
    };
  
    const simulate = async (address, msgs, memo, modifier = 1.5) => {
      const estimate = await stargateClient.simulate(address, msgs, memo);
      // console.log({ estimate });
      return parseInt(estimate * (modifier));
    };
  
    const getGasPrice = async (address, msgs, memo, modifier) => {
      let fee;
      let gas;
      try {
        gas = await simulate(address, msgs, memo);
        fee = getFee(gas);
        //   fee = getFee(gas, gasPrice)
        // console.log(fee);
        return fee;
        //   const feeAmount = Number(fee.amount[0].amount);
        //   return feeAmount;
      } catch (error) {
        console.log(error);
      }
    };
  
    const fee = await getGasPrice(address, msgs, memo, modifier);
  
    if (denom === 'uhuahua') {
      // literally wtf (needs a 10x + 1)
      fee.amount[0].amount = `${fee.amount[0].amount}1`;
    }
    if (denom === 'ucmdx') {
      // literally wtf (needs a 10x + 1)
      fee.amount[0].amount = `${fee.amount[0].amount}1`;
    }
  
    return fee;
  };