const fs = require('fs').promises;
const contractName = process.argv[process.argv.length - 1];
const CONTRACT = artifacts.require(contractName);
const network = process.argv[process.argv.indexOf("--network") + 1];

if (!contractName || !network) {
    throw new Error("Could not determine target contract or network");
}

async function main() {
    console.log(`Deploy ${contractName} to network "${network}"`);
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

    const instance = await CONTRACT.new(deployOptions);

    console.log(`Deployed at: ${instance.address}`);

    const fileName = `./records/${contractName}-${network}.txt`;
    const fileContents = `Deployer Address: ${deployer}\nNetwork: ${network}\nContract: ${contractName}\nDeployed At: ${instance.address}`;
    await fs.writeFile(fileName, fileContents);
    console.log(`Record of deployment written to ${fileName}`);
}

module.exports = function (callback) {
    main()
        .then(callback)
        .catch((err) => {
            console.error(err.message)
            callback()
        })
}
