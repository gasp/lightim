lightim
=======

the tinyest and lightest instant messaging server software written in nodejs

run it !
=======

```
$ node app.js
```

use it !
=======

ping
----------
`/ping`

It should return something like this
```
{"v":0.2,"ping":"pong"}
```

Please do not use the v, in a future stable version it may simply return
```
{"ping":"pong"}
```


Create an account
----------
`/create/username/superpassword`

Check your messages
----------
`/inbox/username/superpassword`
