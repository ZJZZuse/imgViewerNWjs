
function main(changeImg, basePath) {
    var fn = require('./nativeFn');
    var async = require('../lib/async');

    var imgChangeInterval = 2 * 1000;

    if (basePath == undefined) {
        basePath = 'D:/abc/download/t/python files working/out';
    }

    var mainImgIndex = 1;

    if (changeImg == undefined) {
        function changeImg(img, text) {

            console.log(mainImgIndex++ + ":", img, ';         text:', text);
        }
    }

    var paths = fn.acquireMainShuffledPaths(basePath);

    //展示幻灯片代码
    async.mapLimit(paths, 1, function (ele, callback) {

        var imgs = fn.acquireFilePaths(ele.fullPath);

        var length = imgs.length;

        async.mapLimit(imgs, 1, function (img, callbackImg) {

            changeImg(img.fullPath, ele.name + '-' + img.name);

            setTimeout(function () {
                callbackImg(null, img.name
                );
            }, imgChangeInterval);

        }, function (err, result) {
            callback(err, {
                imgs: JSON.stringify(result),
                folder: ele.name
            });
        })

    }, function (err, result) {
        console.log('finished', {err: err, result: result});
    });
}


// main();


$(function () {

    //change the path to use
    var basePath = 'D:/abc/download/t/python files working/out';

    $('#showBtn').click(function () {
        main(function (img, text) {

            $('#imgText').text(text);
            $('#imgShower').attr('src', img);

        }, basePath);
    });

});