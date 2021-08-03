
# QNA - SOB Learnings [Chaincode - Lightning Protocol Development ](https://chaincode.gitbook.io/seminars/lightning-protocol-development)

* When two parties exchange the previous commitment's secrets (to invalidate previous state), how do you make sure that the exchange happen atomically? (i.e., that both receive the other's secret, or none at all)<br>
	1. Its hard to attain automicity but in long run for HTLCs to move forward both parties should share their revocation keys for the previous commitment transactions when passing the current signed commitment txn's.
	2. If one of the party doesn't share his/her revocation key the other party can easily publish the recent commitment txn to the Bitcoin network and grab their funds thus closing the channel.
	3. For more clearity this scenario is actively discussed [here](https://youtu.be/Hzv9WuqIzA0?t=2128).

* What problems could arise if a node participates in multiple paths of a multi-path payment? 

	1. Reduces relative capacity of the channel (The higher the amount relatively lower fees).
	2. On-Chain Foot Print.
	3. Complexity for computation increases in order to find optimal path.
	4. Sub-optimal results.
	5. Balanced trade-off b/w the capacity and fee-amnt (Current ligtning Cndtn).

* What challenges exist for making routing table synchronization efficient? 

	1. Updating the whole routing table when you come online. 
	2. Only updating the required entries by asking entities abt updates (Trust Issues).
	3. Running your own Watch-Towers becomes expensive.


* How does a wormhole attack work?
	
	1. Link - : https://github.com/raiden-network/raiden/issues/3758
	2. https://suredbits.com/payment-points-part-1/

* Can sender or receiver notice a wormhole attack?

	1. Its hard to notice a wormhole attack because of [Onion Routing](https://www.geeksforgeeks.org/onion-routing/) which tends to keep the details hidden related to sender and receiver. 
	2.	Once the HTLCs timeout happens the funds have been redirected to the intermediary nodes which are affected by wormhole attack and it looks like the payment have been reverted.
	3. But stil there are ways in which we can remove the possibility of wormhole by including some sort of randomness in each hop so that malicious node won't be able to jump the intermediaries. For full solution you can refer [Wormhole Attacks Soln](https://suredbits.com/payment-points-part-1/#:~:text=There%20is%20an%20outstanding%20proposal%20that%20fixes%20this%20problem%20(as%20well%20as%20introducing%20a%20bunch%20of%20cool%20new))

* Why do we need `SIGHASH_NOINPUT` for eltoo?
	
	1. `SIGHASH_NOINPUT` is very important for eltoo to work. This new sighash flag would allow a Bitcoin signature to commit to a transaction without specifying the txid of the input.
	2. Leaving the txid unspecified enables greater flexibility for transactions. It means descendant transactions can be signed before their ancestors are published to the blockchain.
	3. Currently we don't have `SIGHASH_NOINPUT` in our Bitcoin Network, So in order to change the consensus it would require a [Soft Fork](https://www.investopedia.com/terms/s/soft-fork.asp)

	References : 
	* https://raghavsood.com/blog/2018/06/10/bitcoin-signature-types-sighash
	* https://bitcoinops.org/en/topics/sighash_noinput/
	* https://bitcoin.stackexchange.com/questions/87443/do-we-still-need-sighash-noinput-for-lightning-network

