# NLN BACKEND

## LIST framework and library

argon2 : Để hash(mã hóa) password

cloudinary : Để lưu trữ hình ảnh

cors : cung cấp các middleware cho phép ta enable cors với nhiều option để tùy chỉnh và ngắn gọn cho express

dotenv : cài đặt biến môi trường

express : Express hỗ trợ các phương thức HTTP và middleware tạo ra 1 API rất mạnh mẽ và sử dụng dễ dàng hơn

jsonwebtoken : Để set token

mongoose : thao tác với mongodb

multer : Để tải hình ảnh lên

nodemon : Để tự động lưu chạy sever khi thay đổi file

## Cách sử dụng API

const API = http://localhost:5000/api

### API auth /auth

Đăng kí (Register)
METHOD POST http://localhost:5000/api/auth/register

Đăng nhập (Login)
METHOD POST http://localhost:5000/api/auth/login

Lấy ra user (get User)
METHOD POST http://localhost:5000/api/auth

Cập nhật thông tin (update User)
METHOD POST http://localhost:5000/api/auth

### Product /api/products

Thêm sản phẩm

post /api/products?productor=productorID&category=categoryID

{
    name
    description
    price
    images: [
        {
            image: String,
            cloudinary_id : String,
        }
    ],
    currentQuantity: 100
    productor: type: Schema.Types.ObjectId, ref: 'productors',
    color: [
        {
            name: yellow,
            quantity: 50
        },
        {
            name: red,
            quantity: 50
        },
    ]
    category: {
         type: Schema.Types.ObjectId, ref: 'categorys', 
    }
}
{
    100
    50 vàng
    50 cam
}
100 vàng


Sửa thông tin sản phẩm
put /api/products/:id
{
    name
    description
    price
    color
    currentQuantity
}

Sửa thông hình ảnh 
put /api/products/:id/:imageID
Xóa hình ảnh 
{
    _id
    cloudinary_id
}
Thêm hình ảnh 
put /api/products/:id/image
{
    push {file}
}


Xóa sản phẩm
delete /api/products/:id
Mô tả:
lặp qua image dùng detroy cloudinary để xóa từng hình ảnh
xóa tất cả comment trong sản phẩm
{
    _id
}
Lấy ra sản phẩm

get /api/products


### Địa chỉ
Thêm địa chỉ, 
Sửa địa chỉ, 
Xóa địa chỉ, 
Lấy ra địa chỉ

### Giỏ hàng /api/carts
 
{

    cartID

    userID,

    productID,

    quantity
}

Thêm sản phẩm vào giỏ hàng

post /api/carts/:productID

{
    quantity

    productID

}
Sửa 

put /api/carts/:id

{
    quantity

    productID

}

delete /api/carts/:id

Xóa sản phẩm trong giỏ hàng {

    cartID

}

#### Thanh toán
CRUD

### Comments /api/comments

0: chưa comment

1:  đã comment

2: đã comment và chỉnh sửa

{

    statusComment: 0

    content: default ''

    rate: default 0

    user:

    product

}
#### Tạo comment

Mô tả: Comments được tạo khi mua hàng và status mua hàng (received) 
Vào controller phần thanh toán thành công xử lí tạo comment tại đây
{
    statusComment: 0
    content: default ''
    rate: default 0
    userID: req
    productID: req.query
}
#### Update Comments 1
Mô tả
{
    content
    image
    rate (*)
}

#### Lấy comments
Khi xem chi tiết sản phẩm gọi api comments
{
    productID
}


## Ky


## Dien


## Tinh
