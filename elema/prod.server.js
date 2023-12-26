// 静态资源与动态api放在一起的写法（正式项目不会这样做，前端为了方便调试才这样写）

// 静态资源
const express = require('express');
const port = 9000;
const app = express();
const router = express.Router();

//路由清单（从上往下匹配，当有重复时，先匹配前面的）
app.get('/', function(req, res) {
	// res常用的有res.send(), res.sendFile()； sendFile表示发送一个页面给客户，要用绝对路径
	// __dirname表示当前js文件的绝对路径
	res.sendFile(__dirname + '/dist/index.html');
});

app.use(router);



// 动态api：
const appData = require('./data.json');
const seller = appData.seller;
const goods = appData.goods;
const ratings = appData.ratings;

const apiRoutes = express.Router();

apiRoutes.get('/seller', function (req, res) {
	res.json({errno: 0, data: seller});
});

apiRoutes.get('/goods', function (req, res) {
	res.json({errno: 0, data: goods});
});

apiRoutes.get('/ratings', function (req, res) {
	res.json({errno: 0, data: ratings});
});

app.use('/elema/api', apiRoutes);

app.use(express.static('./dist'));

app.get('*', (req, res) => {
	res.sendFile(__dirname, '/dist/index.html')
})

module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Listening at http://localhost:' + port + '\n')
});
