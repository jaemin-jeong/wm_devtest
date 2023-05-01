# BTC / USD 
curl -d '{"symbol": "btcusd"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tokens/bitfinex
# DOGE / USD
curl -d '{"symbol": "doge:usd"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tokens/bitfinex
# ETH / USD
curl -d '{"symbol": "ethusd"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tokens/bitfinex
# DAI / USD (stable)
curl -d '{"symbol": "daiusd"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tokens/bitfinex
