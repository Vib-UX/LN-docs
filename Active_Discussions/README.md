
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


* How does a wormhole attack work?<br>
	<img src = "https://user-images.githubusercontent.com/44281/55712186-96498580-59ee-11e9-9d6c-7a9e5eee37cb.png" width="500" height ="500" ><br>
	1. For wormhole attack to be successful there should be atleast 2 malicious node on same route. 
	2. From the image attached its clearly shown that D directly reveals the secret/pre-image to B. This can be done using private channels as they are not listed publicaly.
	3. Thereby gaining fees reward of C and C's HTLCs locktime will expire thus his/her txn will be reverted. <br>
	References
	* https://github.com/raiden-network/raiden/issues/3758
	* https://suredbits.com/payment-points-part-1/
	
	[Brian's Observation : ](https://twitter.com/munich_brian) If we looks at broader picture wormhole attack is kinda good for LN. The private connection which we were unaware of b/w B and D helps speed the transitions of preimage/secret. 

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

* Why is a unidirectional channel easy to implement?

	1. In case of unidirectional channel the flow of money is only in one direction. 
	2. The fundee creates a 2-of-2 mutisig funding_txn and lock the funds by publishing it on-chain.
	3. Therefore, In every iteration of commitment txn fundee only need to sign it with his/her secret key and change the output values.
	4. Now whenever other party will feel that this the final commitment txn, they will sign it using their private key and publish it on-chain.

	Similar is not the case with Bidirectional channels where the flow is both ways and either node can behave maliciously by trying to publish the most profitable txn rather than most recent one. Although we have *Time-based bi-directional payment channels* or *Punishment based bi-directional payment channels* but these are bit complex to implement w.r.t unidirectional channels.<br><br>
	References :
	* [Time-based bi-directional payment channels](https://blog.chainside.net/understanding-payment-channels-4ab018be79d4#:~:text=before%20that%20date.-,Time-based%20bi-directional%20payment%20channels,-While%20in%20a)
	* [LN Penalty](https://blog.chainside.net/understanding-payment-channels-4ab018be79d4#:~:text=Punishment-based%20payment%20channels).
	* [LN-Unidriectional](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3840374) 

* What privacy tradeoffs do trampoline payments have? How can they be mitigated?

	1. As we know in LN we follow *Source based routing* sometimes it becomes harder to find the path from sender to receiver (depends on network topology).
	2. Trampoline nodes are generally used to allow constrained devices to send/receive payments.
	3. So sender tries to reach the nearest trampoline node which could help detect the path to destination.
	4. It comes with the privacy tradeoff that we need to release the info related to receiving end to route payments.
	5. To mitigate this sender is completely free to add more intermediate trampoline hops to the route to improve privacy (by effectively using longer routes) or to ensure a given node is able to witness the payment.<br>
	
	References :
	* [Trampoline Routing docs](https://github.com/lightningnetwork/lightning-rfc/blob/trampoline-routing-no-gossip/proposals/trampoline.md#privacy)
	* [Routing problems and solutions (rendezvous, trampoline)](https://www.youtube.com/watch?v=1O-bhcbh9vE)

* Given the fact that Lightning is punishment-based and requires nodes to be online, could an attacker trick you into publishing old states and lose all your funds?

	1. In [LN Penalty](https://river.com/learn/terms/l/lightning-network-penalty/) if a user publishes one of the previous commitment txn instead of the most recent one intentionally or unintentionally he/she suffers from very high penalty as the previous commitment txn's revocation key is already revealed/sent during the signing of most recent one.
	2. Generally in LN there is a chance of connection breakdown when one of the two nodes goes offline.
	3. While restablishing the connection a data loss is highly likely, thus you won't be able to verify which is the most recent state your corresponding node has.
	4. He/she can claim one of the previous state to be the most recent one, as the data loss has occured on your side you will be tricked in publishing an old state.  
	5. To avoid this user has to be active all the time to maintain the current state or use 3rd party( [Watchtowers](https://wiki.ion.radar.tech/tech/research/watchtowers)).<br>
	
	References :
	* [LN-penalty Issues](https://www.investopedia.com/tech/bitcoin-lightning-network-problems/)
	* [Revocable Transactions](https://www.derpturkey.com/revocable-transactions-with-ln-penalty/)
	  
* How can a griefing attack affect routing nodes and what are possible counter measures?

	1. The attacker can try to flood one or several channels using unresolved HTLCs by controlling both sending and receiving end.
	2. This is usually done to limit the routing of txn's from the attacked channel and diverting the HTLCs route to your channels thus earning rewards. Further In theory, an attacker could contact the victim (perhaps via a keysend message or in an "onion blob") and demand a ransom be paid to halt the attack.
	3. Only 483 of these unresolved HTLCs are required to overwhelm a channel per direction. Once those HTLCs are in the channel, any transactions using that same channel direction are impossible, including a transaction to cooperatively close that channel.
	![HTLCs](https://bitcoinmagazine.com/.image/c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_700/MTc5Mjk3ODA4ODk2NTY2OTc5/photo_2021-01-01_16-42-14.webp)

	### Counter Measures :

It is not possible today to fully prevent this type of attacks, but we can make the attacker's job
harder by properly configuring channels:

* the attacker needs to lock at least `htlc_minimum_msat * max_accepted_htlcs` of his own funds to
  completely fill a channel, so you should use a reasonable value for `htlc_minimum_msat` (1 sat is
  **not** a reasonable value for channels with a big capacity; it may be ok for smaller channels
  though)
* open redundant unannounced channels to your most profitable peers
* implement relaying policies to avoid filling up channels: always keep X% of your HTLC slots
  available, reserved for high-value HTLCs

Long-lived controlled spams might also be mitigated by a relay policy rejecting too far in the
future CLTV locktime or requiring a lower `cltv_expiry_delta`. This later mitigation may downgrade
relay node security.<br><br>

References :

* [Griefing Attack - Article](https://bitcoinmagazine.com/technical/good-griefing-a-lingering-vulnerability-on-lightning-network-that-still-needs-fixing)
* [Griefing-Penalty: Countermeasure for Griefing Attack in Lightning Network](https://arxiv.org/abs/2005.09327)
* https://ieeexplore.ieee.org/document/9343090


