# base

A small, working example project for [Base](https://base.org): an ERC-20 token written in Solidity, tested with Foundry, deployable to Base Sepolia, plus a TypeScript CLI for checking balances and sending transfers.

## Layout

| Path | What it is |
| --- | --- |
| `src/BaseGuildToken.sol` | Dependency-free ERC-20 with owner mint, holder burn and ownership transfer |
| `test/` | Foundry tests (unit + a fuzz test) |
| `script/Deploy.s.sol` | Deployment script |
| `cli/` | `bgt` CLI built on [viem](https://viem.sh) |
| `.github/workflows/ci.yml` | Builds and tests contracts and CLI on every push and PR |

## Contracts

Requires [Foundry](https://book.getfoundry.sh/getting-started/installation).

```sh
forge install foundry-rs/forge-std --no-git
forge build
forge test -vvv
```

### Deploy to Base Sepolia

Get test ETH from a Base Sepolia faucet, then:

```sh
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --private-key $PRIVATE_KEY
```

Optional env vars: `TOKEN_NAME`, `TOKEN_SYMBOL`, `TOKEN_SUPPLY` (in wei units). See `.env.example`.

## CLI

Requires Node 20+.

```sh
cd cli
npm install
npm run build

export TOKEN_ADDRESS=0x...        # deployed token
export RPC_URL=https://sepolia.base.org   # optional, this is the default

node dist/index.js balance 0xYourAddress

export PRIVATE_KEY=0x...          # only needed for transfers; use a throwaway test key
node dist/index.js transfer 0xRecipient 12.5
```

The CLI targets Base Sepolia. Run `npm test` for the unit tests and `npm run typecheck` for type checking.

## License

MIT
