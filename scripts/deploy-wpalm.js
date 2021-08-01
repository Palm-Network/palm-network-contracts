const CONTRACT = artifacts.require('WPALM')

async function main() {
    const accounts = await web3.eth.getAccounts()
    const deployer = accounts[0]

    // 10 gwei
    const gasPrice = await 10 * Math.pow(10, 9);
    const nonce = await web3.eth.getTransactionCount(deployer)

    const deployOptions = {
        from: deployer,
        gas: 4000000, // should be enough
        gasPrice,
        nonce,
    };
    console.log(`Deploying WPALM contract with options: \n${JSON.stringify(deployOptions, null, 4)}`);

    const instance = await CONTRACT.new(deployOptions)

    console.log(`Deployed at: ${instance.address}`)
}

module.exports = function (callback) {
    main()
        .then(callback)
        .catch((err) => {
            console.error(err.message)
            callback()
        })
}
