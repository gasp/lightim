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
HTTP/1.1 200 OK
Content-Type: text/plain
Connection: close
Transfer-Encoding: Identity

{"v":0.4,"ping":"pong"}
```

Please do not use the v, in a future stable version it may simply return
```
{"ping":"pong"}
```

Create an account
----------
`/create/username/superpassword`
return is
`{"v":0.4,"token":"d45f7"}`

if the user exists, it returns a `404` error page (will change, see issue 3)

Check your messages
----------
`/inbox/username/superpassword`
return is 
`{"v":0.4,"inbox":[]}`
or
`{"v":0.4,"inbox":[{"from":"gasp","message":"Hello%20!","dt":"2012-09-10T17:23:31"},{"from":"gasp","message":"how%20are%20you%20doing%20?","dt":"2012-09-10T17:24:04"}]}`

Tell someone something
----------
`/tell/username/superpassword/someusername/how%20are%20you%20doing%20?`
return is
`{"v":0.4,"tell":{"from":"gaspard","message":"how%20are%20you%20doing%20?","dt":"2012-09-10T17:23:31"}}`


About Someone
----------
`/about/lionel`
return is
`{"v":0.4,"about":{"lastseen":"2012-09-10T18:14:27"}}` ("lastseen" may be standardized in the future by a "dt")
