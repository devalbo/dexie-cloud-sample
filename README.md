# cloud-optional-starter

I created this repo to better understand local-first dev and cloud syncing with different engines using a React frontend. Since I am mostly interested in multiplayer scenarios (and they're complex code samples to reproduce), I'm setting up these examples to help with reproducibility. Maybe it'll be helpful to others.

I'm really trying to figure out how to get multiplayer security for the best value. Engines I've been messing with along with some notes for my future reference...


### [Dexie / Dexie Cloud](https://dexie.org/cloud/)
I like the concept of the Dexie Cloud plan - reasonable price with a decent security model at the web application layer. It's the most multiplayer plug and play I've come across that doesn't require any server maintenance and Big Tech.

#### Configuring for your own Dexie Cloud instance
Update the [Dexie Cloud Config](./src/data/sync-engines/dexie-cloud/dexie-config.ts) file with your own DB instance URL.

#### Hard-coded demo users on your own Dexie Cloud DB
I added some hard-coded demo users so you can try logging in as them. Per [https://dexie.org/cloud/docs/add-demo-users](this link) run this command: `npx dexie-cloud import demo-users.json`



### [Tinybase / Cloudflare Durable Objects](https://tinybase.org/guides/integrations/cloudflare-durable-objects/)

This demo uses the Tinybase demo shared Durable Object instance, courtesy of James Pearce. It's treated me well so far. You can also spin up your own and configure your security.

All data is public and common to all users - security through ID obscurity is your only defense.
