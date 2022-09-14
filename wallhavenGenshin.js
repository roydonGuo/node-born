const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')

// https://wallhaven.cc/search?q=id%3A95047&page=
// https://wallhaven.cc/search?q=genshin&categories=110&purity=100&sorting=favorites&order=desc&page=6
let url = 'https://wallhaven.cc/search?q=genshin&categories=110&purity=100&sorting=favorites&order=desc&page='
let page = 40;
let photoSavePath = './Genshin';

run(url, page, photoSavePath)
    .catch(err => {
        console.log('运行错误 => ' + err);
    });

async function run(url, page, photoSavePath) {
    //  获得首页
    let html;
    let i
    for (i = page; i <= page; i++) {
        html = await getHTML(url + i);

        // 可以直接用正则进行内容匹配
        // 把首页 用cheerio模块转换成Dom操作 （注意：load转换时可能会乱码，所以要设置{decodeEntities: false}）
        const $ = cheerio.load(html, {
            decodeEntities: false
        });
        // 2.对返回来的数据进行处理

        $('.thumb-listing-page ul li figure .preview').each((i, item) => {
            let toFullImgUrl = $(item).attr('href')
            console.log('toFullImgUrl------' + toFullImgUrl);
            getDetailMessage(toFullImgUrl)
                .then(imgUrl => {
                    // return addToFile(movie);
                    console.log(imgUrl);
                    downloadPhoto(imgUrl, photoSavePath)
                })
                .catch(err => {
                    console.log(err);
                });

        })
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
    try {
        let detailHTML = await getHTML(url);
        // console.log(detailHTML);
        var index = detailHTML.indexOf('https://w.wallhaven.cc/full/')
        console.log(index);
        let fullImgUrl = detailHTML.substring(index, index + 51)
        // console.log(fullImgUrl);
        return index > 0 ? fullImgUrl : getDetailMessage(url)
    } catch (e) {
        console.log('Method: getDetailMessage =>' + e);
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