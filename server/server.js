var aws = require('aws-sdk');
aws.config.loadFromPath('./config/s3config.json');
var s3 = new aws.S3();
var express = require('express');
var server = express();
var port = process.env.PORT || 3000;
var cors = require('cors');
var bodyParser = require('body-parser');
server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
server.use(cors());

var router = express.Router();
server.use('/api', router);

router.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

router.get('/', cors(), function(req, res, next){
  res.send('server api located at /api');
});

router.get('/images', cors(), function(req, res, next){
  res.json({msg: 'This is CORS-enabled for all origins!'});
});

router.post('/images', cors(), function(req, res, next){
  var s3Request = {
    Body : file,
    ContentType: file.type,
    Bucket : "shareeverymile",
    Key : file.name
  };

  s3.putObject(s3Request, function(err, data){
    if(err){
      console.log(err);
    }else{
      console.log(data);
    }
  });
});

router.get('/buckets', cors(), function(req, res, next){
  res.json({msg: 'This is CORS-enabled for all origins! buckets!'});
});

server.listen(port, function(){
  console.log('listening on port: ', port);
});
