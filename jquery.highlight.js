/*
 * jQuery Highlight plugin
 *
 */

+function ($) {
    'use strict';

    $.extend({
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
                    !(node.tagName === nodeName.toUpperCase() && $.inArray(className, classes) > -1)) { // skip if already highlighted
                for (var j = 0; j < node.childNodes.length; j++) {
                    j += $.highlight(node.childNodes[j], patterns, classes, nodeName);
                }
            }
            return 0;
        }
    });

    $.fn.highlight = function (words, options) {
        var settings = $.extend({
            classes: ['highlight-1', 'highlight-2', 'highlight-3', 'highlight-4', 'highlight-5', 'highlight-6', 'highlight-7', 'highlight-8'],
            element: 'span',
            caseSensitive: false,
            wordsOnly: false
        }, options);

        if (words.constructor === String) words = [words];

        words = $.grep(words, function (word, i) {
            return word != '';
        });

        words = $.map(words, function (word, i) {
            return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        });

        if (words.length == 0) return this;

        var wordsLen = words.length;
        var patterns = new Array();
        var classes = new Array();
        var flag = settings.caseSensitive ? "" : "i";

        for (var i = 0; i < wordsLen; i++) {
            var pattern = "(" + words[i] + ")";

            if (settings.wordsOnly) pattern = "\\b" + pattern + "\\b";

            patterns[i] = new RegExp(pattern, flag);
            classes[i] = i < settings.classes.length ? settings.classes[i] : settings.classes[parseInt(Math.random() * settings.classes.length)];

        }

        return this.each(function (i, item) {
            jQuery.highlight(this, patterns, classes, settings.element);
        });
    }
}(jQuery);

