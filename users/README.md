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

### Update Profile
* Send `POST` to `/api/users/:id` with body like
```json
{
  "email": "aaron_colaco@persistent.co.in",
  "ethAccount": "fsdf79873453jkwhr89342",
  "name": "John Smith",
  "firebaseToken": "sdfwedsf564sd56f453156sdf1sdf"
}
```

