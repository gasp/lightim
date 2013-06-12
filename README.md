lightim
=======

the tinyest and lightest instant messaging server software written in nodejs.

clients
=======

* [limc](https://github.com/gasp/limc) for mobile platforms
* [jquery-mobile-lightim](https://github.com/Krewh/jquery-mobile-lightim) same thing, some extra functionnalities
* [iChatte](https://github.com/EchoPhp/iChattes) this version has a funny icon
* [lightiim](https://github.com/warai/lightiim) a desktop version based on  [twitter bootstrap](https://github.com/twitter/bootstrap)



test it
=======
on http://lightim.aws.af.cm/

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

{"v":0.8,"ping":"pong"}
```

Please do not use the v, in a future stable version it may simply return
```
{"ping":"pong"}
```

create : Create an account
----------
howto: `/create/user/pass`  
sample: `/create/alice/superpassword` Alice creates an account

return is `{"v":0.8,"token":"d45f7"}`

if the user exists, it returns a `404` error page (will change, see issue 3)

login : Get a connexion token
----------
howto: `/login/user/pass`  
sample: `/login/alice/superpassword` Alice uses her "superpassword" to login 


return is `{"v":0.8,"token":"d45f7"}`


tell : Tell someone something
----------
howto: `/tell/user/token/dest/message`  
sample: `/tell/alice/12345/bob/Hi%2C%20how%20are%20you%20doing%20%3F` Alice says "Hi" to Bob

return is the datetime when the server got the message `{"v":0.8,"dt":"2012-09-10 17:23:31"}`


To transform the string "Salut! t'aimes les caractères accentués ?" into "Salut!%20t'aimes%20les%20caract%C3%A8res%20accentu%C3%A9s%20%3F", use `encodeURIComponent(text)`

inbox : Check your messages
----------
howto: `/inbox/user/token`  
sample: `/inbox/alice/12345` Alice uses her token to get her inbox

return is  `{"v":0.8,"inbox":[]}` or 
 
```
{"v":0.8,"inbox":[ {"from":"bob","message":"Hello%20!","dt":"2012-09-10 17:23:31"}, 
{"from":"charlie","message":"Hi%2C%20how%20are%20you%20doing%20%3F","dt":"2012-09-10 17:24:04"} ]}
```

If username/token mismatch, it returns a `404` error (this may change to `403` in future versions), another apllication might have succesfully logged in.

To transform the string "Salut!%20t'aimes%20les%20caract%C3%A8res%20accentu%C3%A9s%20%3F" into "Salut! t'aimes les caractères accentués ?", use `decodeURIComponent(text)`


about : Get information about a user
----------
howto: `/about/user`  
sample: `/about/alice`

return is `{"v":0.8,"dt":"2012-09-10 18:14:27"}`

delete : Erases a user
----------
howto: `/delete/user/pass`  
sample: `/delete/alice/superpassword` Alice erases her account

return is `{"v":0.8,"dt":"2012-09-10 18:14:27"}`


