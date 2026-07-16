---
title: "IPv4, IPv6, and why the old one won't die"
date: "2026-07-16"
tags: [networking, infra]
summary: "IPv4 ran out of addresses years ago, yet most of the internet still runs on it. Who hoarded the addresses, and how the cloud keeps handing them out."
---

IPv4 has room for about 4.3 billion addresses (32 bits). That sounded infinite in 1981 and ran out in practice around 2011, when the central pool handed its last blocks to the regional registries. IPv6 fixes the math with 128 bits, which is more addresses than anyone will use before the sun burns out. So why is IPv4 still everywhere?

## Why IPv4 won't die

- **It works, and rewrites are expensive.** Every router, firewall, script, and hardcoded config that assumes a v4 address is something a human has to touch to move off it.
- **NAT bought it decades.** One public address can sit in front of thousands of private ones (that is what [the public-vs-private note](/notes/public-vs-private-ip) gets into). NAT quietly removed the urgency to migrate.
- **v6 is all-or-nothing-ish.** During the transition you run both stacks at once (dual-stack), which is more surface area, not less, so people delay.
- **Not everything speaks it.** Plenty of ISPs, old gear, and services are still v4-only, so you cannot fully drop v4 even when you want to.

## Who owns how many

The addresses were handed out early and generously. A handful of organizations each hold an entire `/8` block, which is about 16.7 million addresses: the US Department of Defense (several), MIT, Ford, HP (through DEC and Compaq), and Apple, among others. Universities and early internet players got blocks in the 80s that would be worth a fortune today.

"Worth a fortune" is literal now. With the free pools empty, IPv4 addresses trade on a transfer market for roughly $30 to $50 each, so a single `/24` (256 addresses) is a five-figure asset.

## How the cloud still hands them out

- **They own and buy huge blocks**, from historical allocations plus steady purchasing on the transfer market.
- **They share aggressively.** Load balancers, carrier-grade NAT, and per-service proxies let many customers sit behind far fewer public addresses.
- **They started charging.** AWS began billing for every public IPv4 in 2024, which is both a scarcity signal and a nudge toward IPv6.

The long-term answer is still IPv6. The short-term answer is that IPv4 became a managed, priced, traded resource instead of a free one, and that is enough to keep it limping along.
