const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')

let url = 'https://example.com&page='
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
