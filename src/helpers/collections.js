export const networkCollections = {
  "0x61": [
    //Add Your Collections here
    {
      image:
        "https://sov4nxuxgz71.usemoralis.com:2053/server/files/1lHRghK2KvhvHNkoKxiA9SWXsH3RxytBjsOrbqxw/b6bc653fd5575b7a473478b58a3bc4a1_Rifle_Aim.png",
      name: "Dreax",
      addrs: "0xcBcD639ea00e9Ee222d4847cC0318cB0f3258Ff2",
    },
  ],

  "0x38": [
    //Add Your Collections here
    {
      image:
        "https://sov4nxuxgz71.usemoralis.com:2053/server/files/1lHRghK2KvhvHNkoKxiA9SWXsH3RxytBjsOrbqxw/b6bc653fd5575b7a473478b58a3bc4a1_Rifle_Aim.png",
      name: "Drax",
      addrs: "0x1DD7ed418cC8a7b95AB822CCc7ec8CCC44686996",
    },
  ],
};
//0x13336d56c7723a4249911B21173063bE5E5360eB
export const getCollectionsByChain = (chain) => networkCollections[chain];
