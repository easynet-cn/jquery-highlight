/*
 * jQuery Highlight plugin
 *
 */

(function(factory) {
	if (typeof define === "function" && define.amd) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory);
	} else {

		// Browser globals
		factory(jQuery);
	}
}
		(function($) {
			'use strict';
			$.extend({
				highlight : function(node, patterns, nodeName) {
					var classes = $.map(patterns, function(index, element) {
						return element.class;
					});

					if (node.nodeType === 3) {
						for (var i = 0; i < patterns.length; i++) {
							var match = node.data.match(patterns[i].pattern);

							if (match) {
								var start = match.index;
								var length = match[0].length;
								var end = start + length;
								var highlight = document.createElement(nodeName
										|| 'span');

								for (var j = i + 1; j < patterns.length; j++) {
									var m = node.data
											.match(patterns[j].pattern);

									if (m) {
										var s = m.index;
										var l = m[0].length;
										var e = s + l;

										if ((s < end && s >= start)
												|| (e > start && e <= end)) {
											start = Math.min(start, s);
											end = Math.max(end, e);
											length = end - start;
										}
									}
								}

								highlight.className = patterns[i].class;

								var wordNode = node.splitText(start);

								wordNode.splitText(length);

								var wordClone = wordNode.cloneNode(true);

								highlight.appendChild(wordClone);
								wordNode.parentNode.replaceChild(highlight,
										wordNode);
							}
						}

						return 1; // skip added node in parent
					} else if ((node.nodeType === 1 && node.childNodes)
							&& // only element nodes that have children
							!/(script|style)/i.test(node.tagName)
							&& // ignore script and style nodes
							!(node.tagName === nodeName.toUpperCase() && $
									.inArray(node.className, classes) > -1)) { // skip
						// if
						// already
						// highlighted
						for (var j = 0; j < node.childNodes.length; j++) {
							j += $.highlight(node.childNodes[j], patterns,
									nodeName);
						}
					}
					return 0;
				}
			});
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

			function toPatterns(words, classes, flag) {
				var filterRegex = /[\·\…\—\~\`\!\@\#\$\%\^\&\(\)\-\_\+\=\|\\\[\]\{\}\;\:\"\'\,\<\.\>\/\–\s]/g;

				return $
						.map(
								words,
								function(word, i) {
									var pattern = '';
									word = toCDB(word);
									var iscj = isCJ(word);

									if (word[0] == '"'
											&& word[word.length - 1] == '"')
										word = word.substring(1,
												word.length - 1);

									pattern += '(';

									var endChar = word.charAt(word.length - 1)
											.toString();

									var tmp = endChar == '*' || endChar == '?' ? word
											.substring(0, word.length - 1)
											: word;

									if (null != iscj) {
										var replace = '[\\·\\…\\—\\~\\`\\!\\@\\#\\$\\%\\^\\&\\(\\)\\-\\_\\+\\=\\|\\\\\[\\]\\{\\}\\;\\:\\"\\\'\\,\\<\\.\\>\\/\\–\\s]{0,}';

										for (var j = 0; j < tmp.length; j++) {
											filterRegex.lastIndex = 0;
											var c = tmp[j].toString();
											var m = filterRegex.exec(c);

											if (null != m) {
												pattern += replace;
											} else if (j < tmp.length - 1) {
												pattern = pattern + c + replace;
											} else {
												pattern += c;
											}

										}
									} else {
										pattern += tmp.replace(filterRegex,
												"[^\\r\\na-z]{0,}")
									}

									var preChar = word.charAt(word.length - 2)
											.toString();
									var preiscj = isCJ(preChar);

									if (endChar == '*' || endChar == '?') {
										pattern = pattern.replace(/[*]/g,
												"[\\S]{0,}").replace(/[?]/g,
												"[\\S]{0,}");
										if (null == preiscj) {
											pattern += '[^\\·\\…\\—\\~\\`\\!\\@\\#\\$\\%\\^\\&\\(\\)\\-\\_\\+\\=\\|\\\\\[\\]\\{\\}\\;\\:\\"\\\'\\,\\<\\.\\>\\/\\–\\s\\u3000-\\u303f\\u3040-\\u309f\\u30a0-\\u30ff\\uff00-\\uff9f\\u4e00-\\u9faf\\u3400-\\u4dbf]';
										} else {
											pattern += '[\\u3000-\\u303f\\u3040-\\u309f\\u30a0-\\u30ff\\uff00-\\uff9f\\u4e00-\\u9faf\\u3400-\\u4dbf]';
										}

										if (endChar == '*')
											pattern += '{0,}';
										if (endChar == '?')
											pattern += '{0,1}';
									} else {
										pattern = pattern.replace(/[*]/g,
												"[\\S]{0,}").replace(/[?]/g,
												"[\\S]{0,}");
									}

									pattern += ')';

									if (null == iscj)
										pattern = '\\b' + pattern + '\\b';

									var cls = i % classes.length;

									return {
										'pattern' : new RegExp(pattern, flag),
										'class' : classes[cls]
									};
								});
			}

			$.fn.highlight = function(words, options) {
				var settings = $.extend({
					classes : [ 'highlight-1', 'highlight-2', 'highlight-3',
							'highlight-4', 'highlight-5', 'highlight-6',
							'highlight-7', 'highlight-8' ],
					element : 'span',
					caseSensitive : false,
					toPatterns : toPatterns
				}, options);

				if (words.constructor === String)
					words = [ words ];

				words = $.grep(words, function(word, i) {
					return word != '' && word != "*" && word != '?';
				});

				if (words.length == 0)
					return this;

				var classes = settings.classes;
				var element = settings.element;
				var flag = settings.caseSensitive ? '' : 'i';
				var func = settings.toPatterns;

				return this
						.each(function(i, item) {
							jQuery.highlight(this, func(words, classes, flag),
									element);
						});
			}
		}));
