/*
 * jQuery Highlight plugin
 *
 */

jQuery.extend({
    highlight: function (node, patterns, classes, nodeName) {
        if (node.nodeType === 3) {
            for (var i = 0 ; i < patterns.length; i++) {
                var match = node.data.match(patterns[i]);
                if (match) {
                    var highlight = document.createElement(nodeName || 'span');

                    highlight.className = classes[i];

                    var wordNode = node.splitText(match.index);

                    wordNode.splitText(match[0].length);

                    var wordClone = wordNode.cloneNode(true);

                    highlight.appendChild(wordClone);
                    wordNode.parentNode.replaceChild(highlight, wordNode);
                }
            }

            return 1; //skip added node in parent
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && $.inArray(node.className, classes) > -1)) { // skip if already highlighted
            for (var j = 0; j < node.childNodes.length; j++) {
                j += $.highlight(node.childNodes[j], patterns, classes, nodeName);
            }
        }
        return 0;
    }
});

+function ($) {
    'use strict';

    var cjReg = /[\u3100-\u312f\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\u3300-\u337f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff65-\uff9f]/gi;

    function isCJ(str) {
        return cjReg.exec(str);
    }

    $.fn.highlight = function (words, options) {
        var settings = $.extend({
            classes: ['highlight-1', 'highlight-2', 'highlight-3', 'highlight-4', 'highlight-5', 'highlight-6', 'highlight-7', 'highlight-8'],
            element: 'span',
            caseSensitive: false
        }, options);

        if (words.constructor === String) words = [words];

        words = $.grep(words, function (word, i) {
            return word != '';
        });

        if (words.length == 0) return this;

        var classes = new Array();
        var flag = settings.caseSensitive ? '' : 'i';

        words = $.map(words, function (word, i) {
            var pattern = '(' + word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + ')';

            if (!isCJ(word)) pattern = '\\b' + pattern + '\\b';

            classes[i] = i < settings.classes.length ? settings.classes[i] : settings.classes[parseInt(Math.random() * settings.classes.length)];

            return new RegExp(pattern, flag);
        });

        return this.each(function (i, item) {
            jQuery.highlight(this, words, classes, settings.element);
        });
    }
}(jQuery);

