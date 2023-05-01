# BTC / USD 
curl -d '{"feedAddress": "0x5741306c21795FdCBb9b265Ea0255F499DFe515C"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tokens/chainLink
# DOGE / USD
curl -d '{"feedAddress": "0x963D5e7f285Cc84ed566C486c3c1bC911291be38"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tokens/chainLink
# ETH / USD
curl -d '{"feedAddress": "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tokens/chainLink
# USDT / USD (stable)
curl -d '{"feedAddress": "0xEca2605f0BCF2BA5966372C99837b1F182d3D620"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tokens/chainLink
# DAI / USD (stable)
curl -d '{"feedAddress": "0xE4eE17114774713d2De0eC0f035d4F7665fc025D"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tokens/chainLink
