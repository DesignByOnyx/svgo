'use strict';

// JS port from http://processingjs.nihongoresources.com/bezierinfo/

// Cubic Bézie

// compute the bounding box based on the straightened curve, for best fit
exports.computeCubicBoundingBox = function(xa, ya, xb, yb, xc, yc, xd, yd) {

    var minx = Number.POSITIVE_INFINITY,
        miny = Number.POSITIVE_INFINITY,
        maxx = Number.NEGATIVE_INFINITY,
        maxy = Number.NEGATIVE_INFINITY,
        ts,
        t,
        x,
        y,
        i;

    // X
    if (xa < minx) { minx = xa; }
    if (xa > maxx) { maxx = xa; }
    if (xd < minx) { minx= xd; }
    if (xd > maxx) { maxx = xd; }

    ts = computeCubicFirstDerivativeRoots(xa, xb, xc, xd);

    for (i = 0; i < ts.length; i++) {

        t = ts[i];

        if (t >= 0 && t <= 1) {
            x = computeCubicBaseValue(t, xa, xb, xc, xd);
            // y = computeCubicBaseValue(t, ya, yb, yc, yd);

            if (x < minx) { minx = x; }
            if (x > maxx) { maxx = x; }
        }

    }

    // Y
    if (ya < miny) { miny = ya; }
    if (ya > maxy) { maxy = ya; }
    if (yd < miny) { miny = yd; }
    if (yd > maxy) { maxy = yd; }

    ts = computeCubicFirstDerivativeRoots(ya, yb, yc, yd);

    for (i = 0; i < ts.length; i++) {

        t = ts[i];

        if (t >= 0 && t <= 1) {
            // x = computeCubicBaseValue(t, xa, xb, xc, xd);
            y = computeCubicBaseValue(t, ya, yb, yc, yd);

            if (y < miny) { miny = y; }
            if (y > maxy) { maxy = y; }
        }

    }

    return {
        minx: minx,
        miny: miny,
        maxx: maxx,
        maxy: maxy
    };

};

// compute the value for the cubic bezier function at time=t
function computeCubicBaseValue(t, a, b, c, d) {

    var mt = 1 - t;

    return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;

}

// compute the value for the first derivative of the cubic bezier function at time=t
function computeCubicFirstDerivativeRoots(a, b, c, d) {

    var result = [-1, -1],
        tl = -a + 2 * b - c,
        tr = -Math.sqrt(-a * (c - d) + b * b - b * (c + d) + c * c),
        dn = -a + 3 * b - 3 * c + d;

    if (dn !== 0) {
        result[0] = (tl + tr) / dn;
        result[1] = (tl - tr) / dn;
    }

    return result;

}

// Quadratic Bézier

// compute the bounding box based on the straightened curve, for best fit
exports.computeQuadraticBoundingBox = function(xa, ya, xb, yb, xc, yc) {

    var minx = Number.POSITIVE_INFINITY,
        miny = Number.POSITIVE_INFINITY,
        maxx = Number.NEGATIVE_INFINITY,
        maxy = Number.NEGATIVE_INFINITY,
        t,
        x,
        y;

    // X
    if (xa < minx) { minx = xa; }
    if (xa > maxx) { maxx = xa; }
    if (xc < minx) { minx = xc; }
    if (xc > maxx) { maxx = xc; }

    t = computeQuadraticFirstDerivativeRoot(xa, xb, xc);

    if (t >= 0 && t <= 1) {
        x = computeQuadraticBaseValue(t, xa, xb, xc);
        // y = computeQuadraticBaseValue(t, ya, yb, yc);

        if (x < minx) { minx = x; }
        if (x > maxx) { maxx = x; }
    }

    // Y
    if (ya < miny) { miny = ya; }
    if (ya > maxy) { maxy = ya; }
    if (yc < miny) { miny = yc; }
    if (yc > maxy) { maxy = yc; }

    t = computeQuadraticFirstDerivativeRoot(ya, yb, yc);

    if (t >= 0 && t <=1 ) {
        // x = computeQuadraticBaseValue(t, xa, xb, xc);
        y = computeQuadraticBaseValue(t, ya, yb, yc);

        if(y < miny) { miny = y; }
        if(y > maxy) { maxy= y ; }
    }

    return {
        minx: minx,
        miny: miny,
        maxx: maxx,
        maxy: maxy
    };

};

// compute the value for the quadratic bezier function at time=t
function computeQuadraticBaseValue(t, a, b, c) {

    var mt = 1 - t;

    return mt * mt * a + 2 * mt * t * b + t * t * c;

}

// compute the value for the first derivative of the quadratic bezier function at time=t
function computeQuadraticFirstDerivativeRoot(a, b, c) {

    var t = -1,
        denominator = a -2 * b + c;

    if (denominator !== 0) {
        t = (a - b) / denominator;
    }

    return t;

}
