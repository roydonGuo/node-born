const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')

let url = 'https://example/img?search$page='
let page = 23;
//图片保存路径
let photoSavePath = './img';

let imgS = []
run(url, page, photoSavePath)
    .catch(err => {
        console.log('运行错误 => ' + err);
    });

async function run(url, page, photoSavePath) {
    let html;
    for (let i = page; i <= page; i++) {
        html = await getHTML(url + i);
        // 转为dom操作
        const $ = cheerio.load(html, {
            decodeEntities: false
        });
        $('.thumb-listing-page ul li figure .preview').each((i, item) => {
            let toFullImgUrl = $(item).attr('href')
            console.log('toFullImgUrl------' + toFullImgUrl);
            getDetailMessage(toFullImgUrl)
                .then(imgUrl => {
                    console.log(imgUrl);
                    downloadPhoto(imgUrl,photoSavePath)
                })
                .catch(err => {
                    console.log(err);
                });
    }
}

// 请求资源
function getHTML(url, timeout = 50000) {
    return new Promise((resolve, reject) => {
        // 1.发送请求，等待网站回应
        request.get(url, {
            timeout: timeout
        }, function (error, response, body) {
            error ? reject('Timeout.\n') : resolve(body);
        })
    })
}
   // 获得图片的full的详细信息
async function getDetailMessage(url) {
    // 此处逻辑需要自己定义
    try {
        let detailHTML = await getHTML(url);
        // console.log(detailHTML);
        var index = detailHTML.indexOf('https://example.com/img/')
        console.log(index);
        let fullImgUrl = detailHTML.substring(index, index + 51)
        // console.log(fullImgUrl);
        return index > 0 ? fullImgUrl : getDetailMessage(url)
    } catch (e) {
        console.log('Error: Message =>' + e);
    }
}




// 下载图片
function downloadPhoto(src, photoSavePath, timeout = 20000) {
    if (src) {
        // 保存路径
        let path = photoSavePath + '/' + src.toString().slice(41);
        // 下载
        request.get(src, {
            timeout: timeout
        }, err => {
            err ? console.log('Method: downloadPhoto => download error\n' + err) : null;
        }).pipe(fs.createWriteStream(path));
    }
}
