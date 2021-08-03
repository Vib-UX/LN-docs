# Onion Routing

## Overview 
* Onion routing is an infrastructure for private communication over a public network. It provides anonymous connections that are strongly resistant to both eavesdropping and traffic analysis.
* Onion routing's anonymous connections are bidirectional, near real-time, and can be used anywhere a socket connection can be used. 
* Any identifying information must be in the data stream carried over an anonymous connection. An onion is a data structure that is treated as the destination address by onion routers; thus, it is used to establish an anonymous connection. <br>
Onions themselves appear different to each onion router as well as to network observers. 
* Similarly data carried over the connections they establish. Proxy-aware applications, such as Web browsers and e-mail clients, require no modification to use onion routing, and do so through a series of proxies.<br>
<img src = "https://www.massmux.com/wp-content/uploads/2020/06/tor_explain_2-1024x536.png" width="750" height="500"><br>
* In onion routing, each layer serves as encapsulation, revealing information when the layer is extracted.<br>
The first onion router encrypts the message and sends it to the next router in the configured path. The receiving onion router decrypts the message using its private key, reveals the next destination onion router, encrypts it again and sends it to the next onion router.

## IP Routing VS Onion Routing (Lightning Network - Pathfinding)
<a href="https://ibb.co/gyHSsff"><img src="https://i.ibb.co/7v8n7ZZ/Ip-vs-Onion.png" alt="Ip-vs-Onion" border="0"></a><br /><a target='_blank' href='https://imgbb.com/'></a><br />
The above findings are very useful in understanding, how onion routing works in LN? Lets discuss each of them :<br>
<ol type="I">
  <li><code>Type</code><br> The type for IP routing is <i>Best effort</i>. First IP routers checks where the packet needs to be sent, It will then forward your request along the path required to reach your
  destination. Similarly from there cycle repeats untill you reach your destination.<br>
  But on the other hand in case of Onion routing defined <code>type</code> is <i>Source Based</i> which means prior to sending the package you need to define the path from sender to receiver.  
  </li>
  <li><code>Data format</code> <br> In case of IP routing everyone along the path is able to read the data format from starting pt. to ending pt.<br>While working with Onion routing you have 
  encrypted headers, not all data is visible to the intermediary nodes only small amnt of info is given just enough to make a hop from their node to the next receiving node.</li> 
  <li><code>Sender/Recipient</code><br> In case of IP routing sender and receiver are known to all routing nodes thus they can help you reach your destination in the network.<br> On the other hand
  in case of Onion routing the nodes are kept hidden because of encryption.</li>
  <li><code>Edgeweights</code><br>In case of IP routing we consider <i>bandwidth</i> to be the edgeweights as its mostly static. Eg. when you receive a packet there maybe a multiple forwarding paths but you tend to choose the
  path which will have higher bandwidth thus reaching the destination faster. <br>On the other hand Onion routing for LN is highly dynamic (fees,balance) while finding the path you can choose
  a path with low fees but you also need to make sure that path you have choosen has enough liquidity on your side to actually forward the HTLCs. Everytime this happens network topology changes and its hard 
  to fix the balance.</li>
  <li><code>DoS Attacks</code><br>In case of IP routing since everything is open we can have spoofing attacks claiming that these IP packages are coming from this sender then nodes will reply to this package. Although we have ISP's around which helps to mitigate this problem.
  <br>On the other hand in case of Onion routing this problem is hard to mitigate.In case of LN each channel has limit of 483 HTLCs which they can handle concurrently so a malicious node can send the lots of HTLCs request with less payload thus flooding your channel.</li>
  <li><code>Pathfinding</code><br>In IP routing it becomes easier to find path because of the huge distributed network topology and collaborative nature of nodes, thus making it highly efficient.<br>
  On the other hand same is not the case with Onion routing w.r.t LN this is becasue of its encrypted nature and privacy at utmost priority either sender needs to define path or it needs to take help of <i>Trampoline Nodes</i>(3rd Party).</li>
</ol>

References :
* My personal favourite [Onion Routing by René Pickhardt](https://www.youtube.com/watch?v=toarjBSPFqI)
* [Onion Routing wiki docs](https://en.wikipedia.org/wiki/Onion_routing)
* [Onion Router CSE Blog](https://www.sciencedirect.com/topics/computer-science/onion-router)
* [Lightning Network - Onion routing by Christian Decker](https://www.youtube.com/watch?v=D4kX0gR-H0Y)
* [Trampoline Docs](https://github.com/lightningnetwork/lightning-rfc/blob/trampoline-routing-no-gossip/proposals/trampoline.md)


