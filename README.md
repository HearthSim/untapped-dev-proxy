# untapped-dev-proxy

## Install

```
$ git clone git@github.com:HearthSim/untapped-dev-proxy.git
$ cd untapped-dev-proxy
$ yarn install
```

## Usage

### Anonymous:
```
$ yarn proxy --service mtga -p 8080
```

### Authenticated with session cookie:
```
$ yarn proxy abc123abc123abc123 --service mtga -p 8080
```

### Authenticated with session cookie and CSRF-Token
This is only necessary for POST requests, which will usually not be the case.
```
$ yarn proxy abc123abc123abc123 --service mtga -p 8080 --csrf def456def456def456def456
```

### Where to find the session cookie and CSRF-Token
1. Go to the production website for the respecive service (e.g. `mtga.untapped.gg`) and log in if you are not
2. Open the devtools (F12) and go do `Application > Storage > Cookies` (Chrome) or `Storage > Cookies` (Firefox)
3. You will find a `sessionid` and a `csrftoken` cookie here


## Troubleshooting

### The Proxy is running with a session cookie but I am logged out
Your session cookie most likely expired. Go to the production website and grab a new one.

### POST requests are failing
1. Make sure you are setting the `--csrf` token, see `Usage` above.
2. If you see failing `OPTIONS` requests in the network logs this probably means that the `policy.json` file in the *-api-server  probject is missing the `OPTIONS` entry.
