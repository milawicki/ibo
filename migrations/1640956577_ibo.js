const ibo = artifacts.require('ibo');

module.exports = function(_deployer) {
  const adapter = ibo.interfaceAdapter;
  const web3 = adapter.web3;

  const NAME = 'Solaris 2022';
  const SYMBOL = 'SOL22';
  const NUMBER_OF_BOTTLES = 100;
  const DESCRIPTION = 'New vintage of our best wine';
  const PRODUCER = 'Chateau Lawicki';
  const URL_TO_MORE_INFO = 'http://www.wine.eth';
  const PRICE_IN_ETH = '0.02';
  const SHOP_PRICE_IN_ETH = '0.05';

  _deployer.deploy(
    ibo, NAME, SYMBOL, NUMBER_OF_BOTTLES, DESCRIPTION, PRODUCER, URL_TO_MORE_INFO,
    web3.utils.toWei(PRICE_IN_ETH, 'ether'), web3.utils.toWei(SHOP_PRICE_IN_ETH, 'ether')
  );
};
