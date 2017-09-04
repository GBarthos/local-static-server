local-static-server
============

Simple local http server for static file in nodeJs.

### Install
```
$ npm install local-static-server -g
```

### Usage

```
$ local-server [directory] [port] [OPTIONS]
```
for more detailed explanations:
```
$ local-server --help
```

Arguments:
* `directory`: [`string`] root folder, default to working directory
* `port`: [`number`] port number, default to 3000

Examples:
```
$ local-server / 9000 
[2017-09-03T21:39:05.760Z][Server] server started at http://127.0.0.1:9000/ on IPv4
[2017-09-03T21:39:05.762Z][Server] ... running on pid [89776]
[2017-09-03T21:39:05.762Z][Server] ... serving folder "/Users/gbarthos/Documents/web/"
```

When the given port number is already in use on local IPV4 address, server walks other ports by incrementing given port number until a free port is found.

That's all folks!