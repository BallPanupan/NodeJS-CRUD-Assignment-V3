// This is global routes file
const express = require('express')
const router = express.Router()
const todolistRoutes = require('../services/todolists/routes/router')
var Mongoose = require('Mongoose')
var multer = require('multer');

router.use('/todolists', todolistRoutes)

//mongodb
//var pkap_testSchema = new Schema({fname:String,lname:String,sex:String});
//var pkap_tests = Mongoose.model("pkap_tests",pkap_testSchema);

Mongoose.connect('mongodb://localhost/pkap_todolists',{useMongoClient:true});
var Schema = Mongoose.Schema; //insert data
var Schema2 = Mongoose.Schema;// post comment on page

//for Insert Product
var product_postSchema = new Schema({categoryX:String,Product_name:String,Pricex:String,img1:String,img2:String,img3:String,img4:String,img5:String,
                                    Details:String,Locationx:String,Phone_number:String});
var product_posts = Mongoose.model("product_posts", product_postSchema);

//for comment on Page
var comment_postSchema2 = new Schema({
    name_comment: String,
    email_comment: String,
    text_comment: String,
    comment_in_product: String
  });
var comment_posts = Mongoose.model("comment_posts", comment_postSchema2)

//image
var imgxs = Mongoose.model("product_posts",product_postSchema);

// upload Image Control Name image = Date Now
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function(req, file, cb) {
	cb(null, 'file-' + Date.now() + '.' +
		file.originalname.split('.')[file.originalname.split('.').length-1]);
  }
});

//Image Control Upload = 5 image
var upload = multer({ storage : storage }).array('fileupload',5);//(name ,Number of images)

//Index Page
router.get('/', function (req, res) {
  product_posts.find('product_posts'.toArray,function(ree,product_posts){
  //console.log(product_posts);
  res.render('index',{data:product_posts});
  });
});

//Sell Page (insert data for sell)
router.get('/sell', function (req, res) {
  product_posts.find('product_posts',function(ree,product_posts){
  //console.log(product_posts);
  res.render('sell',{data:product_posts});
  });
});

//Insert ro Post product form Sell Page
router.post('/sell_product',function(req,res){
  upload(req,res,function(err) {
        console.log('--- upload ---');
        console.log(req.body);
        console.log("\n")
        console.log(req.files);
        console.log("\n");

        var imgname_array=req.files;
        var imgname = [];

        console.log("\n");
        console.log("total img = ", imgname_array.length);

        for(var i=0;i<imgname_array.length;i++){ //loop view img
          no=i+1;
          //console.log(no, filename=imgname_array[i].filename);
          imgname.push(filename=imgname_array[i].filename);

        }

        console.log(imgname);
        console.log("\n");
        console.log("1 : ",imgname[0]);
        console.log("2 : ",imgname[1]);
        console.log("3 : ",imgname[2]);
        console.log("4 : ",imgname[3]);
        console.log("5 : ",imgname[4]);


        var productPost = new product_posts({ //insert data
          categoryX : req.body.categoryX,
          Product_name : req.body.Product_name,
          Pricex : req.body.Pricex,
          Details : req.body.Details,
          Locationx : req.body.Locationx,
          Phone_number : req.body.Phone_number,
          img1 : imgname[0],
          img2 : imgname[1],
          img3 : imgname[2],
          img4 : imgname[3],
          img5 : imgname[4],
        })

        productPost.save();
        res.redirect('/')
    });
});

//Update product
router.get('/update/:_id',function(req,res){
  //var _id=req.params._id;
  product_posts.findById(req.params._id,function(err, result){

    res.render('update',{data:result})
    console.log("\nview data for update");
    console.log(result);
    });
});

////////////////////////////////
//View produst type
////////////////////////////////

//view product
router.get('/view/:_id', function (req, res) {
  _id=req.params._id;
  var dataxx1;
  var dataxx2;

  product_posts.findById(_id,function(err, product_posts){
    var array1 = product_posts;
        dataxx1 = product_posts;

    if(array1){
      // res.render('view',{data:product_posts});
      // console.log(array1);

    }else {
      res.send("ERROR::We cannot find ");
    }
  });

  var query = { comment_in_product: _id };
  comment_posts.find(query,function(err, comment_posts){
    var array2 = comment_posts;
        dataxx2 = comment_posts;

    if(array2){
      //res.render('view',{data2:comment_posts});
      //console.log(array2);
    }else {
      res.send("ERROR::We cannot find ");
    }
  });

  setTimeout(function(){
    if (dataxx1>1) {
      res.send("ERROR::We cannot find ");
    }else{
      res.render('view',{data:dataxx1,data2:dataxx2});
      console.log(dataxx1);
      console.log(dataxx2);
    }
  },20);
});

var nameimg;
var productPost;
	function main(req, res){
	  var imgs = new imgxs({
		img1 : nameimg
	  })
		imgs.save();
		console.log(imgs);
	}

//comment product
router.post('/comment_insert/:_id',function(req,res){
  _id=req.params._id;
  var commentposts = new comment_posts({
    name_comment : req.body.name_comment,
    email_comment : req.body.email_comment,
    text_comment : req.body.text_comment,
    comment_in_product : req.body.comment_in_product
  })

  commentposts.save();
  console.log("\n");
  console.log(commentposts);

  viewx= "/view/"+_id;
  res.redirect(viewx);
});

// update product
router.post('/update',function(req, res){
  product_posts.findById(req.body._id,function(err, result){
      result.categoryX = req.body.categoryX,
      result.Product_name = req.body.Product_name,
      result.Pricex = req.body.Pricex,
      result.Details = req.body.Details,
      result.Locationx = req.body.Locationx,
      result.Phone_number = req.body.Phone_number,

      result.save();
  });
  res.redirect('/admin');
});
////////////////////////////////////////////////////////////////
//ADMIN
////////////////////////////////////////////////////////////////
//Admin
router.get('/admin', function (req, res) {
  product_posts.find('product_posts'.toArray,function(ree,product_posts){
  //console.log(product_posts);
  res.render('adminPass',{data:product_posts});
  });
});

router.get('/adminPass', function (req, res) {
  product_posts.find('product_posts'.toArray,function(ree,product_posts){
  //console.log(product_posts);
  res.render('adminPass',{data:product_posts});
  });
});

  ////////////////////////////////////////////////////////////////////
  // router.post('/admin', function(req, res) {
  //   adminUser = req.body.adminUser;
  //   adminPass = req.body.adminPass;
  //
  //   if (adminUser=="adminX", adminPass=="passX") {
  //     console.log("Username : ",adminUser);
  //     console.log("Password : ",adminPass);
  //     console.log("_______________________.");
  //     console.log("password is incorrect!!}");
  //     console.log("_______________________|");
  //     console.log("Password is correct.!");
  //
  //     //res.render('./adminPass');
  //     product_posts.find('product_posts',function(ree,product_posts){
  //     //console.log(product_posts);
  //     res.render('./adminPass',{data:product_posts});
  //     });
  //
  //   }else {
  //     console.log("Username : ",adminUser);
  //     console.log("Password : ",adminPass);
  //     console.log("_______________________.");
  //     console.log("password is incorrect!!|");
  //     console.log("_______________________|");
  //     res.render('./admin');
  //   }
  //
  //   //console.log(adminUser);
  //   //res.render('adminPass');
  // });

//Delete Product for admin
  router.get('/delete/:_id',function(req,res) {
    product_posts.findById(req.params._id,function(err,product_posts){
      product_posts.remove();
    });
    res.redirect('/adminPass');
  });

  //Admin view product
  router.get('/admin_view/:_id', function (req, res) {
  _id=req.params._id;
  var dataxx1;
  var dataxx2;

  product_posts.findById(_id,function(err, product_posts){
    var array1 = product_posts;
        dataxx1 = product_posts;

    if(array1){
      // res.render('view',{data:product_posts});
      // console.log(array1);

    }else {
      res.send("ERROR::We cannot find ");
    }
  });

  var query = { comment_in_product: _id };
  comment_posts.find(query,function(err, comment_posts){
    var array2 = comment_posts;
        dataxx2 = comment_posts;

    if(array2){
      //res.render('view',{data2:comment_posts});
      //console.log(array2);
    }else {
      res.send("ERROR::We cannot find ");
    }
  });

  setTimeout(function(){
    if (dataxx1>1) {
      res.send("ERROR::We cannot find ");
    }else{
      res.render('admin_view',{data:dataxx1,data2:dataxx2});
      console.log(dataxx1);
      console.log(dataxx2);
    }
  },20);
});

//delete comment
  router.get('/delete_comment/:_id',function(req,res) {
    comment_posts.findById(req.params._id,function(err,comment_posts){
      comment_posts.remove();
    });
    res.redirect('/adminPass');
  });


module.exports = router
