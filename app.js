/**
 * 重点;
 *  1 前端的图片预览
 *  2 下载网络图片 -- 爬取
 *  3 后端分析, md.....
 *
 *  4 sockit
 *
 * */
const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser');
const {handleHtml, addAllHeaders, handleLogs, registerPostReq} = require('./services/router')
const util = require('./services/utils');

const Config = {
    ip: util.getIp(),
    port: 3003,
    uploadPath: './upload/imgs',
    // html
    htmlRoutes:[
        {path: '/', component: './public/index.html'},
        {path: '/md', component: './public/md.html'},
        {path: '/down', component: './public/downimg.html'},
    ]
}

const app = express()

// 托管静态资源
app.use(express.static(path.join(__dirname, 'public')))
app.use('/upload',express.static(path.join(__dirname, 'upload')))
app.use('/upload/imgs',express.static(path.join(__dirname, 'upload/imgs')))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const router = express.Router();
/*===========================路由=============================================*/
// 添加跨域请求头
router.all('*', addAllHeaders)

app.use((req, res, next) => {
    handleLogs(req)
    next()
});

//-------------------------------------------

handleHtml(Config.htmlRoutes, (path, responseFun) => {
    router.get(path, responseFun);
})
// 处理post请求
registerPostReq((path, reqFun) => {
    app.post(path, reqFun)
})

/*========================================================================*/
app.use(router)
/*========================================================================*/

app.listen(Config.port, Config.ip, () => {
    console.log(`runing at http://${Config.ip}:${Config.port}`)
})