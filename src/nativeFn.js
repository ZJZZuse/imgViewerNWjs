
(function () {

    const fs = require('fs');
    const path = require('path');

    function shuffle(a) {
        var len = a.length;
        for (var i = 0; i < len - 1; i++) {
            var index = parseInt(Math.random() * (len - i));
            var temp = a[index];
            a[index] = a[len - i - 1];
            a[len - i - 1] = temp;
        }
    }

    function acquireFilePaths(patht) {
        var imgs = fs.readdirSync(patht);

        var length2 = imgs.length;

        var result = [];

        for (var j = 0; j < length2; j++) {
            var imgPath = path.join(patht, imgs[j]);


            result.push({

                name: imgs[j],
                fullPath: imgPath

            });
        }

        return result;
    }

    function acquireMainShuffledPaths(basePath) {
        var files = fs.readdirSync(basePath);
        shuffle(files);

        var result = [];

        files.forEach(function (ele, index, array) {

            var eleFullPath = path.join(basePath, ele);


            result.push({

                name: files[index],
                fullPath: eleFullPath

            });
        });


        return result;
    }

    module.exports = {
        acquireMainShuffledPaths: acquireMainShuffledPaths,
        acquireFilePaths: acquireFilePaths
    };

})();














