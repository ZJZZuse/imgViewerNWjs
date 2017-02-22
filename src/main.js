var running = false;
var fn = require('./nativeFn');
var async = require('../lib/async');
const path = require('path');

function main(changeImg, basePath) {


    var imgChangeInterval = 2 * 1000;

    if (basePath == undefined) {
        basePath = 'D:/abc/download/t/python files working/out';
    }

    var mainImgIndex = 1;

    if (changeImg == undefined) {
        changeImg = function (img, text) {
            console.log(mainImgIndex++ + ":", img, ';         text:', text);
        }
    }

    var paths = fn.acquireMainShuffledPaths(basePath);

    //展示幻灯片代码
    async.mapLimit(paths, 1, function (ele, callback) {

        var imgs = fn.acquireFilePaths(ele.fullPath);

        var length = imgs.length;

        imgs.sort(function (a, b) {

            if (a.name.indexOf('.jpg') == -1 || b.name.indexOf('.jpg') == -1) {
                return 1;
            }

            return Number.parseInt(path.basename(a.name, '.jpg')) - Number.parseInt(path.basename(b.name, '.jpg'));

        });

        async.mapLimit(imgs, 1, function (img, callbackImg) {

            if (!running) {
                callbackImg("stop");
                return;
            }

            if (img.name.indexOf('.jpg') == -1) {
                callbackImg(null, img.name);
                return;
            }

            changeImg(img.fullPath, ele.name + '-' + img.name);

            setTimeout(function () {
                callbackImg(null, img.name
                );
            }, imgChangeInterval);

        }, function (err, result) {

            if (err) {
                callback(err);
            }

            callback(err, {
                imgs: JSON.stringify(result),
                folder: ele.name
            });
        })

    }, function (err, result) {
        console.log('finished', {err: err, result: result});
    });
}

var basePath = 'D:/abc/download/t/python files working/out';

//main(undefined,basePath);


$(function () {

    //change the path to use
    //var basePath = 'D:/abc/download/t/python files working/out';

    $('#showBtn').click(function () {

        running = true;

        var inputBasePath = $('#basePathTextField').val();

        if (inputBasePath != undefined && inputBasePath != '') {
            basePath = inputBasePath;
        }


        main(function (img, text) {

            $('#imgText').text(text);
            $('#imgShower').attr('src', img);

        }, basePath);
    });

    $('#stopBtn').click(function () {

        running = false;

    });

});