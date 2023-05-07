const market  = artifacts.require("Marketplace");
const nft  = artifacts.require("NFTMint");

App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    contractInstance1: null,
    contractInstance2: null,
  
    init: async () => {
      await App.initWeb3()
      await App.initContracts()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    initWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    initContracts: async () => {
    //   const market = await $.getJSON('Marketplace.json')
    //   const nft = await $.getJSON('NFTMint.json')
      App.contracts.market = market
      App.contracts.nft = nft
      App.contracts.market.setProvider(App.web3Provider)
      App.contracts.nft.setProvider(App.web3Provider)
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
      $('#account').html(App.account)
  
      // Load smart contract
      const Market_deploy = await App.contracts.market.deployed()
      const NFT_deploy = await App.contracts.nft.deployed()
      App.contractInstance1 = Market_deploy
      App.contractInstance2 = NFT_deploy
  
      const Market_deployed = await App.contractInstance1.get()
      const NFT_deployed = await App.contractInstance2.get()
      $('#Market_deployed').html(Market_deployed)
      $('#NFT_deployed').html(NFT_deployed)
  
      App.setLoading(false)
    },
  
    set: async () => {
      App.setLoading(true)
  
      const newValue = $('#newValue').val()
  
    //   await App.contractInstance.set(newValue)
      window.alert('Value updated! Refresh this page to see the new value (it might take a few seconds).')
    },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.init()
    })
  })