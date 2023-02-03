// Zero-dependency, read-only interface to Avalanche Blockchain parameters

const EMPTYID = "11111111111111111111111111111111LpoYY";

function makeRpc(method, params = {}) {
  const rpc = {
    id: Math.floor(Math.random() * 1e10),
    jsonrpc: "2.0",
    method,
    params,
  };

  return {
    method: "POST",
    body: JSON.stringify(rpc),
    headers: {
      "Content-Type": "application/json",
    },
  };
}

class GoGoDash {
  avaURL;
  data;

  constructor({ avaURL = "http://localhost:9650" }) {
    Object.assign(this, {
      avaURL,
    });
  }

  async fetchData() {
    if (!this.avaURL) return;
    const metrics = [
      {
        name: "nodeID",
        url: "/ext/info",
        method: "info.getNodeID",
        resultFn: (v) => v.nodeID,
      },
      {
        name: "nodeVersion",
        url: "/ext/info",
        method: "info.getNodeVersion",
        resultFn: (v) => v,
      },
      {
        name: "VMs",
        url: "/ext/info",
        method: "info.getVMs",
        resultFn: (v) => v,
      },
      {
        name: "networkID",
        url: "/ext/info",
        method: "info.getNetworkID",
        resultFn: (v) => v.networkID,
      },
      {
        name: "networkName",
        url: "/ext/info",
        method: "info.getNetworkName",
        resultFn: (v) => v.networkName,
      },
      {
        name: "healthy",
        url: "/ext/health",
        method: "health.health",
        resultFn: (v) => v.healthy,
      },
      {
        name: "heightP",
        url: "/ext/bc/P",
        method: "platform.getHeight",
        resultFn: (v) => v.height,
      },
      {
        name: "timestampP",
        url: "/ext/bc/P",
        method: "platform.getTimestamp",
        resultFn: (v) => v.timestamp,
      },
      {
        name: "blockchains",
        url: "/ext/bc/P",
        method: "platform.getBlockchains",
        resultFn: (v) => v.blockchains,
      },
      {
        name: "subnets",
        url: "/ext/bc/P",
        method: "platform.getSubnets",
        resultFn: (v) => v.subnets,
      },
      {
        name: "blockNumberC",
        url: "/ext/bc/C/rpc",
        method: "eth_blockNumber",
        params: [],
        resultFn: (v) => parseInt(v, 16),
      },
      {
        name: "timestampC",
        url: "/ext/index/C/block",
        method: "index.getLastAccepted",
        resultFn: (v) => v?.timestamp,
      },
    ];
    const promises = metrics.map((m) =>
      fetch(`${this.avaURL}${m.url}`, makeRpc(m.method, m.params)).then((res) =>
        res.json()
      )
    );
    let results = await Promise.all(promises);

    this.data = { avaURL: this.avaURL };

    for (let i = 0; i < metrics.length; i++) {
      const value = metrics[i].resultFn
        ? metrics[i].resultFn.call(this, results[i].result)
        : results[i].result;
      this.data[metrics[i].name] = value;
    }

    return this.data;
  }

  rpcs() {
    const out = [];
    out.push({
      name: "C-Chain",
      url: `${this.data.avaURL}/ext/bc/C/rpc`,
    });
    this.data.blockchains?.forEach((chain) => {
      if (chain.subnetID != EMPTYID) {
        out.push({
          name: chain.name,
          url: `${this.data.avaURL}/ext/bc/${chain.id}/rpc`,
        });
      }
    });
    return out;
  }

  // Since most "Subnets" will have only one "Blockchain",
  // copy the subnet name and vm info from the first blockchain
  customSubnets() {
    return this.data.subnets
      .filter((subnet) => subnet.id != EMPTYID)
      .map((subnet) => {
        const blockchains = this.data.blockchains.filter(
          (bc) => bc.subnetID === subnet.id
        );

        const vmName = this.data.VMs.vms[blockchains[0]?.vmID]?.at(0);
        return {
          id: subnet.id,
          name: blockchains[0]?.name,
          vm: {
            id: blockchains[0]?.vmID,
            name: vmName,
            version: this.data?.nodeVersion?.vmVersions[vmName],
          },
          threshold: subnet.threshold,
          controlKeys: subnet.controlKeys,
          blockchains: blockchains,
        };
      });
  }

  // Return a JSON with a more front-end friendly shape
  displayData() {
    return {
      rpcs: this.rpcs(),
      customSubnets: this.customSubnets(),
      ...this.data,
    };
  }

  refreshDataLoop(cb) {
    if (!this.avaURL) return;
    const poll = async () => {
      // console.log("Polling for blockchain data");
      await this.fetchData();
      cb(this);
      setTimeout(poll, 5000);
    };
    poll();
  }
}

export { GoGoDash };
