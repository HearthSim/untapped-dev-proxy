# untapped-dev-proxy

## Install

```
$ git clone git@github.com:HearthSim/untapped-dev-proxy.git
$ cd untapped-dev-proxy
$ yarn install
```

## Usage

Anonymous:
```
$ yarn proxy --service mtga -p 8080
```

Authenticated with session cookie:
```
$ yarn proxy abc123abc123abc123 --service mtga -p 8080
```
