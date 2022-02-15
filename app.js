const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running !");
}); 

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    
    const url = "https://us14.api.mailchimp.com/3.0/lists/9064336017";
    
    const options = {
        method: "POST",
        auth: "kavya:ca9b2676e5353dc3d237aa61f9d0dd28-us14"
    }

    const request = https.request(url, options, function(response){
        
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });

    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});


//API KEY -> ca9b2676e5353dc3d237aa61f9d0dd28-us14
// UNIQUE ID -> 9064336017

