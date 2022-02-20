export const networkCollections = {
  "0x61": [
    //Add Your Collections here
    {
      image:
        "https://sov4nxuxgz71.usemoralis.com:2053/server/files/1lHRghK2KvhvHNkoKxiA9SWXsH3RxytBjsOrbqxw/b6bc653fd5575b7a473478b58a3bc4a1_Rifle_Aim.png",
      name: "Dreax",
      addrs: "0x33bD01A9C5d8c361FA7dF97C255C5a1504443E5F",
    },
  ],

  "0x38": [
    //Add Your Collections here
    {
      image:
        "https://sov4nxuxgz71.usemoralis.com:2053/server/files/1lHRghK2KvhvHNkoKxiA9SWXsH3RxytBjsOrbqxw/b6bc653fd5575b7a473478b58a3bc4a1_Rifle_Aim.png",
      name: "Drax",
      addrs: "0xd57b1e431984c49807F134CBc0E43ab0E1223eA8",
    },
  ],
};
//0x13336d56c7723a4249911B21173063bE5E5360eB
export const getCollectionsByChain = (chain) => networkCollections[chain];
