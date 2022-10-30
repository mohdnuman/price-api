const { MultiCall } = require("@indexed-finance/multicall");
const config = require("../config.json");
const abi = require("../abi/eth.abi.json");
const Web3 = require("web3");
let provider = new Web3(
    new Web3.providers.HttpProvider(
        config.eth.provider
    )
);

async function getPriceFromUniswapV3(tokenAddress, decimals) {
    const multi = new MultiCall(provider);
    let amountIn = BigInt(10 ** decimals);
    let calls = [];
    //-------------weth------------------------
    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.weth, 500, amountIn, 0], //WETH 0.05%
    });

    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.weth, 3000, amountIn, 0], //WETH 0.3%
    });

    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.weth, 10000, amountIn, 0], //WETH 1%
    });
    // ----------------usdt-------------------------
    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.usdt, 500, amountIn, 0], //USDT 0.05%
    });

    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.usdt, 3000, amountIn, 0], //USDT 0.3%
    });

    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.usdt, 10000, amountIn, 0], //USDT 1%
    });

    //------------------------usdc----------------
    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.usdt, 500, amountIn, 0], //USDC 0.05%
    });

    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.usdt, 3000, amountIn, 0], //USDC 0.3%
    });

    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.usdt, 10000, amountIn, 0], //USDC 1%
    });

    //----------------------dai------------------------
    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.dai, 500, amountIn, 0], //DAI 0.05%
    });

    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.dai, 3000, amountIn, 0], //DAI 0.3%
    });

    calls.push({
        target: config.eth.uniswapv3quoter,
        function: "quoteExactInputSingle",
        args: [tokenAddress, config.eth.dai, 10000, amountIn, 0], //DAI 1%
    });

    const allData = await multi.multiCall(abi, calls);
    let priceData=allData[1];

    let price = null;
    let priceList = [];
    for (let iterPrice = 0; iterPrice < priceData.length; iterPrice++) {
        if (priceData[iterPrice] != null) {
            if (iterPrice == 0 || iterPrice == 1 || iterPrice == 2) {
                price = priceData[iterPrice];
                let ethPrice = await getETHPriceFromUniswapv3();
                price = price.toString();
                price = (price * ethPrice) / 10 ** config.eth.wethDecimals;
                priceList.push(price);
            } else if (iterPrice == 3 || iterPrice == 4 || iterPrice == 5) {
                price = priceData[iterPrice];
                price = price.toString() / 10 ** config.eth.usdcDecimals;
                priceList.push(price);
            } else if (iterPrice == 6 || iterPrice == 7 || iterPrice == 8) {
                price = priceData[iterPrice];
                price = price.toString() / 10 ** config.eth.usdtDecimals;
                priceList.push(price);
            } else if (iterPrice == 9 || iterPrice == 10 || iterPrice == 11 ) {
                price = priceData[iterPrice];
                price = price.toString() / 10 ** config.eth.daiDecimals;
                priceList.push(price);
            }
        }
    }
    if (priceList.length == 0) {
        return null;
    }
    let maxPrice = priceList[0];
    priceList.forEach((price) => {
        if (price > maxPrice) {
            maxPrice = price;
        }
    });
    return maxPrice;
}

async function getTokenInfo(tokenAddress) {
    const multi = new MultiCall(provider);
    let calls = [];
    calls.push({
        target: tokenAddress,
        function: "decimals",
        args: [],
    });
    calls.push({
        target: tokenAddress,
        function: "symbol",
        args: [],
    });
    calls.push({
        target: tokenAddress,
        function: "totalSupply",
        args: [],
    });
    calls.push({
        target: tokenAddress,
        function: "name",
        args: [],
    });

    const allData = await multi.multiCall(abi, calls);
    return allData[1];
}

async function getPriceFromUniswapV2(tokenAddress, decimals) {
    const multi = new MultiCall(provider);
    let amountIn = BigInt(10 ** decimals);
    let calls = [];

    calls.push({
        target: config.eth.uniswapv2router,
        function: "getAmountsOut",
        args: [amountIn, [tokenAddress, config.eth.weth]], //WETH
    });

    calls.push({
        target: config.eth.uniswapv2router,
        function: "getAmountsOut",
        args: [amountIn, [tokenAddress, config.eth.usdt]], //USDT
    });

    calls.push({
        target: config.eth.uniswapv2router,
        function: "getAmountsOut",
        args: [amountIn, [tokenAddress, config.eth.usdt]], //USDC
    });

    calls.push({
        target: config.eth.uniswapv2router,
        function: "getAmountsOut",
        args: [amountIn, [tokenAddress, config.eth.dai]], //DAI
    });

    const allData = await multi.multiCall(abi, calls);
    let priceData=allData[1];
    let price = null;
    let priceList = [];
    for (let iterPrice = 0; iterPrice < priceData.length; iterPrice++) {
        if (priceData[iterPrice] != null) {
            if (iterPrice == 0) {
                price = priceData[iterPrice];
                let ethPrice = await getETHPriceFromUniswapv3();
                price = price.toString();
                price = price.split(",")[1];
                price = (price * ethPrice) / 10 ** config.eth.wethDecimals;
                priceList.push(price);
            } else if (iterPrice == 1) {
                price = priceData[iterPrice];
                price = price.toString();
                price = price.split(",")[1];
                price = price / 10 ** config.eth.usdcDecimals;
                priceList.push(price);
            } else if (iterPrice == 2) {
                price = priceData[iterPrice];
                price = price.toString();
                price = price.split(",")[1];
                price = price / 10 ** config.eth.usdtDecimals;
                priceList.push(price);
            } else if (iterPrice == 3) {
                price = priceData[iterPrice];
                price = price.toString();
                price = price.split(",")[1];
                price = price / 10 ** config.eth.daiDecimals;
                priceList.push(price);
            }
        }
    }
    if (priceList.length == 0) {
        return null;
    }
    let maxPrice = priceList[0];
    priceList.forEach((price) => {
        if (price > maxPrice) {
            maxPrice = price;
        }
    });
    return maxPrice;
}

async function getETHPriceFromUniswapv3(){
    let contractAddress = config.eth.ethusdcPool;
    let contract = new provider.eth.Contract(abi, contractAddress);
  
    let slot0 = await contract.methods.slot0().call();
    let sqrtPrice = slot0.sqrtPriceX96;
    let price = ((2 ** 192 / sqrtPrice ** 2) * 10 ** 12);

    return price;
}

async function getPrice(tokenAddress){
    let tokenInfo=await getTokenInfo(tokenAddress);
    let price=await getPriceFromUniswapV3(tokenAddress,tokenInfo[0].toString());
    if(price==null){
        price=await getPriceFromUniswapV2(tokenAddress,tokenInfo[0].toString());
    }
    return price;
}

module.exports={
    getPrice
}