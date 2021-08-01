# LN - ELTOO

Although curretly we are actively trying to implement LN-penalty model for lightning network but eltoo holds some features that is more friendly and safe for the LN users. Today we are going to discuss how [@Christian Decker](https://twitter.com/snyke?lang=en) and LN team maintain the consistent flow for Eltoo. But before that lets have some basic understanding related to Eltoo and LN-Penalty or why Eltoo is required?
<br>

## Introduction

If you are a newbie :bow: and doesn't understand how things work in lightning world :question: I would recommend you to give a few mins read on [Lightning Guide](https://bitcoiner.guide/lightning/). It will help you understand why Lightning is required? and broader overview of LN. 

* **Unidirectional Channels** : <br> These are pretty straight forward. Suppose Alice wants to start a channel with Bob , She will open a LN channel with Bob and will create a `funding transaction` which ensures locking of a certain amount from Alice's side that she is willing to pay Bob in future transactions. This funding transaction will be published on bitcoin network which then can be spent by 2 of 2 multisig consisting of Alice and Bob's keys. In every iteration Alice will create a new 2 of 2 multisig output to Bob deducting her balance and updating Bob's balance sign it and send it to Bob (partially signed). Now its upto Bob he can publish the most recent/ profitable transaction in the end and publish it on bitcoin network. <br>
![LN-Unidriectional](https://image.slidesharecdn.com/bitcoinlightningnetworkandethereumprotocols-190909094720/95/bitcoin-lightning-network-and-ethereum-protocols-11-638.jpg?cb=1568023728)
* **Bidirectional Channels** : <br> It becomes more challenging now to maintain the fair play and consistency in the system as money is flowing both ways. Which arises the problem that either of the two node can behave maliciously by trying to spent the most profitable txn to the bitcoin network instead of the most recent one. Which could lead to a double spend from the `funding transaction`.<br>
![LN Bidirectional](https://image.slidesharecdn.com/lightning-170201212257/95/lightning-network-8-638.jpg?cb=1485984218)

In order to solve the 🔄 Bidirectional Channel problems there could be various soln's 💡 we can have *Time-based bi-directional payment channels* or *Punishment based bi-directional payment channels*. Today we will talking about how Eltoo solves this problem more optimally. You can read about [Time-based bi-directional payment channels](https://blog.chainside.net/understanding-payment-channels-4ab018be79d4#:~:text=before%20that%20date.-,Time-based%20bi-directional%20payment%20channels,-While%20in%20a) and [LN Penalty](https://blog.chainside.net/understanding-payment-channels-4ab018be79d4#:~:text=Punishment-based%20payment%20channels).

Eltoo is a proposed upgrade to Bitcoin whose main goal is to improve layer two solutions, most importantly, the Lightning Network.
<br>
* Eltoo would implement these upgrades by introducing a new sighash flag called `SIGHASH_NOINPUT` to the Bitcoin protocol. The new sighash flag would allow a Bitcoin signature to commit to a transaction without specifying the txid of the input.
* Leaving the txid unspecified enables greater flexibility for transactions. It means descendant transactions can be signed before their ancestors are published to the blockchain.
* For example, if Alice and Bob open a Lightning channel, they first sign a funding transaction, which sends bitcoin to a 2-of-2 multisig address. Once the channel is open, Alice and Bob make a series of update transactions, which spend the funds in the 2-of-2 multisig address. When Alice and Bob wish to close the channel, they must sign a settlement transaction to do so.
* Without eltoo, each transaction in this process can only be signed once the previous one has been created. With eltoo, the settlement transaction can be signed at the same time as the funding transaction. This eliminates the need for the Lightning Network penalty, significantly simplifying the Lightning Network’s double spend protection.

![Eltoo](https://bitcoinexchangeguide.com/wp-content/uploads/2018/05/eltoo-blockstream-lightning-network.jpg)<br>
Moreover for Eltoo to be be succesfully implemented we need to change the consensus protocol by introducing `SIGHASH_NOINPUT` which indeed would require a [soft-fork](https://www.investopedia.com/terms/s/soft-fork.asp) in the bitcoin network. 


References : <br>
* I would highly recommend you to go through its [whitepaper](https://blockstream.com/eltoo.pdf).
* https://blockstream.com/2018/04/30/en-eltoo-next-lightning/
* https://www.bitcoinlightning.com/eltoo-protocol/
* https://bitcoinik.com/eltoo-bitcoins-lightning-network-protocol/
* https://blog.keys.casa/bitcoin-101-eltoo/

Not much of a documentation geek dont worry checkout the video tutorials :

* [Dual-Funded Channels](https://www.youtube.com/watch?v=i_GxmNZjwhk)
* [Eltoo- Christian Decker](https://www.youtube.com/watch?v=3ZjymCOmn_A)
* [Payment Channels and LN](https://www.youtube.com/watch?v=Hzv9WuqIzA0&t=2671s)
* [LN Software - Carla Kirk-Cohen](https://www.youtube.com/watch?v=KI-VY6-xJ3Q&t=168s)



