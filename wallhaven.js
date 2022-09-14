const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')

let url = 'https://example/$page='
let page = 23;
//图片保存路径
let photoSavePath = './img';

let imgS = []
run(url, page, photoSavePath)
    .catch(err => {
        console.log('运行错误 => ' + err);
    });

async function run(url, page, photoSavePath) {
    //  获得首页
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
                    // return addToFile(movie);
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

// 添加到文件
function addToFile(item) {
    if (item) {
        let imgSrc = item.img;
        item = JSON.stringify(item) + '\n';
        // 把movie 写入文件
        fs.appendFile('./data/data.txt', item, {
            encoding: 'utf-8',
            flag: 'a'
        }, error => {
            error ? console.log('Method: addToFile => data write error.\n' + error) : null;
        })
        return imgSrc;
    }
}


// 下载图片
function downloadPhoto(src, photoSavePath, timeout = 20000) {
    if (src) {
        let path = photoSavePath + '/' + src.toString().slice(41);
        // 下载
        request.get(src, {
            timeout: timeout
        }, err => {
            err ? console.log('Method: downloadPhoto => download error\n' + err) : null;
        }).pipe(fs.createWriteStream(path));
    }
}
