/*
 * jQuery Highlight plugin
 *
 */

jQuery.extend({
	highlight : function(node, patterns, classes, nodeName) {
		if (node.nodeType === 3) {
			for (var i = 0; i < patterns.length; i++) {
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

			return 1; // skip added node in parent
		} else if ((node.nodeType === 1 && node.childNodes)
				&& // only element nodes that have children
				!/(script|style)/i.test(node.tagName)
				&& // ignore script and style nodes
				!(node.tagName === nodeName.toUpperCase() && $.inArray(
						node.className, classes) > -1)) { // skip if already
			// highlighted
			for (var j = 0; j < node.childNodes.length; j++) {
				j += $.highlight(node.childNodes[j], patterns, classes,
						nodeName);
			}
		}
		return 0;
	}
});

+function($) {
	'use strict';

	var cjReg = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/i;

	function isCJ(str) {
		return cjReg.exec(str);
	}

	function toCDB(str) {
		var tmp = "";
		for (var i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
				tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
			} else {
				tmp += String.fromCharCode(str.charCodeAt(i));
			}
		}
		return tmp
	}

	$.fn.highlight = function(words, options) {
		var settings = $
				.extend(
						{
							classes : [ 'highlight-1', 'highlight-2',
									'highlight-3', 'highlight-4',
									'highlight-5', 'highlight-6',
									'highlight-7', 'highlight-8' ],
							element : 'span',
							caseSensitive : false,
							filterRegex : /[\·\…\—\~\`\!\@\#\$\%\^\&\(\)\-\_\+\=\|\\\[\]\{\}\;\:\"\'\,\<\.\>\/\s]/g
						}, options);

		if (words.constructor === String)
			words = [ words ];

		words = $.grep(words, function(word, i) {
			return word != '' && word != "*";
		});

		if (words.length == 0)
			return this;

		var classes = new Array();
		var flag = settings.caseSensitive ? '' : 'i';

		words = $.map(words, function(word, i) {
			var pattern = '';
			word = toCDB(word);

			if (word[0] == '"' && word[word.length - 1] == '"')
				word = word.substring(1, word.length - 1);

			pattern = '('
					+ word.replace(settings.filterRegex, "[^\\r\\n]").replace(
							/[*]/g, "[\\S]{0,}").replace(/[?]/g, "[\\S]{0,}")
					+ ')';
			if (null == isCJ(word))
				pattern = '\\b' + pattern + '\\b';

			classes[i] = i < settings.classes.length ? settings.classes[i]
					: settings.classes[parseInt(Math.random()
							* settings.classes.length)];

			return new RegExp(pattern, flag);
		});

		return this.each(function(i, item) {
			jQuery.highlight(this, words, classes, settings.element);
		});
	}
}(jQuery);
