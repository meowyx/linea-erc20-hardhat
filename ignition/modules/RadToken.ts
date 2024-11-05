import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Default initial supply: 1 million tokens with 18 decimals
const DEFAULT_INITIAL_SUPPLY: bigint = 1_000_000n * 10n ** 18n;

const RadTokenModule = buildModule("RadTokenModule", (m) => {
  // Allow the initial supply to be configurable, with a default value
  const initialSupply = m.getParameter("initialSupply", DEFAULT_INITIAL_SUPPLY);

  // Deploy the RadToken contract
  const radToken = m.contract("RadToken", [initialSupply]);

  return { radToken };
});

export default RadTokenModule;
