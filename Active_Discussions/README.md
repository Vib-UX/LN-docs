
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
	
	[Brian's Observation : ](https://twitter.com/munich_brian) If we look at broader picture wormhole attack is kinda good for LN. The private connection which we were unaware of b/w B and D helps speed the transitions of preimage/secret. 

* Can sender or receiver notice a wormhole attack?

	1. Its hard to notice a wormhole attack because of [Onion Routing](https://www.geeksforgeeks.org/onion-routing/) which tends to keep the details hidden related to sender and receiver. 
	2.	Once the HTLCs timeout happens the funds have been redirected to the intermediary nodes which are affected by wormhole attack and it looks like the payment have been reverted.
	3. But still there are ways in which we can remove the possibility of wormhole by including some sort of randomness in each hop so that malicious node won't be able to jump the intermediaries. For full solution you can refer [Wormhole Attacks Soln](https://suredbits.com/payment-points-part-1/#:~:text=There%20is%20an%20outstanding%20proposal%20that%20fixes%20this%20problem%20(as%20well%20as%20introducing%20a%20bunch%20of%20cool%20new))

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
	* https://ieeexplore.ieee.org/document/9343090 <br><br>

* What are the advantages and disadvantages of multiparty channels?

	![](https://themoneymongers.com/wp-content/uploads/2019/03/Channel-Factories.jpg)<br>
	
	Advantages :
	1. Multiparty channels increases flexibility in LN, by reducing number of hops to settle on-chain.
	2. It helps in speedy transition of HTLCs thus making it Lightning fast!
	3. Further we can also have high liquidity in a channel due to multiple parties involved.
	4. Moreover using Channel Factories we can subdivide the commitment_txn into sub groups of x-of-x multisig.
	
	Disadvantages :
	1. To get the final commitment_txn settle on-chain all the parties should sign, which could lead to some disputes.
	2. On-boarding members in between could lead to double spend (when stakes are involved).
	3. Not suitable for LN-Penalty (due to maintenance of revocation keys for every iteration of commitment_txn, subdivision of channel states could lead to more complex structure.)

	References :

	* [Chaincode Labs - Mutiparty Channels](https://residency.chaincode.com/presentations/lightning/Multiparty_Channels.pdf)
	* [Channel Factory ](https://wiki.ion.radar.tech/tech/research/channel-factory)
	* [Mutiparty Channels by Christian Decker](https://www.youtube.com/watch?v=PUDWGH_MvmQ)

* What's the difference between a MAC and an HMAC?

	1. MAC : (Message Authentication code) <br>![MAC](https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/MAC.svg/661px-MAC.svg.png)
		* Senders first hashes the msg
		* Hashed msg is encrypted with symmetric key (MAC)
		* Now MAC and msg is send.
		* Receivers hashes the msg
		* Decrypt the received msg using symmetric key
		* Compare both the hashes.
	
	
	2. HMAC : <br> ![image](https://media.springernature.com/original/springer-static/image/chp%3A10.1007%2F978-3-662-45043-7_52/MediaObjects/330104_1_En_52_Fig2_HTML.gif)
		* Shared Key (Symmetric Key) is divided into 2 keys
		* msg XOR with key_1_a
		* Hashes the xor msg
		* Now this hashed msg is encrypted with key_1_b (HMAC)
		* Sender sends the msg with HMAC
		* Receiver finds the local HMAC and compare it with senders HMAC
	
	References :
	
	* [HMAC](https://www.youtube.com/watch?v=NU923LkfuvE)
	* [CBC MAC](https://www.youtube.com/watch?v=BsWsJfIisvY&list=RDCMUCDf3VLjM5A4MntJvCfls4sQ&index=2)
	* [HMAC vs MAC](https://security.stackexchange.com/questions/20129/how-and-when-do-i-use-hmac)

* What are routing hints and why are they important for private channels? Do they leak privacy?

	1. Private channels are a term used to describe a channel that is not announced to the Lightning Network. The public cannot passively know that a channel exists between two nodes nor the UTXOs behind them. Only your channel partner knows this information by default.
	2. To receive funds via private channels, you have to encode the private channel info into the invoice that you give to the sender. Unfortunately, channel IDs are determined by the UTXO info. Senders can tell what UTXOs make up your private channels. 
	3. Not only do you reveal this info to each sender you request funds from, but it could also be probed by an attacker. It is possible to spam payments through a node in an attempt to hit an actual private channel by guessing the UTXO.
	4.  An attacker starts by analyzing all transactions on the Bitcoin network and creating a set of UTXOs that sent to a multi-sig looking address. Once the attacker detects that a UTXO is used in a victim's private channel, the attacker can then attempt to guess who the other node is.
	5.  They do this by replacing the node pubkey with one of the 20,000 nodes known by the Lightning network.
	
	References : 
	
	* https://medium.com/suredbits/lightning-network-101-privacy-245d98210ab
	* [Analysis and Probing of Parallel Channels in the Lightning Network](https://eprint.iacr.org/2021/384.pdf)
	* https://en.bitcoin.it/wiki/Privacy#Lightning_Network
	* [Security and Privacy of Lightning Network Payments](https://arxiv.org/abs/2103.08576)

* How can just-in-time routing help with routing payments?
	
	1. In JIT routing, forwarding nodes send a circular payment to themselves if the balance of a channel is insufficient to forward a payment (channel rebalancing).
	2. Its main idea is to mitigate the disadvantages from our current source based routing (i.e.: guessing a route that will work in the sense that it has enough liquidity in each channel) and make the routing process a little bit more like the best effort routing that we know from IP-forwarding.
	3. . In the probing scenario, a JITsupporting node will not send an error message back if it is lacking funds on the attacked (probed) channel. Rather, it will interrupt the routing process, rebalance its channels, and continue forwarding the payment.

	References :
	
	* [Whitepaper by René Pickhardt](https://lists.linuxfoundation.org/pipermail/lightning-dev/2019-March/001891.html)
	* [Exploring Lightning Network Routing](https://blog.lightning.engineering/posts/2018/05/30/routing.html)
	* [Onion Routing](https://www.youtube.com/watch?v=zaBY9_eEQWE)
	* [5.2.3 JIT Routing](https://www.researchgate.net/publication/340374590_Probing_Channel_Balances_in_the_Lightning_Network)

* If a channel is being closed unilaterally, and the commitment tx has a low fee, can one of the parties bump the fees with CPFP (spend their output with a high fee)? If not, why not?

	1. When attacking at the commitment transaction level, which impacts all HTLCs outputs in that transaction. The attacker creates the following mempool split-brain:
		* all miners have one version of the commitment transaction
		* the rest of the network has another version of the commitment transaction
	2. Thus one cannot bump the fees with CPFP (spend their output with a high fee) this is because without package relay, CPFP will not help our valid transaction propagate all the way to miners' mempools.
	3. And even if you knew what transaction is in the miners' mempools somehow and wanted to use CPFP/carve-out to get that transaction to confirm (which unblocks the situation) you cannot propagate your carve-out to miners because your area of the network doesn't have the transaction from which you're carving out in their mempools, so they won't relay anything.
	
	References :
	
	* https://lists.linuxfoundation.org/pipermail/lightning-dev/2020-April/002639.html
	* https://lists.linuxfoundation.org/pipermail/lightning-dev/2020-June/002758.html
	* https://github.com/t-bast/lightning-docs/blob/master/pinning-attacks.md#pinning-attacks

* How do watchtowers work with non-advertised channels when part of the graph is not known? Or with trampoline when the routing calculation is outsourced?

	1.  To provide security even to parties that may go off-line for an extended period of time, watchtowers are protocols that enables such parties to delegate to a third party, called the custodian, to cancel execution forks on their behalf.
	2. It implement unlinkable channel monitoring and recovery for Lightning network channels.
	3. A watchtower doesn't really concern the trampoline routing but more focused on watching the blockchain to see when a particular transaction is broadcast to the mempool. If that transaction is flagged in its memory as part of an outdated contract, it broadcasts the latest version of the contract it knows about.
	
	References :
	
	* https://lists.linuxfoundation.org/pipermail/lightning-dev/2018-April/001196.html
	* https://github.com/mit-dci/lit/tree/master/watchtower
	* https://github.com/lightningnetwork/lnd/blob/master/docs/watchtower.md

* If you disagree about the fees with your peer, how do you negotiate them?
	
	1. One of the benefits of mutual close is that the fee rate can be negotiated down from the existing fee rate(which is generally expensive) to a more reasonable one.
	2. In order for fee rate to converge, it has to be strictly between the self last proposed and the counterparty's last proposed value. 
	3. This exchange continues using the channelID until both agree on the same fee or when one side fails the channel.
	4. Eg. assuming the peer proposes a closing fee of 3000 satoshi and our estimate shows it must be 4000. “10”: our next proposal will be 4000-10=3990.
	
	References : 
	
	* https://lightning.readthedocs.io/lightning-close.7.html
	* https://github.com/lightningnetwork/lightning-rfc/blob/master/02-peer-protocol.md#closing-negotiation-closing_signed

* What variables other than htlc_min_val and max_num_htlcs could be tweaked to make it harder or less attractive for an attacker to try and lock up a channel?

	1. Open redundant unannounced channels to your most profitable peers, not an optimal solution to the problem.
	2. Implement relaying policies to avoid filling up channels: always keep X% of your HTLC slots available, reserved for high-value HTLCs
	3. Further enabling the requirement of a lower `cltv_expiry_delta`.

	References :

	* https://github.com/t-bast/lightning-docs/blob/master/spam-prevention.md
	* https://www.coindesk.com/bitcoin-lightning-network-vulnerabilities-not-exploited-yet

* Would it be possible for channels to have a custom penalty agreement that does not take all the funds on a breach?

	1. In case of LN Penalty model, each party creates their own commitment transaction sign it and share among each other.
	2. After this if the txn state become old they share the revocation keys for it in order to maintain fairness.
	  ![image](https://user-images.githubusercontent.com/40585900/130644589-d512aab5-4542-401d-821c-3b26121d4af4.png) 
	3. In the above image its evident that bob creates the commitment txn send it to Alice, If in future she publishes this txn then bob can use the AliceR (Alice's Revocation Key) and his own pubkey to spend Alice's output.
	4. In order to have a custom penalty model instead of sharing the revocation key for the commitment we can create another txn and attach it to spend the output of other parties funds with maybe 70:30 ratio as per the scenario.
	5. But this model also gives rise to many problems, Try to think about it?
	
	References :
	
	* https://www.derpturkey.com/revocable-transactions-with-ln-penalty/
	* https://bitcoin.stackexchange.com/questions/56764/how-does-lightning-transaction-revocation-work
	* https://ocw.mit.edu/courses/media-arts-and-sciences/mas-s62-cryptocurrency-engineering-and-design-spring-2018/lecture-notes/MAS-S62S18-lec13.pdf

* When and why are ephemeral keys rotated? What would change if ephemeral keys were fully generated by the sender?

	1. Ephemeral keys are rotated during the onion creation.
	2. This is done to provide enhance security while routing through the network.
	3. If the ephemeral keys aren't rotated @ every hop then any adversary trafficking the netowrk or routing nodes will be able to correlate the onion.
	4. Which can help them to connect the dots and maybe able to identify the sender during routing.
	4. Moreover, rotation is done by introducing the blinding factor @ each hop which depends upon the shared secret generated for that hop.

	References :

	* [Christian Decker Onion -- Deep Dive](https://www.youtube.com/watch?v=D4kX0gR-H0Y)
	* [Implementation --Brian Mancini](https://github.com/bmancini55/onion/blob/main/lib/ex4/index.ts)
	* https://info.townsendsecurity.com/definitive-guide-to-encryption-key-management-fundamentals
	* https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html
	
	

