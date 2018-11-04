const fs = require('fs');
const {posts} = require('./ajax.js')
/**
 * 路由模块
 *
 *
 * */
module.exports = {
    handleHtml(routes, callback) {
        routes.forEach(({path, component}) => {
            const handleRsponse = (req, response) => {
                fs.readFile(component, function (err, data) {
                    if (err) {
                        console.log(err);
                        response.writeHead(404, {"Content-Type": "text/html"});
                    }
                    else {
                        response.writeHead(200, {"Content-Type": "text/html"});
                        response.write(data.toString());
                    }
                    response.end();
                });
            };
            callback && callback(path, handleRsponse)
        })
    },
    addAllHeaders(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1')
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    },
    handleLogs({method, url}) {
        const logstring = `++ url:${url}, datetime:${new Date().toLocaleString()}\n`;
        fs.appendFile( `./logs/${method}`, logstring,'utf8', err => {
           if(err){
               throw err;
           }
        });
    },
    registerPostReq(callback) {
        const paths = Object.keys(posts);
        paths.forEach((path) => {
            callback && callback(path, posts[path])
        })
    }
}