
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
