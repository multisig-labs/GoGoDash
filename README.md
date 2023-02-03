<h1 align="center">GoGoDash 🎈</h1>
<p align="center">A (growing) collection of useful UIs and Dashboards for Avalanche subnet developers.</p>

## Tech Stack

GoGoDash is built on the shoulders of these giants:

- ReactJS
- [NextJS](https://nextjs.org/)
- [Wagmi](https://wagmi.sh/)
- [RainbowKit](https://www.rainbowkit.com)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Tremor](https://www.tremor.so)

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Avalanche Data

The `gogodash.js` is a depencency-free, pure Javascript class that will `fetch` from your Avalanche node running on localhost, and provide a single JSON blob with the data about the node and your custom Subnets, nicely formatted for use by a front end dashboard.

## Wallet

RainbowKit is configured to access both the C-Chain and your custom Subnet-EVM on your local Avalanche Node.

## Precompiles

Interact with all the standard precompiles in Subnet-EVM directly in the browser.

## GoGoPool

Brought to you by [GoGoPool](https://www.gogopool.com), let a thousand Subnet's bloom!
