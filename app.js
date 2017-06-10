var bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    express        = require("express"),
expressSanitizer   = require("express-sanitizer"),
    mongoose       = require("mongoose"),
    app            = express();
    
//APP CONFIG
mongoose.connect("mongodb://localhost/blogapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title:"Fashion By Birth",
//     image: "http://www.imusthear.com/wp-content/uploads/2016/11/Victory-Jones-The-Color-Girl-Campaign-Fashion-bomb-daily-2-1000x600.jpg",
//     body:"Most people think Fashion and Style as same content but they aren’t. The both terms are always used but mostly used in a wrong context example; you have a great fashion sense meanwhile it is style at work. I can be a fashionista and might not be a guru when it comes to style."
// });

//RESFUL ROUTES

app.get("/", function(req,res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blog){
        if(err){
            console.log("Bad");
        }
        else{
            res.render("index", {blogs:blog});
        }
    });
    
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req,res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //Create blog post
    Blog.create(req.body.blog, function(err, blogpost){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundPost){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show", {blog:foundPost});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req, res){
    Blog.findById(req.params.id, function(err, foundPost){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundPost});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedPost){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   })
   //redirect somewhere
});







app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog is Up and Running...");
})