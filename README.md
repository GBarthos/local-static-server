local-static-server
============

Simple local http server for static file in nodeJs.

> This package purpose IS NOT to be use in production.  
> This package aims at being used in a DEVELOPMENT environment.  


### Install  
```
$ npm install local-static-server -g
```

### Usage  
```
Usage:  local-server [directory] [port] [OPTIONS]

Inputs:
        directory        The directory to serve from. (Optional)
        port             The port to start the server on. (Optional)

Options:
        -s, --silent     Keep logs at minimal
        -v, --version    Display version number
        -h, --help       Show this message

Examples:
        local-server public/src 9000
        local-server ../client
        local-server / 4000
        local-server

Author:         gbarthos <gbarthos.info@gmail.com>
License:        MIT
Version:        local-static-server@2.0.0
```

Example output:
```
$ local-server / 9000 
[2017-09-03T21:39:05.760Z][Server] server started at http://127.0.0.1:9000/ on IPv4
[2017-09-03T21:39:05.762Z][Server] ... running on pid [89776]
[2017-09-03T21:39:05.762Z][Server] ... serving folder "/Users/gbarthos/Documents/web/"
GET / 200 - - 12.527 ms
^C (SIGINT)
[2017-09-05T20:41:10.732Z][Server] ... graceful shutdown signaled
[2017-09-05T20:41:10.733Z][Server] server closed
```

When the given port number is already in use on local IPV4 address, server walks other ports by incrementing the number until a free port is found.

That's all folks!