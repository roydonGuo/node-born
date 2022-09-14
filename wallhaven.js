const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')

let url = 'https://wallhaven.cc/search?q=id%3A1&categories=110&purity=100&sorting=favorites&order=desc&pag=1&page='
let page = 23;
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
                    downloadPhoto(imgUrl,photoSavePath)
                })
                .catch(err => {
                    console.log(err);
                });

            // console.log(fullUrl + '=========');

            // console.log(toFullImgUrl);

        })
        // console.log('-----------------------------------------------------------')
        // $('.thumb-listing-page ul li figure .lazyload').each((i, item) => {

        //     let originalImgUrl = $(item).data('src')
        //     let nowImgUrl = 'https://w.wallhaven.cc/full/' + originalImgUrl.slice(30, 33) + 'wallhaven-' + originalImgUrl.slice(33)
        //     downloadPhoto(nowImgUrl,photoSavePath,originalImgUrl.slice(33,39))

        //     imgS.push(nowImgUrl)

        //     // console.log(nowImgUrl); // 此时链接可能就出错，不能保证png格式的图片被加载成jpg格式而打不开
        //     // 利用详情链接获取图片详细信息
        //     // getDetailMessage(originalImgUrl)
        //     //     .then(imgSrc => {
        //     //         downloadPhoto(imgSrc, photoSavePath, i);
        //     //     })
        //     //     .catch(err => {
        //     //         console.log(err);
        //     //     });

        //     // console.log(originalImgUrl);
        // })
        // console.log(imgS);
        // console.log('-----------------------------------------------------------');
        // 用元素审查分析html文件结构（见图 1）
        // 元素选择器获得所需要的结构的集合

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
        // // 结构分析在图 2
        // const $ = cheerio.load(detailHTML, {
        //     decodeEntities: false
        // });
        // // console.log($);

        // let img = {
        //     url: await $('#main #showcase .scrollbox .fill-horizontal').attr('src')
        // }
        // // console.log(img+'======');
        // // 去除空电影
        // // console.log(img.url);
        // return img.url ? img : undefined
    } catch (e) {
        console.log('Method: getDetailMessage =>' + e);
    }
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
        // 提取后缀名
        // let suffix = src.toString().slice(-4);
        // 拼接路径
        let path = photoSavePath + '/' + src.toString().slice(41);
        // 下载
        request.get(src, {
            timeout: timeout
        }, err => {
            err ? console.log('Method: downloadPhoto => download error\n' + err) : null;
        }).pipe(fs.createWriteStream(path));
    }
}


// axios
//     .get('https://wallhaven.cc/search?q=id%3A1&categories=110&purity=100&sorting=favorites&order=desc&pag=1&page=1')
//     .then((response) => {
//         console.log(response.data)


//     })
//     .catch((error) => {
//         console.error(error)
//     });