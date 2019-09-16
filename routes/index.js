const express = require('express')
const Axios = require('axios')
const router = express.Router()

const mainnetURL = 'http://52.79.77.191:5006/'
const mainnetBackup = 'http://some.where.over.the.rainbow/'
const testnetURL = 'http://it.is.not.defined.url/'

const ServerNotWorking = {
  error: 'server is not working'
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('hello world')
})

router.post('/', function(req, res, next) {
  res.send({this:'is response'})
})

router.get('/:target/address/balance/:address', function(req, res, next) {
  let url = req.params.target === 'mainnet' ? mainnetURL : testnetURL
  const postdata = {
    method: 'account_info',
    params: [
      {
        account: req.params.address,
        strict: true,
      }
    ]
  }
  Axios.post(url, postdata).then((result) => {
    console.log(result)
    res.send(result.data.result)
  }, () => {
    res.send(ServerNotWorking)
  })
})

router.get('/:target/address/transactionlist/:address', function(req, res, next) {
  let url = req.params.target === 'mainnet' ? mainnetURL : testnetURL
  const marker = req.query.ledger !== undefined && req.query.seq !== undefined ? {
    ledger: req.query.ledger,
    seq: req.query.seq,
  } : undefined
  const postdata = {
    method: 'account_tx',
    params: [
      {
        account: req.params.address,
        limit: 20,
        ledger_index_max: -1,
        ledger_index_min: -1,
        marker: marker
      }
    ]
  }
  Axios.post(url, postdata).then((result) => {
    console.log(result)
    res.send(result.data.result)
  }, () => {
    res.send(ServerNotWorking)
  })
})

router.post('/:target/broadcasttx', function(req, res, next) {
  let url = req.params.target === 'mainnet' ? mainnetURL : testnetURL
  const postdata = {
    method: 'submit',
    params: [
      {
        tx_blob: req.body.rawtx,
      }
    ]
  }
  Axios.post(url, postdata).then((result) => {
    console.log(result)
    res.send(result.data.result)
  })
})

router.get('/:target/fee', function(req, res, next) {
  let url = req.params.target === 'mainnet' ? mainnetURL : testnetURL
  const postdata = {
    method: 'fee',
    params: [{ }]
  }
  Axios.post(url, postdata).then((result) => {
    console.log(result)
    res.send(result.data.result)
  })
})

router.get('/:target/rawtx/:txid', function(req, res, next) {
  let url = req.params.target === 'mainnet' ? mainnetURL : testnetURL
  const postdata = {
    method: 'tx',
    params: [{
      transactions: req.params.txid,
      binary: true,
    }]
  }
})

module.exports = router
