
const DetailProduct = require('../models/DetailProduct.model');
const Product = require('../models/Product.model');

const Category = require('../models/Category.model');


const cloudinary = require('../utils/cloudinary');

const dotenv = require('dotenv');

dotenv.config();

// method update multiples images
const cloudinaryImageUploadMethod = async file => {
    return new Promise(resolve => {
        cloudinary.uploader.upload( file,{ folder: "postTravel" } , (err, res) => {
          if (err) return res.status(500).send("upload image error")
            resolve({
              res: {image: res.secure_url, cloudinary_id: res.public_id }
            }) 
          }
        ) 
    })
  }

// method POST api/product?productor&category
// create product
// having token and isAdmin = true
exports.createProduct = async (req, res) => {
    const {name} = req.body;
    if(!name ) {
        return res.status(400).json({success: false, message: "Vui lòng nhập tên sản phẩm"})
    }
    try {
        const result = await cloudinary.uploader.upload(req.file.path,{ folder: "products" });
       
        

        const {category, productor} = req.query;
       
        const newProduct = new Product({
            name,
            category,
            productor,
            image: result.secure_url,
            cloudinary_id: result.public_id,

        })

        await newProduct.save();
       
        res.status(200).json({success: true, message: "Created productor successfully", newProduct})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router'});
    }
}
// method GET api/product
// get All products
// public
exports.getAllProducts = async (req, res) => {
   
    try {
        
        // const allProducts = await Product.find()
        //                         // .limit(pageSize)
        //                         // .skip(skip)
        //                         .populate('category',['category', '_id'])
        //                         .populate('productor',['_id','name', 'description', 'image'])
        //                         .sort({'createdAt': -1})
        const allProducts = await Product
                        .aggregate([
                {
                    $lookup: {
                    from: 'detailproducts', // collection name of DetailProduct model
                    localField: '_id',
                    foreignField: 'product',
                    as: 'detailProduct'
                    }
                },
                {
                    $lookup: {
                        from: 'categories', // collection name of Category model
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $lookup: {
                        from: 'productors', // collection name of Category model
                        localField: 'productor',
                        foreignField: '_id',
                        as: 'productor'
                      }
                }
                ])
        // await Category.populate(newProduct, {path: "categories"});

       
        
       
        res.status(200).json({success: true, message: "get all Products successfully", allProducts})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router a'});
    }
}


// method GET api/product/:id
// get All products
// public
exports.getProductById = async (req, res) => {
   
    try {
       
       
        const product = await Product.findById(req.params.id)
                                .populate('category',['category', '_id'])
                                .populate('productor',['_id','name', 'description', 'image'])
                                
        const detailProduct = await DetailProduct.find({product:product._id})
       
       
       
        
       
        res.status(200).json({success: true, message: "get all Products successfully", product, detailProduct})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router'});
    }
}

// method PUT api/product/:id
// update information product
// admin
exports.updateInformationProduct = async (req, res, next) => {
  const {name} = req.body;
  if(!name) {
      return res.status(400).json({success: false, message: "Thiếu tên rồi !"})
  }
  try {
    
      let updateInfo = {
          name,
         
        
      };
      
      const infoUpdateCondition = {_id: req.params.id};
      updateInfo = await Product.findOneAndUpdate(infoUpdateCondition, updateInfo, {new: true})
                            .populate('category',['category', '_id'])
                            .populate('productor',['_id','name', 'description', 'image'])

          // user not authorised to update post or post not found
          if (!updateInfo) {
              return res.status(401).json({success: false, message:'Không thể cập nhật'})
          }
          
         
          
          res.status(200).json({success: true, message: 'Bạn đã cập nhật thông tin sản phẩm thành công !!!', product: updateInfo});

      
  } catch (error) {
      console.log(error);
      res.status(500).json({
          error: error
      });
  }
}

// method delete api/product/:id
// delete product
// admin
exports.deleteProduct = async (req, res, next) => {
   
    try {
        const deleteProduct = await Product.findOneAndDelete({_id: req.params.id})
        await cloudinary.uploader.destroy(deleteProduct.cloudinary_id);
        const deleteDetailProduct = await DetailProduct.find({product: req.params.id})
        for (let i = 0; i < deleteDetailProduct.length ; i++) {
            await cloudinary.uploader.destroy(deleteDetailProduct[i].cloudinary_id);
        }
        await DetailProduct.deleteMany({product: req.params.id})
        
        res.status(200).json({success: true, message: 'Bạn đã xóa sản phẩm thành công !!!'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
  }
