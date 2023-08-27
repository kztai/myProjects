// httpServer
const express = require('express');
const app = express();
const router = express.Router();

const appData = require('./data.json');
const seller = appData.seller;
const goods = appData.goods;
const ratings = appData.ratings;
const host = '0.0.0.0';
const port = 80;


router.get('/', function(req, res, next) {
	req.url = '/index.html';
	next();
});

router.get('/seller', function (req, res) {
	res.json({errno: 0, data: seller});
});

router.get('/goods', function (req, res) {
	res.json({errno: 0, data: goods});
});

router.get('/ratings', function (req, res) {
	res.json({errno: 0, data: ratings});
});


app.use(router);
app.use(express.static('./dist'));  // 配置静态文件


module.exports = app.listen(port, host, function (err) {
	if (err) {
		console.log(err);
		return
	}
	console.log('Listening at http://' + host + ':' + port + '\n')
});
