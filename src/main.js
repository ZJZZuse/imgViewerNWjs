var running = false;
var fn = require('./nativeFn');
var async = require('../lib/async');
const path = require('path');

function main(changeImg, paths) {

    var mainImgIndex = 1;

    if (changeImg == undefined) {
        changeImg = function (img, text) {
            console.log(mainImgIndex++ + ":", img, ';         text:', text);
        }
    }

    savedObj.nextIndex = 0;

    //展示幻灯片代码
    async.mapLimit(paths, 1, function (ele, callback) {

        callbackT = function (err, ele) {
            savedObj.nextIndex++;
            callback(err, ele);
        }


        var imgs = fn.acquireFilePaths(ele.fullPath);

        var length = imgs.length;

        imgs.sort(function (a, b) {

            if (a.name.indexOf('.jpg') == -1 || b.name.indexOf('.jpg') == -1) {
                return 1;
            }

            return Number.parseInt(path.basename(a.name, '.jpg')) - Number.parseInt(path.basename(b.name, '.jpg'));

        });

        async.mapLimit(imgs, 1, function (img, callbackImg) {

            if (commondParam.showNextFolder) {
                commondParam.showNextFolder = false;
                //here may realized by exception
                callbackImg('showNextFolder', 'showNextFolder');
            }

            if (!running) {
                callbackImg("stop");
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

            if (err == 'showNextFolder'){
                callbackT(null, {
                    imgs: JSON.stringify(result),
                    folder: ele.name
                });
                return ;
            }

            callbackT(err, {
                imgs: JSON.stringify(result),
                folder: ele.name
            });
        })

    }, function (err, result) {
        console.log('finished', {err: err, result: result});
    });
}

var imgChangeInterval = 2 * 1000;

var commondParam = {

    showNextFolder: false

}

var basePath = 'D:/abc/download/t/python files working/out';

var savedObj = {
    basePath: '',
    paths: [],
    nextIndex: 0
}

//main(undefined,basePath);

// Listen to main window's close event
nw.Window.get().on('resize', function (width, height) {

    if (width < height) {
        $('#imgShower').removeAttr('height');
        $('#imgShower').attr('width', width);
        return;
    }

    $('#imgShower').removeAttr('width');
    $('#imgShower').attr('height', height - 50);
});


(function () {
    var option = {
        key: "Escape",
        active: function () {
            nw.Window.get().toggleFullscreen();
        },
        failed: function (msg) {
            console.log(msg);
        }
    };

    // Create a shortcut with |option|.
    var shortcut = new nw.Shortcut(option);

    // Register global desktop shortcut, which can work without focus.
    nw.App.registerGlobalHotKey(shortcut);


})();


$(function () {

    //change the path to use
    var basePath = 'D:/abc/download/t/python files working/out';

    $('#showBtn').click(function () {

        running = true;

        var inputBasePath = $('#basePathTextField').val();

        if (inputBasePath != undefined && inputBasePath != '') {
            basePath = inputBasePath;
        }

        var paths = fn.acquireMainShuffledPaths(basePath);

        savedObj.basePath = basePath;
        savedObj.paths = paths;

        main(function (img, text) {

            $('#imgText').text(text);
            $('#imgShower').attr('src', img);

        }, paths);
    });

    $('#stopBtn').click(function () {

        running = false;

    });

    $('#intervalSelect').change(function (event) {
        imgChangeInterval = $(this).val() * 1000;
    });

    $('#fullScreenBtn').click(function () {
        nw.Window.get().enterFullscreen();
    });

    $('#showNextFolderBtn').click(function () {

        commondParam.showNextFolder = true;

    });

    $('#imgShower').attr('height', nw.Window.get().height);


});