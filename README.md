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

{"v":0.5,"ping":"pong"}
```

Please do not use the v, in a future stable version it may simply return
```
{"ping":"pong"}
```

create : Create an account
----------
`/create/username/superpassword`
return is
`{"v":0.5,"token":"d45f7"}`

if the user exists, it returns a `404` error page (will change, see issue 3)

create : Get a connexion token
----------
`/login/username/superpassword`
return is
`{"v":0.5,"token":"d45f7"}`


inbox : Check your messages
----------
`/inbox/username/token`
return is 
`{"v":0.5,"inbox":[]}`
or
`{"v":0.5,"inbox":[{"from":"gasp","message":"Hello%20!","dt":"2012-09-10 17:23:31"},{"from":"gasp","message":"how%20are%20you%20doing%20?","dt":"2012-09-10 17:24:04"}]}`

If username/token mismatch, it returns a #404 error (this may change to #403 in future versions), another apllication might have succesfully logged in.


tell : Tell someone something
----------
`/tell/username/token/someusername/how%20are%20you%20doing%20?`
return is
`{"v":0.5,"tell":{"from":"gaspard","message":"how%20are%20you%20doing%20?","dt":"2012-09-10 17:23:31"}}`


about : Get some information about a user
----------
`/about/lionel`
return is
`{"v":0.5,"about":{"lastseen":"2012-09-10 18:14:27"}}` ("lastseen" may be standardized in the future by a "dt")
