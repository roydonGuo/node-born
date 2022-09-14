const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')

var url = 'https://example/'
var photoSavePath = './imgTop';

run(url,  photoSavePath)
    .catch(err => {
        console.log('运行错误 => ' + err);
    });

async function run(url, photoSavePath) {
    //  获得首页
    var html = await getHTML(url);

    // console.log(html);
    var index = html.indexOf('https://w.wallhaven.cc/full/')
    console.log(index);
    console.log(html.substring(index,index+51));

}

// 请求html
function getHTML(url, timeout = 20000) {
    return new Promise((resolve, reject) => {
        // 1.发送请求，等待网站回应
        request.get(url, {
            timeout: timeout
        }, function (error, response, body) {
            error ? reject('Timeout.\n') : resolve(body);
        })
    })
}


// 下载图片
function downloadPhoto(src, photoSavePath, filename, timeout = 20000) {
    if (src) {
        // 提取后缀名
        let suffix = src.toString().slice(-4);
        // 拼接路径
        let path = photoSavePath + '/' + filename + suffix;
        // 下载
        request.get(src, {
            timeout: timeout
        }, err => {
            err ? console.log('Method: downloadPhoto => download error\n' + err) : null;
        }).pipe(fs.createWriteStream(path));
    }
}
