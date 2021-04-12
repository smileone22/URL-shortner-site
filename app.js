const express = require('express'); // create application objects 
const path = require('path');
const app = express();
const fs = require('fs');

//templating 
app.set('view engine', 'hbs');

// static middleware
const staticPath = path.resolve(__dirname, 'public');
app.use(express.static(staticPath));

//if working with post forms/ form-url encoded data, use this body parsing middleware
app.use(express.urlencoded( {extended: false})); 
app.use(function(req, res, next) {
	console.log("Method: " + req.method + "\n");
	console.log("Path: " + req.path + "\n");
	console.log("Query: "); 
	console.log(req.query);
	console.log("\n");
	next();
});


urlData=[] ;//global arr 
shorturlData=[];
const initialData = require('./data/urldata.json'); 
const URLShortener = require('./urlShortner.js').URLShortener;



for (let i=0; i<initialData.length;i++){
    let item= new URLShortener(initialData[i].originalURL,initialData[i].shortURL,initialData[i].clickCount);
    urlData.push(item);
    shorturlData.push(item.shortURL);
}


//console.log(urlData);



app.get('/', (req,res)=>{
    res.redirect('/trending');
});

app.get('/trending', (req,res)=>{
    let trendy= Array.from(urlData);
    trendy.sort((a,b)=>parseInt(b.clickCount)-parseInt(a.clickCount));  
    console.log(trendy);
    res.render('trending',{urlData:trendy.slice(0,5)});
});

app.get('/shorten' ,(req,res) =>{
    let output='';
    //console.log(req.query);
    if (!req.query.longInputURL) { //first page 
        output='';
    }
    else{ 
        let answer= urlData.filter( function(e){
            if (e.originalURL===req.query.longInputURL){
                return e.shortURL;
            }
        } );
        //console.log(answer[0].shortURL);
        output = 'The short URL is: '+answer[0].shortURL;
    }
    res.render('shorten',{output:output});
});

app.post('/shorten', (req,res)=> {
    //whatever validation
    //render error template also, maybe put error message saying blah blah 
    const long= req.body.longInputURL;
    let obj= new URLShortener(long);
    obj.shorten(); //shorten the URL by calling the shorten method in the URLShortener class
    
    let found =false; 
    if (obj.shortURL in shorturlData){
        found=true; 
    }
    while (found===true){
        obj.shorten();
        if (!obj.shortURL in shorturlData){
            found=false; 
        }
    }

    //validation of duplicated short URL above using while loop (extra_credit)
    urlData.push(obj);
    shorturlData.push(obj.shortURL);

    //long input 
    console.log(obj); //check out new obj
    console.log(urlData); //checkout updated urlData
    fs.writeFile('./data/urldata.json', JSON.stringify(urlData), function writeJSON(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(urlData));
        console.log('UPDATED');
      });
    res.redirect('/shorten?longInputURL='+long);
});

app.get('/expand', (req,res) =>{
    let output='';
    console.log(req.query==='');
    if (! req.query.shortenedUrl){
        output='';
    }
    else if (shorturlData.indexOf(req.query.shortenedUrl)!==-1){
        let ind =shorturlData.indexOf(req.query.shortenedUrl);
        console.log(urlData[ind]);
        console.log(typeof(urlData[ind]));
        let longOutput= urlData[ind].expand();
        urlData[ind].updateClickCount();
        console.log(longOutput);
        output = 'The original URL was '+longOutput;
        console.log(output);
    } else{
        output = "There is no such shortened URL :(";
    }
    console.log(output);

    fs.writeFile('./data/urldata.json', JSON.stringify(urlData), function writeJSON(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(urlData));
        console.log('UPDATED');
      });
    res.render('expand',{output : output});
    
});

app.get('/img/logo.png', (req,res) => {});


app.listen(3000)
console.log("Server started; type CTRL+C to shut down " );
//module.exports.urlData = urlData;