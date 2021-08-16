# Lightning Network Payment Routing : 
### Today we will discuss how actually 🤷‍♂️ we route payments in Lightning Network with the glimpse of all the aspects 🧙 required to route the payment.<br> 
![](https://steemitimages.com/640x0/https://cdn.steemitimages.com/DQmexE6Ln7PX2R4c4YxW3jYBqerQ1c3nX92e32HHLAWmXJh/screenshot%20(22).png) 

Before that we need to understand the hierarchy of the LN model, we will be dealing with **Multihop Layer** as it's responsible for *Source Based Routing*, further to better understand this layer I would highly recommend you to look how [HTLCs](https://medium.com/softblocks/lightning-network-in-depth-part-2-htlc-and-payment-routing-db46aea445a8) work in *transfer layer*? which will ease things up for you in further understanding the docs. ![image](https://user-images.githubusercontent.com/40585900/129501973-abf93cac-2813-40f6-8019-1af9adebfa25.png) 

## Brief Overview of Multihop Layer :

The multihop layer is right at the top and it has a few objectives. The first is to route payments through the network and to do so in a way that maintains privacy. This is one of the big trade-offs in the Lightning Network. We suffer a lot on the routing side of things because we need to have good privacy. We achieve this through a construction called Sphinx Onion Routing.

So first of all we use source based routing which means that if A is sending to E, A needs to calculate a route all the way through the network to the final node. We also do so in an onion encrypted way which means A will calculate ephemeral keys with each of the nodes along the path and create an onion which they will pass on to the next node and they can unwrap this onion using their secret. Now this node knows that it came from A and they know that it’s going to C because they’ve unwrapped the onion but they don’t know anything else about the paths. They don’t know that A is the sender; they could just be another link along the chain. They send that onion on and the same is true for every single hub along the route. They know where it comes from and they know where it goes to but they do not know where it is coming from long term or going to long term.

Another construction we use is something called Sphinx which obfuscates the length and position within a route. This is really important because you can kind of try and figure out the length of, in the Lightning Network we are limited to 20 hubs, so you can figure out where payment maybe going or coming from if you can figure out where you are in that route.

## Source Based Onion Routing - Sphinx Mix format 

  * The main idea of using Sphinx routing is to maintain the privacy the sender doesn't want to reveal its identity while routing payments.
  * Git test


