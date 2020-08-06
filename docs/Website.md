# Website

## TODO

- UseCases:

  - get-config-by-id

- Install Verification
- AB Tests

## Tracking Events

- Fingerprint
- Loaded
- Unloaded
- HTTPRequest
- UI, Navigation
- Logs

## Creating an Website

Screen 1

- name field
- Domain list field (hint: add all the domains that point to your site or web app www.example.com, example.com and example.ca)
- install button

Screen 2

- the code and ID which they will install on the Domains listed
- Website instructions (which also note that the widget wont appear on their site until it is verified and widget is added in the next step)
- a button to email the code to another person
- verify button

The user then presses the verify button, which verifies that the Website has been completed successfully on all Domains.
If an error occurs, it is shown to the user and they are prompted to get assistance or read docs.

Note about Verified Website Domains

- somewhere there should be a stored snapshot of these domains for quick access
- removeWebsite, verify, removeDomain should update this snapshot
- Handlers that use methods addWebsite, addDomain would depend on this snapshot

Website Detail Page

- displays last verified timestamp, provides ability to verify each domain again
- displays Widgets
- delete button, allows name change, add/remove domain, send Website Instructions on new domain added.

## Web Analytics

- advanced fonts tracking
- add more social accounts
- check if user is Developer
- alert when social accounts haven't been working in a long time
- partial fingerprints for recurring users
- cookie controlled fingerprinting
- send encrypted

Site Monitoring

### Read

- http://lcamtuf.coredump.cx/tangled/
- http://jcarlosnorte.com/security/2016/03/06/advanced-tor-browser-fingerprinting.html
- https://robertheaton.com/2017/11/21/cookie-syncing-how-online-trackers-talk-about-you-behind-your-back/
- https://robertheaton.com/2017/11/24/identity-graphs-how-online-trackers-follow-you-across-devices/

### Features

- Redirect based Tricks
- https://github.com/lucb1e/cookielesscookies
- Pixel Tracking
- Email Tracking
- Link Shortening / Tracking
- Physical Beacons
- Social Media Crawling
- Contract Forms
- Cookies
- Cache Tracking

## Extend FingerPrinting

- WebGL / Canvas
  - https://github.com/yuchdev/webgl-fingerprint
  - https://github.com/artem0/canvas-fingerprinting
  - https://browserleaks.com/rects#further-reading
  - https://browserleaks.com/webgl
- Game Pad
- https://github.com/mattbrailsford/imprintjs
- https://github.com/Song-Li/cross_browser
- https://github.com/Valve/fingerprintjs2
- https://github.com/jackspirou/clientjs

## Track UI Events

- Mouse
- Scroll
- Select
- Touch
- Tab Change
- Click
- Focus
- URL

## Choosing Fonts

the problem:

identify an optimal list of fonts which provides the most amount of information

for the least amount of cost (impact on user)

reinforcement learning?

https://api.fontreach.com/fonts

- each time you FingerPrint, you ask server for a list of fonts

- per font, measure coorelation to other fingerprint values

## Cache Based Tracking

for endpoint "/tracking_id.js"

include <script type="text/javascript" src="/tracking_id.js"></script> in web page

export const CacheBasedTracking = () => {

last_modified set to unix 0 time

response['Content-Type'] = 'text/javascript'

cache_control private

return `const MY_UNIQUE_TRACKING_ID = '${UUID()}';`;

};
