import { createContext, useContext, useState, useEffect } from "react";
import { GoGoDash } from "../src/gogodash";

const GoGoContext = createContext({});

const GGD = new GoGoDash({});

export function GoGoProvider({ children }: any) {
  const [rpcUrl, setRpcUrl] = useState("http://localhost:9650");
  const [ggdata, setGgdata] = useState({});

  const mount = () => {
    console.log("mounted");
    let mounted = true;

    GGD.refreshDataLoop(() => {
      mounted && setGgdata(GGD.displayData());
    });

    const unmount = () => {
      console.log("unmounted");
      mounted = false;
    };
    return unmount;
  };
  useEffect(mount, []);

  return <GoGoContext.Provider value={ggdata}>{children}</GoGoContext.Provider>;
}

export function useGoGoData() {
  const contextValue = useContext(GoGoContext);
  return contextValue;
}
