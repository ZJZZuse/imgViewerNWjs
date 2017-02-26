var running = false;
var fn = require('./nativeFn');
var async = require('../lib/async');
const path = require('path');
const storeUtil = require('../lib/myLib/storeUtil');

function main(changeImg, paths) {

    var mainImgIndex = 1;

    if (changeImg == undefined) {
        changeImg = function (img, text) {
            console.log(mainImgIndex++ + ":", img, ';         text:', text);
        }
    }

    //展示幻灯片代码
    async.mapLimit(paths, 1, function (ele, callback) {

        callbackT = function (err, ele) {
            savedObj.viewedSubs.push(ele.name);
            saveImgViewingState();
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
                return;
            }

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

            var backObj = {
                imgs: JSON.stringify(result),
                name: ele.name
            };

            if (err == 'showNextFolder') {

                callbackT(null, backObj);
                return;
            }

            callbackT(err, backObj);
        })

    }, function (err, result) {
        console.log('finished', {err: err, result: result});
    });
}

var imgChangeInterval = 2 * 1000;

var commondParam = {
    showNextFolder: false
};

var savedObj = {
    viewedSubs: [],
    basePath: ''
};

function saveImgViewingState(){
    if (savedObj.basePath == '') {
        return;
    }
    storeUtil.save(savedObj.basePath, savedObj);
}

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



    nw.Window.get().on('closed', function () {
        saveImgViewingState();
    });

    nw.Window.get().on('loaded', function () {
        setImgShower(this.width, this.height);
    });

    function setImgShower(width, height) {

        if (width < height) {
            $('#imgShower').removeAttr('height');
            $('#imgShower').attr('width', width);
            return;
        }
        $('#imgShower').removeAttr('width');
        $('#imgShower').attr('height', height - 150);
    }

    nw.Window.get().on('resize', function (width, height) {
        setImgShower(width, height);
    });

})();


$(function () {

    var basePath = 'D:/abc/download/t/python files working/out';

    $('#showBtn').click(function () {

        running = true;

        var inputBasePath = $('#basePathTextField').val();

        if (inputBasePath != undefined && inputBasePath != '') {
            basePath = inputBasePath;
        }

        savedObj = storeUtil.acquire(basePath, {
            viewedSubs: [],
            basePath: basePath
        });

        var paths = fn.acquireMainShuffledPaths(basePath);

        var pathsToDo = [];

        paths.forEach(function (ele, index) {

            //已经处理的就结束
            for (var i = 1; i < savedObj.viewedSubs.length; i++) {
                if (ele.name == savedObj.viewedSubs[i]) {
                    return;
                }
            }

            pathsToDo.push(ele);

        });

        main(function (img, text) {

            $('#imgText').text(text);
            $('#imgShower').attr('src', img);

        }, pathsToDo);
    });

    $('#stopBtn').click(function () {

        running = false;
        saveImgViewingState();

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