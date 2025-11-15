const hre = require("hardhat");

async function main() {
  const aldoToken = "0xb2aFAC42292a6718Ce06c801585b61dfF7bD2D2e";
  const marketplace = "0x47a3F41eE4ce05886D65f5407f25429b292343A8";

  console.log("Verifying ALDO Token...");
  await hre.run("verify:verify", {
    address: aldoToken,
    constructorArguments: [],
  });

  console.log("Verifying Marketplace...");
  await hre.run("verify:verify", {
    address: marketplace,
    constructorArguments: [aldoToken],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
