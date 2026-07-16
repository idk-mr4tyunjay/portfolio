---
title: "Public IP, private IP, and the router in between"
date: "2026-07-16"
tags: [networking, infra]
summary: "Your devices share one public address through NAT, which is why 'what's my IP' reads the same everywhere and why nobody can reach your laptop directly."
---

Your laptop, your phone, and your smart bulb all have IP addresses, and none of them are the address the internet replies to. That gap between what a device holds and what the world sees is the whole story, and NAT stitches it together.

## Private ranges stay home

RFC 1918 carved out three blocks that any network can use internally and that no router on the public internet will forward:

- `10.0.0.0/8`
- `172.16.0.0/12`
- `192.168.0.0/16`

Your router hands these out over DHCP, so your laptop ends up as something like `192.168.1.14`. Every home network reuses the same ranges, which is fine because they never leave. Send a packet to a `192.168.x.x` address across the internet and it gets dropped at the first serious router. Those addresses are not routable, on purpose.

A public IP is the opposite: globally unique, assigned to your router by your ISP, reachable from anywhere ([its own scarcity story](/notes/ipv4-vs-ipv6)). There is one per connection, and it is what "what's my IP" reports. Every device on the network returns the same answer, because they all speak through that one address, even though each still holds its own private LAN address inside.

## NAT does the translation

Network Address Translation lets many private devices share one public address. When your laptop opens a connection, the router rewrites the packet: the private source becomes its own public address, it picks a port, and it writes a table row saying replies here go back to `192.168.1.14`. The reply comes in, the router checks the table, and forwards it accordingly. Thousands of connections, one public IP, one bookkeeping table.

That is also why an outside machine cannot just reach your laptop. There is no table entry until your laptop starts the conversation, so unsolicited inbound traffic has nowhere to land.

## Getting in from outside

To host something, a game server or an SSH box, you add a static rule: forward inbound traffic on a given port to one private address. That is port forwarding, a NAT row you write by hand.

Sometimes it still does not work, and CGNAT is usually why. Many ISPs put you behind carrier-grade NAT, a second layer of translation on their side, so your router's "public" address is itself private. You do not control that router, so your forward has nowhere to point. The fix is asking the ISP for a real public IP, or tunneling out through a service that already has one.
