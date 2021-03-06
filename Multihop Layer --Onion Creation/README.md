# Lightning Network Payment Routing : 
### Today we will discuss how actually 🤷‍♂️ we route payments in Lightning Network with the glimpse of all the aspects 🧙 required to route the payment.<br> 
![](https://steemitimages.com/640x0/https://cdn.steemitimages.com/DQmexE6Ln7PX2R4c4YxW3jYBqerQ1c3nX92e32HHLAWmXJh/screenshot%20(22).png) 

Before that we need to understand the hierarchy of the LN model, we will be dealing with **Multihop Layer** as it's responsible for *Source Based Routing*, further to better understand this layer I would highly recommend you to look how [HTLCs](https://medium.com/softblocks/lightning-network-in-depth-part-2-htlc-and-payment-routing-db46aea445a8) work in *transfer layer*? which will ease things up for you in further understanding the docs. ![image](https://user-images.githubusercontent.com/40585900/129501973-abf93cac-2813-40f6-8019-1af9adebfa25.png) 

## Brief Overview of Multihop Layer :

The multihop layer is right at the top and it has a few objectives. The first is to route payments through the network and to do so in a way that maintains privacy. This is one of the big trade-offs in the Lightning Network. We suffer a lot on the routing side of things because we need to have good privacy. We achieve this through a construction called Sphinx Onion Routing.

So first of all we use source based routing which means that if A is sending to E, A needs to calculate a route all the way through the network to the final node. We also do so in an onion encrypted way which means A will calculate ephemeral keys with each of the nodes along the path and create an onion which they will pass on to the next node and they can unwrap this onion using their secret. Now this node knows that it came from A and they know that it’s going to C because they’ve unwrapped the onion but they don’t know anything else about the paths. They don’t know that A is the sender; they could just be another link along the chain. They send that onion on and the same is true for every single hub along the route. They know where it comes from and they know where it goes to but they do not know where it is coming from long term or going to long term.

Another construction we use is something called Sphinx which obfuscates the length and position within a route. This is really important because you can kind of try and figure out the length of, in the Lightning Network we are limited to 20 hubs, so you can figure out where payment maybe going or coming from if you can figure out where you are in that route.

## Source Based Onion Routing - Sphinx Mix format 

  * The main idea of using Sphinx routing is to maintain the privacy, the sender doesn't want to reveal its identity and the payee's while routing payments.
  * The nodes responsible for routing should acknowledge back if there is an error while routing.
  * One more thing to keep in my mind that while routing, routing nodes need to be able to authenticate the onion, it shouldn't be like an obsolete onion with some random parameters.
  *  That can be achieved using HMAC @ every hop.
 
Onion Creation :  
  * Header
     * Version Byte
     * 33 Byte compressed secp256k1 pubkey
        * Not the sender Pubkey (node_id / static key) as it would reveal it's original identity in the network
        * But an ephemeral pubkey that is only used to route this onion.
  * Payload
    * 1300 Hops_data
    * 20 x 65 Bytes
       * 32 per_hop
         * 8: short_channel_id
         * 8: amt_to_forward
         * 4: outgoing_cltv_value
         * 12: padding (for backwards compatibility)
       * 32: HMAC   // This HMAC is used to verify the integrity of per_hop data
       * … filler
  * HMAC 
    * 32 Byte // This HMAC is used for the entire onion integrity

Eg. :

![image](https://user-images.githubusercontent.com/40585900/129837446-d68be52d-fef2-4f11-b017-719366491f33.png)<br>
As we know Onion is created in reverse direction, we start with David, the payload data for David is shown in the above image,
  * here `SID:0` means that this the last hop there is no forwarding of onion after that.  
  * Now this onion is encrypted with the shared secret b/w Alice and David only for this hop.

Similarly we create an onion for Charlie 
![image](https://user-images.githubusercontent.com/40585900/129840487-02572afe-9b0f-4437-883a-9d362f8dac90.png)<br>

Here Charlie Payload fields suggests that Charlie is intended to 
* **forward the amnt : 300** to **SID : 452** 
* After that there is an encrypted onion with Ek_D which charlie wont be able to decrypt as its not intended for her to see. 
* Now this whole onion gets encrypted using the shared secret b/w Alice and Charlie.

Therefore it looks something like this : 
![image](https://user-images.githubusercontent.com/40585900/129841575-cb06b0a3-d5d0-4ccf-921a-f9992a577d85.png)<br>

Payload for Bob suggests that 
* He should **forward the amnt : 301** to **SID : 74** 
* Here amnt_forward is > then the amnt_forward in case of *Charlie* 
* This difference act as the fee for *Charlie* to forward the onion.
* Further Bob wont be able to decrypt the rest of the onion as shared secret b/w Alice and Charlie is not the same for Bob.

References : 

 * https://residency.chaincode.com/presentations/lightning/Multihop_Layer.pdf
 * https://www.youtube.com/watch?v=yKdK-7AtAMQ
 * https://www.youtube.com/watch?v=P7I-C0_sijg
 * https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6961907/
 * https://docs.lightning.engineering/the-lightning-network/multihop-payments



