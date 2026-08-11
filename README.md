# API Documentation

### API Path
**URL**: `https://prisma-learning.onrender.com/api`

---

### Admin Credentials
**Admin Email**: `admin@example.com` </br>
**Admin Password**: `123456`

---

### Indicators



```*``` - Indicates **Admin-only Endpoint** </br>
```**``` - Indicates **Validated user only**

---

### Header

```json
{
  "Authentication": "Bearer JWT_TOEKN_HERE"
}
``` 

- Required for Admin/User only endpoints

</br>

## Register User API

**Endpoint**: `/register` </br>
**Method**: `POST`

---

### Parameters

```json
{
  "name": "John Doe",              // requried
  "email": "johndoe@example.com",  // required
  "password": "123456"             // required
}
```

---

</br>

## Fetch User API

**Endpoint**: `/users` `*` </br>
**Method**: `GET`

---

</br>

## Login User API

**Endpoint**: `/login` </br>
**Method**: `POST`

---

### Parameters

```json
{
  "email": "johndoe@exampe.com",  // required
  "password": "123456"            // required
}
```

---

</br>

## Update User API

**Endpoint**: `/update` `**` </br>
**Method**: `PATCH`

---

### Parameters

```json
{
  "name": "Jonathon Doe",
  "email": "jonathondoe@example.com"
}
```

---

</br>

## Delete User API

**Endpoint**: `/delete` `**` </br>
**Method**: `DELETE`

---

</br>

## Add Product API

**Endpoint**: `/product` `*` </br>
**Method**: `POST`

---

### Parameters

```json
{
  "title": "Lorem Ipsum",                       // required
  "description": "Lorem Ipsum Dolor Sit Amet",
  "stock": 6,                                   // required
  "price": 6.7                                  // required
}
```

---

</br>

## Get Products API

**Endpoint**: `/product` </br>
**Method**: `GET`

---

</br>

## Get Specific Product API

**Endpoint**: `/product/:id` </br>
**Method**: `GET`

---

### Parameters

```json
{
  "id": "a12-34ed-..."  // Product id | required 
}
```

---

</br>

## Update Product API

**Endpoint**: `/product` `*` </br>
**Method**: `PATCH`

---

### Parameters

```json
{
  "id": "a12-34ed-...",  // Product id | required
  "title": "Lorem Ipsum",
  "description": "Lorem Ipsum Dolor Sit Amet",
  "stock": 6,
  "price": 6.7
}
```

---

</br>

## Delete Product API

**Endpoint**: `/product` `*` </br>
**Method**: `DELETE`

---

### Parameters

```json
{
  "id": "a12-34ed-..."  // Product id | required 
}
```

---

</br>

## Add Order API

**Endpoint**: `/order` `**` </br>
**Method**: `POST`

---

### Parameters

```json
{
  "productId": "a12-34ed-...",  // required
  "quantity": 4                 // required
}
```

---

</br>

## Get All Orders API

**Endpoint**: `/orders` `*` </br>
**Method**: `GET`

---

</br>

## Get Specific Order API

**Endpoint**: `/order/:id` `**` `*` </br>
**Method**: `GET`

---

</br>

## Get My Order API

**Endpoint**: `/my-order` `**` </br>
**Method**: `GET`

---

</br>

## Update Order API

**Endpoint**: `/order` `*` </br>
**Method**: `PATCH`

---

### Parameters

```json
{
  "id": "a12-34ed-...",                     // Order Id | required
  "status": "Ordered/Processing/Delivered"  // required
}
```

---

</br>

## Delete Order API

**Endpoint**: `/order` `*` </br>
**Method**: `DELETE`

---

### Parameters

```json
{
  "id": "a12-34ed-...",  // Order Id | required
}
```

---

</br>

## Add Review API

**Endpoint**: `/review` `**` </br>
**Method**: `POST`

---

### Parameters

```json
{
  "productId": "a12-34ed-...",            // required
  "review": "lorem ipsum dolor sit amet"  // required
}
```

---

</br>

## Get Review API

**Endpoint**: `/reviews` </br>
**Method**: `GET`

---

</br>

## Get Specific Review API

**Endpoint**: `/review/:id` </br>
**Method**: `GET`

---

</br>

## Update Review API

**Endpoint**: `/review` `**` </br>
**Method**: `PATCH`

---

### Parameters

```json
{
  "id": "a12-34ed-...",          // Review id | required
  "review": "lorem ipsum dolor"  // required
}
```

---

</br>

## Delete Review API

**Endpoint**: `/review` `**` </br>
**Method**: `DELETE`

---

### Parameters

```json
{
  "id": "a12-34ed-...",  // Review id | required
}
```

---

</br>

## Response Format

### Successful Response Format

```json
{
  "status": "success",
  "message": "SUCCESS_MESSAGE_HERE",
  "data": "RETURNED_DATA_WITH_DB_ID"
}
```

</br>

### Error Responses Format

```json
{
  "status": "error",
  "message": "ERROR_MESSAGE_HERE"
}
```

---
