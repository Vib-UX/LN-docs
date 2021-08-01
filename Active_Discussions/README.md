
# QNA - SOB Learnings [Chaincode - Lightning Protocol Development ](https://chaincode.gitbook.io/seminars/lightning-protocol-development)

* What problems could arise if a node participates in multiple paths of a multi-path payment? 

	1. Reduces relative capacity of the channel (The higher the amount relatively lower fees)
	2. On-Chain Foot Print
	3. Complexity for computation increases in order to find optimal path
	4. Sub-optimal results 
	5. Balanced trade-off b/w the capacity and fee-amnt (Current ligtning Cndtn)

* What challenges exist for making routing table synchronization efficient? 

	1. Updating the whole routing table when you came online.
	2. Only updating the required entries by asking entities abt updates (Trust Issues)
	3. Running your own Watch-Towers becomes expensive


* How does a wormhole attack work?

	1. Link - : https://github.com/raiden-network/raiden/issues/3758
	2. https://suredbits.com/payment-points-part-1/
