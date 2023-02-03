import { utils as ethersUtils, constants as ethersConstants } from "ethers";
import { DateTime } from "luxon";

function pick(o, ...props) {
  return Object.assign({}, ...props.map((prop) => ({ [prop]: o[prop] })));
}

async function sha256(message) {
  const buffer = await window.crypto.subtle.digest("SHA-256", message.buffer);
  return new Uint8Array(buffer);
}

async function cb58Encode(message) {
  const payload = ethersUtils.arrayify(message);
  const checksum = await sha256(payload);
  const buffer = new Uint8Array(payload.length + 4);
  buffer.set(payload);
  buffer.set(checksum.slice(-4), payload.length);
  return ethersUtils.base58.encode(new Uint8Array(buffer));
}

async function cb58Decode(message) {
  const buffer = ethersUtils.base58.decode(message);
  const payload = buffer.slice(0, -4);
  const checksum = buffer.slice(-4);
  const newChecksum = (await sha256(payload)).slice(-4);

  if (
    (checksum[0] ^ newChecksum[0]) |
    (checksum[1] ^ newChecksum[1]) |
    (checksum[2] ^ newChecksum[2]) |
    (checksum[3] ^ newChecksum[3])
  )
    throw new Error("Invalid checksum");
  return payload;
}

// Usage
// const pipeline = pipeAsyncFunctions(...fns);
// const promises = objs.map((obj) => pipeline(obj));
// const xobjs = await Promise.all(promises);
const pipeAsyncFunctions =
  (...fns) =>
  (arg) =>
    fns.reduce((p, f) => p.then(f), Promise.resolve(arg));

// Generic formatters
const formatters = {
  formatEther: (v) =>
    parseFloat(ethersUtils.formatEther(v)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  formatAvax: (v) =>
    parseFloat(v / 1_000_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  formatMsg: (v) => ethersUtils.toUtf8String(ethersUtils.stripZeros(v)),
  labelAddress: (v, EOALabels) => EOALabels[v] || v,
  bigToNumber: (v) => v.toNumber(),
  unixToISOOnly: (v) => {
    if (v?.toNumber) v = v.toNumber();
    return DateTime.fromSeconds(v || 0).toLocaleString(DateTime.DATETIME_SHORT);
  },
  unixToISO: (v) => {
    if (v?.toNumber) v = v.toNumber();
    if (v === 0) return v;
    const dt = DateTime.fromSeconds(v || 0).toLocaleString(
      DateTime.DATETIME_SHORT
    );
    return `${dt} (${v})`;
  },
};

export {
  formatters,
  pipeAsyncFunctions,
  sha256,
  cb58Encode,
  cb58Decode,
  makeRpc,
};
