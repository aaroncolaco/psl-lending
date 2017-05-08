## User API
### Sign Up
* Send `POST` to `/api/users` with body like
```json
{
  "name": "John Doe",
  "email": "john_doe@xyz.com"
}
```

#### Possible Responses
#### Success
* Response with status code `201` and body containing `_id`, `name`, `email`
```json
{
  "_id": "58f5f04440b37d2a044dd69d",
  "name": "John Doe",
  "email": "john_doe@xyz.com"
}
```
Save `_id` so that you can use it to verify account.

#### Failure
* Response with status code `409` if user already registered
* Server error with status code `500`

---

### Verify Account
* Check the email account used to sign up for the OTP code

* Send `POST` to `/api/users/verify/:id` with body like
```json
{
  "otp": "123456"
}
```
`:id` is the id saved after signing up


#### Possible Responses
#### Success
* Response with status code `202` and body containing `_id`, `name`, `email`
```json
{
  "_id": "65f5f04440b37d2a044dd69d",
  "name": "John Doe",
  "email": "john_doe@xyz.com"
}
```
`_id` is different from before and should be saved for all future account related operations. Previous one can be deleted.

#### Failure
* Response with status code `404` if not found
* Response with status code `401` if wrong OTP
* Response with status code `400` if OTP expired
* Response with status code `429` if too many attempts
* Server error with status code `500`

---

### Initialize Account
* Send `POST` to `/api/users/:id/account` with body like
```json
{
  "ethAccount": "fsdf79873453jkwhr89342",
  "firebaseToken": "sdfwedsf564sd56f453156sdf1sdf",
  "name": "John Smith",
  "publicKey": "asfdihywq789y4r2378462387n6xdz823762378463232werd"
}
```

#### Possible Responses
#### Success
* Response with status code `202` and body:
```json
{
  "status": 202,
  "message": "Created Account"
}
```

#### Failure
* Response with status code `400` if bad data
* Response with status code `404` if not found, or already created account
* Server error with status code `500`

---

### Update Profile
* Only `name` and `firebaseToken` can be updated
* Send `POST` to `/api/users/:id` with body like
```json
{
  "firebaseToken": "sdfwedsf564sd56f453156sdf1sdf",
  "name": "John Smith",
}
```

#### Possible Responses
#### Success
* Response with status code `202` and body:
```json
{
  "status": 202,
  "message": "Updated"
}
```

#### Failure
* Response with status code `400` if bad data
* Response with status code `404` if not found
* Server error with status code `500`

---

### Search Users

* Send `GET` to `/api/users`.

* Possible query params:
  - `name` : RegEx search
  - `email` : prestring search
  - `ethAccount` : exact match
  - `limit` : number of results to return. Default `10`, max `100`

#### Possible Responses
#### Success
* Response with status code `200` and array containing users:
* Empty array if no users found

#### Failure
* Server error with status code `500`

 ---

 ### Get User by ID

* Send `GET` to `/api/users/:id`.

#### Possible Responses
#### Success
* Response with status code `200` and body:
```json
  "_id": "23874xd923847xcn98mxc89xcm8423",
  "email": "aaron_colaco123@persistent.com",
  "ethAccount": "0x54ab617553e808286bab2483e92203bc7e9afaa9",
  "firebaseToken": "fwuRJg74v7g:APA91bE3GMYUhvRNKZHQCXs4s8NfbmX246e4GOeRS7sk1u2ZGB7NZ89FcffZLfQwo6tpk6_d-mVdemNealVxFc1lxm3bAtqfvt-b4Oe7uLKgdToz5tzIeOD_WSfnblNu4iRcNnMllxKZ",
  "name": "Jane Doe",
  "publicKey": "2387r9n8y249c7rny2347899mxcy934"
```

#### Failure
* Response with status code `404` if not found
* Server error with status code `500`
