import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { RadToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("RadToken", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployRadTokenFixture() {
    const initialSupply = ethers.parseEther("1000000"); // 1 million tokens

    // Contracts are deployed using the first signer/account by default
    const [owner, addr1, addr2] = await ethers.getSigners();

    const RadTokenFactory = await ethers.getContractFactory("RadToken");
    const radToken = await RadTokenFactory.deploy(initialSupply);

    return { radToken, initialSupply, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      const { radToken } = await loadFixture(deployRadTokenFixture);

      expect(await radToken.name()).to.equal("RadToken");
      expect(await radToken.symbol()).to.equal("RAD");
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { radToken, initialSupply, owner } = await loadFixture(
        deployRadTokenFixture
      );

      const ownerBalance = await radToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { radToken, owner, addr1, addr2 } = await loadFixture(
        deployRadTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(radToken.transfer(addr1.address, 50)).to.changeTokenBalances(
        radToken,
        [owner, addr1],
        [-50, 50]
      );

      // Transfer 50 tokens from addr1 to addr2
      await expect(
        radToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(radToken, [addr1, addr2], [-50, 50]);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { radToken, owner, addr1 } = await loadFixture(
        deployRadTokenFixture
      );
      const initialOwnerBalance = await radToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner
      await expect(
        radToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed
      expect(await radToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});
