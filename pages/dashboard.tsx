import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  AccordionList,
  Card,
  Title,
  Metric,
  Text,
  TextInput,
  Bold,
  Flex,
  ColGrid,
  Block,
} from "@tremor/react";
import Footer from "../components/footer";
import logo from "../imgs/ggp-logo-mark-brand.svg";
import { useGoGoData } from "../components/gogoProvider";

const Dashboard: NextPage = () => {
  const ggd: any = useGoGoData();

  return (
    <div>
      <Head>
        <title>GoGoTools</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-6 sm:p-10 bg-slate-50 h-screen">
        <div className="flex flex-row-reverse">
          <ConnectButton />
        </div>
        <Flex
          justifyContent="justify-start"
          spaceX="space-x-0.5"
          alignItems="items-center"
        >
          <Image src={logo} alt="GoGoPool" height={50} width={50} />
          <Metric>GoGoTools</Metric>
        </Flex>

        <ColGrid
          numColsMd={2}
          numColsLg={3}
          gapX="gap-x-6"
          gapY="gap-y-6"
          marginTop="mt-6"
        >
          <Card decoration="top" decorationColor="red">
            <Flex justifyContent="justify-start" spaceX="space-x-10">
              <div>
                <Text>AvalancheGo</Text>
                <Metric>{ggd?.nodeVersion?.vmVersions?.platform}</Metric>
              </div>
              <div>
                <Text>Network</Text>
                <Metric>
                  {ggd?.networkName} ({ggd?.networkID})
                </Metric>
              </div>
            </Flex>
            <Flex justifyContent="justify-start" spaceX="space-x-10">
              <Text marginTop="mt-5">P-Chain Blk #{ggd.heightP}</Text>
              <Text marginTop="mt-5">C-Chain Blk #{ggd.blockNumberC}</Text>
            </Flex>
          </Card>
          {ggd.customSubnets?.map((subnet: any) => {
            return (
              <Card key={subnet.id} decoration="top" decorationColor="indigo">
                <Flex justifyContent="justify-start" spaceX="space-x-10">
                  <div>
                    <Text>{subnet.name} Subnet</Text>
                    <Metric>
                      {subnet.vm.name} {subnet.vm.version}
                    </Metric>
                  </div>
                </Flex>
                <Text marginTop="mt-5" truncate={true}>
                  <Bold>SubnetID: </Bold>
                  {subnet.id}
                </Text>
                {subnet.blockchains.map((chain: any) => (
                  <div key={chain.id}>
                    <Text marginTop="mt-0" truncate={true}>
                      <Bold>ChainID: </Bold>
                      {chain.id}
                    </Text>
                    <Text marginTop="mt-0" truncate={true}>
                      {ggd.VMs.vms[chain.vmID]}{" "}
                      {ggd.nodeVersion.vmVersions[ggd.VMs.vms[chain.vmID]]}
                    </Text>
                  </div>
                ))}
              </Card>
            );
          })}
          <Card decoration="top" decorationColor="green">
            {ggd?.rpcs?.map((rpc: any) => (
              <div key={rpc.name} className="min-width-full">
                <Text>{rpc.name} RPC</Text>
                <TextInput defaultValue={rpc.url} maxWidth="max-w-xl" />
              </div>
            ))}
          </Card>
        </ColGrid>

        <Block marginTop="mt-6">
          <Card>
            <Accordion expanded={false} shadow={true} marginTop="mt-0">
              <AccordionHeader>Raw JSON Data</AccordionHeader>
              <AccordionBody>
                <pre>{JSON.stringify(ggd, null, 2)}</pre>
              </AccordionBody>
            </Accordion>
          </Card>
        </Block>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
