'use strict';

var relative2absolute = require('./_path.js').relative2absolute,
    computeCubicBoundingBox = require('./_path.js').computeCubicBoundingBox,
    computeQuadraticBoundingBox = require('./_path.js').computeQuadraticBoundingBox,
    applyTransforms = require('./_path.js').applyTransforms,
    js2path = require('./_path.js').js2path,
    extend = require('../lib/svgo/tools').extend;

exports.trimWidthAlongPath = function(data, params) {

    data.content.forEach(function(item) {

        if (item.isElem('svg') &&
            item.content.length === 1 &&
            item.content[0].isElem('path')
        ) {

            var svgElem = item,
                pathElem = svgElem.content[0],
                path = relative2absolute(extend(true, [], pathElem.pathJS)),
                xs = [],
                ys = [],
                prevPoint = [0, 0],
                controlPoint,
                cubicBoundingBox,
                quadraticBoundingBox;

            path.forEach(function(pathItem) {

                if (pathItem.instruction === 'ML') {

                    pathItem.data.forEach(function(d, i) {

                        if (i % 2 === 0) {
                            xs.push(d);
                        } else {
                            ys.push(d);
                        }

                    });

                } else if (pathItem.instruction === 'H') {

                    xs.push(pathItem.data[0]);

                } else if (pathItem.instruction === 'V') {

                    ys.push(pathItem.data[0]);

                } else if (pathItem.instruction === 'C') {

                    cubicBoundingBox = computeCubicBoundingBox.apply(this, prevPoint.concat(pathItem.data));

                    xs.push(cubicBoundingBox.minx);
                    xs.push(cubicBoundingBox.maxx);

                    ys.push(cubicBoundingBox.miny);
                    ys.push(cubicBoundingBox.maxy);

                    controlPoint = [
                        pathItem.data[2] + 2 * (pathItem.point[0] - pathItem.data[2]),
                        pathItem.data[3] + 2 * (pathItem.point[1] - pathItem.data[3])
                    ];

                } else if (pathItem.instruction === 'S') {

                    cubicBoundingBox = computeCubicBoundingBox.apply(this, prevPoint.concat(controlPoint).concat(pathItem.data));

                    xs.push(cubicBoundingBox.minx);
                    xs.push(cubicBoundingBox.maxx);

                    ys.push(cubicBoundingBox.miny);
                    ys.push(cubicBoundingBox.maxy);

                    controlPoint = [
                        pathItem.data[0] + 2 * (pathItem.point[0] - pathItem.data[0]),
                        pathItem.data[1] + 2 * (pathItem.point[1] - pathItem.data[1])
                    ];

                } else if (pathItem.instruction === 'Q') {

                    quadraticBoundingBox = computeQuadraticBoundingBox.apply(this, prevPoint.concat(pathItem.data));

                    xs.push(quadraticBoundingBox.minx);
                    xs.push(quadraticBoundingBox.maxx);

                    ys.push(quadraticBoundingBox.miny);
                    ys.push(quadraticBoundingBox.maxy);

                    controlPoint = [
                        pathItem.data[2] + 2 * (pathItem.data[2] - pathItem.data[0]),
                        pathItem.data[3] + 2 * (pathItem.data[3] - pathItem.data[1])
                    ];

                } else if (pathItem.instruction === 'T') {

                    quadraticBoundingBox = computeQuadraticBoundingBox.apply(this, prevPoint.concat(controlPoint).concat(pathItem.data));

                    xs.push(quadraticBoundingBox.minx);
                    xs.push(quadraticBoundingBox.maxx);

                    ys.push(quadraticBoundingBox.miny);
                    ys.push(quadraticBoundingBox.maxy);

                }

                if (pathItem.data) {

                    prevPoint = pathItem.point;

                }

            });

            var xmin = Math.min.apply(this, xs),
                xmax = Math.max.apply(this, xs),
                ymin = Math.min.apply(this, ys),
                ymax = Math.max.apply(this, ys),
                width = xmax - xmin,
                height = ymax - ymin;

            console.log(width + ' / ' + height);

            pathElem.addAttr({
                name: 'transform',
                prefix: '',
                local: 'transform',
                value: 'translate(-' + xmin + ' 0)'
            });

            path = js2path(applyTransforms(pathElem, pathElem.pathJS), params);

            pathElem.attr('d').value = path;

            svgElem.attr('width').value = width;

        }

    });

    return data;

};
