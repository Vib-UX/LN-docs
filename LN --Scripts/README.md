# LN Scripts

While working on [Wire Protocol](https://github.com/lnbook/lnbook/blob/develop/appendix_wire_protocol.asciidoc), I found bitcoin scripts compatability with LN is quiet interesting. Its highly recommended to work with [SegWit Txn](https://www.investopedia.com/terms/s/segwit-segregated-witness.asp) in LN to avoid transaction malleability. In case of [`closing_signed`](https://github.com/lightningnetwork/lightning-rfc/blob/master/02-peer-protocol.md#closing-negotiation-closing_signed) and during [`open_channel`](https://github.com/lightningnetwork/lightning-rfc/blob/master/02-peer-protocol.md#the-open_channel-message) messages the `scriptPubKey` has stricter requirements that must be a valid P2WPKH, P2WSH, P2SH-P2WPKH, P2SH-P2WSH, or any valid witness script if `option_shutdown_anysegwit` is negotiated.

## Brief Overview of SegWit Txn :

The transaction data that is shared across the multiple nodes consists of two components—inputs and outputs. There could be one or multiple inputs and outputs involved in a transaction. The output is the public address of the recipient. The input is the public address of the sender. The sender needs the recipient’s public address in order to send funds to them. The majority of space in a transaction consists of a signature, a part of the input, which verifies that the sender has the required funds to make a payment. So in effect, a bitcoin moves from inputs to outputs for each transaction transmitted. Once each of the nodes has verified the transaction as valid, the transaction is included in a block that is added to the chain or the general ledger for public access.

If we could change the system so the txid didn’t cover the signature script, we’d remove all known possibilities of unintentional transaction malleability. Unfortunately, if we did this, we’d make old software incompatible because it calculates the txid in the traditional way.

Segwit solves this problem and all the aforementioned problems in a forward- and backward-compatible way:

* Forward-compatible because blocks created by new software work with old software

* Backward-compatible because blocks created by old software work with new software

In crypto-lingo, a witness basically means a signature. It’s something that attests to the authenticity of something. For a Bitcoin transaction, the witness is the contents of the signature scripts, because that’s what proves the transaction is authenticated. Segregated means parted, so we part the contents of the signature scripts from the transaction, effectively leaving the signature scripts empty.

![](https://drek4537l1klr.cloudfront.net/rosenbaum/Figures/10fig15_alt.jpg)<br>
*Referenced from Grokking Bitcoin*

## P2WPKH, P2WSH, P2SH-P2WPKH, P2SH-P2WSH

1. P2WPKH : 
    * This stands for *Pay To Witness Public Key Hash* and the scriptPubkey is OP_0 0x14 {20-byte-hash}, where OP_0 is the version, byte 0x14 is the size of the data, and the {20-     byte-hash} is a HASH160(PubKey). 
    * ScriptPubKey: `0 <20-byte-PublicKeyHash>`<br>
    ScriptSig: (empty)<br>
    Witness: `<Signature> <PublicKey>`<br>

    In P2WPKH the verification goes as follows:<br>
      * Check that the witness contains exactly two items
      * Verify that HASH160 of the witness' public key is equal to the one present in the witness program
      * Verify the signature as <Signature> <PublicKey> OP_CHECKSIG
    The length of the witness program (20 bytes) indicates that it is a P2WPKH type. Again, this is an arbitrary definition, hardcoded into the standard. There is no OP_CHECKSIG     operand in neither scriptPubKey nor witness, it is implicit by the definition of P2WPKH.
    * For the P2WPKH address: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4" OP_0 , 0x14 , HASH160(PubKey) -- looks like (in hex):<br>
    00 14 751e76e8199196d454941c45d1b3a323f1433bd6

2. P2WSH : <br> 
    * This stands for *Pay To Witness Script Hash* and the scriptPubkey is OP_0 0x20 {32-byte-hash}, where OP_0 is the version, byte 0x20 is the size of the data, and the {32-         byte-hash} is a SHA256(script).
    * ScriptPubKey: 0 <32-byte-redeemScriptHash><br>
      ScriptSig: (empty)<br>
      Witness: `<witness items> <redeemScript>`<br>
      RedeemScript: (any)<br>

      The first 0 indicates a witness version 0. The following 32 bytes indicates that this is a P2WSH type. The last item in the witness is the redeemScript. It is hashed with       SHA256, compared against the 32-byte redeemScriptHash in the scriptPubKey, and then executed alongside with the witness items.
    * For the P2WSH address: "bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3" OP_0 , 0x20 , SHA256(script) -- looks like (in hex): <br>
      00 20 1863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262
  
3. P2WPKH nested in P2SH : 
      * ScriptPubKey: `OP_HASH160 <20-byte-redeemScriptHash> OP_EQUAL` <br>
      ScriptSig: `<0 <20-byte-PublicKeyHash>>` <br>
      Witness: `<Signature> <PublicKey>` <br>
      RedeemScript: `0 <20-byte-PublicKeyHash>` <br>

      * The P2SH redeem script is equal to 0 <20-byte-PublicKeyHash> which is exactly the same as P2WPKH scriptPubKey. The scriptSig is somewhat confusing, it is a canonical push       of data, which contain another canonical push of data.

      * Let's have a look how this evalutes on older nodes. They see the scriptSig as a push of some data – 0014{20-byte-PublicKeyHash}. Older nodes consider it as a simple             redeemScript, which contains only a push of some data, weird redeemScript right? Then the scriptPubKey is concatenated and it does a HASH160 of the redeemScript and             compares the result against the redeemScriptHash. Hurray, they match! So older nodes see this as a wierd P2SH ANYONE_CAN_SPEND transaction with no signature, where two            hashes are compared and that's it.

      As far as the upgraded nodes are concerned, they see this as as a P2SH transaction as well, but they recognize the meaning of the pushed data (0014{20-byte-PublicKeyHash}) and they interpret it as a P2WPKH.
  
4. P2WSH nested in P2SH :
      * This is quite similar to P2WPKH in P2SH. It just doesn't nest a P2WPKH but a P2WSH.

      * ScriptPubKey: `OP_HASH160 <20-byte-P2SH-RedeemScriptHash> OP_EQUAL` <br>
          ScriptSig: `<0 <32-byte-P2WSH-RedeemScriptHash>>`<br>
          Witness: `<witness items> <P2WSH-RedeemScript>`<br>

      * P2SH RedeemScript: `<0 <32-byte-P2WSH-RedeemScriptHash>>`<br>
      P2WSH RedeemScript: (any) <br>

    The redeem script can be any valid Script, the very same concept as in P2SH.
  

References :
  * https://bitcoin.stackexchange.com/questions/95231/redeem-script-script-hash-witness-script-and-witness-program
  * https://learnmeabitcoin.com/technical/p2pkh
  * https://academy.binance.com/en/articles/an-introduction-to-bitcoin-script
  * https://www.oreilly.com/library/view/mastering-bitcoin/9781491902639/ch05.html
  * https://developer.bitcoin.org/devguide/transactions.html

 
      
  
