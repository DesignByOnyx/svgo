'use strict';

var collections = require('./_collections'),
    elems = collections.elems,
    attrsGroups = collections.attrsGroups,
    elemsGroups = collections.elemsGroups,
    attrsGroupsDefaults = collections.attrsGroupsDefaults;

// collect and extend all references
for (var elem in elems) {
    elem = elems[elem];

    if (elem.attrsGroups) {
        elem.attrs = elem.attrs || [];

        elem.attrsGroups.forEach(function(attrsGroupName) {
            elem.attrs = elem.attrs.concat(attrsGroups[attrsGroupName]);

            var groupDefaults = attrsGroupsDefaults[attrsGroupName];

            if (groupDefaults) {
                elem.defaults = elem.defaults || {};

                for(var attrName in groupDefaults) {
                    elem.defaults[attrName] = groupDefaults[attrName];
                }
            }
        });

    }

    if (elem.contentGroups) {
        elem.content = elem.content || [];

        elem.contentGroups.forEach(function(contentGroupName) {
            elem.content = elem.content.concat(elemsGroups[contentGroupName]);
        });
    }
}

/**
 * Remove unknown elements content and attributes,
 * remove attributes with default values.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.removeUnknownsAndDefaults = function(item, params) {

    // elems w/o namespace prefix
    if (item.isElem() && !item.prefix) {

        var elem = item.elem;

        // remove SVG id attr
        if (params.SVGid && elem === 'svg') {
            item.removeAttr('id');
        }

        // remove unknown element's content
        if (
            params.unknownContent &&
            !item.isEmpty() &&
            elems[elem].content
        ) {
            item.content.forEach(function(content, i) {
                if (
                    content.isElem() &&
                    !content.prefix &&
                    elems[elem].content.indexOf(content.elem) === -1
                ) {
                    item.content.splice(i, 1);
                }
            });
        }

        // remove element's unknown attrs and attrs with default values
        if (elems[elem].attrs) {

            item.eachAttr(function(attr) {

                if (
                    attr.name !== 'xmlns' &&
                    (attr.prefix === 'xml' || !attr.prefix)
                ) {
                    if (
                        // unknown attrs
                        (params.unknownAttrs &&
                         elems[elem].attrs.indexOf(attr.name) === -1) ||
                        // attrs with default values
                        (params.defaultAttrs &&
                         elems[elem].defaults &&
                         elems[elem].defaults[attr.name] === attr.value
                         )
                    ) {
                        item.removeAttr(attr.name);
                    }
                }

            });

        }

    }

};