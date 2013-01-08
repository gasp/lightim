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

ping : Knock knock, is anyone home ?
----------
`/ping`

It should return something like this
```
HTTP/1.1 200 OK
Content-Type: text/plain
Connection: close
Transfer-Encoding: Identity

{"v":0.7,"ping":"pong"}
```

Please do not use the v, in a future stable version it may simply return
```
{"ping":"pong"}
```

create : Create an account
----------
`/create/username/superpassword`
return is
`{"v":0.7,"token":"d45f7"}`

if the user exists, it returns a `404` error page (will change, see issue 3)

create : Get a connexion token
----------
`/login/username/superpassword`
return is
`{"v":0.7,"token":"d45f7"}`


tell : Tell someone something
----------
`/tell/username/token/destusername/Hi%2C%20how%20are%20you%20doing%20%3F`
return is
`{"v":0.7,"tell":{"from":"gaspard","message":"Hi%2C%20how%20are%20you%20doing%20%3F","dt":"2012-09-10 17:23:31"}}`

To transform the string "Salut! t'aimes les caractères accentués ?" into "Salut!%20t'aimes%20les%20caract%C3%A8res%20accentu%C3%A9s%20%3F", use `encodeURIComponent(text)`

inbox : Check your messages
----------
`/inbox/username/token`
return is 
`{"v":0.7,"inbox":[]}`
or
`{"v":0.7,"inbox":[{"from":"gasp","message":"Hello%20!","dt":"2012-09-10 17:23:31"},{"from":"gasp","message":"Hi%2C%20how%20are%20you%20doing%20%3F","dt":"2012-09-10 17:24:04"}]}`

If username/token mismatch, it returns a #404 error (this may change to #403 in future versions), another apllication might have succesfully logged in.

To transform the string "Salut!%20t'aimes%20les%20caract%C3%A8res%20accentu%C3%A9s%20%3F" into "Salut! t'aimes les caractères accentués ?", use `encodeURIComponent(text)`


about : Get some information about a user
----------
`/about/lionel`
return is
`{"v":0.7,"about":{"lastseen":"2012-09-10 18:14:27"}}` ("lastseen" may be standardized in the future by a "dt")
