require.config({
	baseUrl : ".",
	paths : {
		"jquery" : "jquery-1.11.2.min",
		"highlight" : "jquery.highlight"
	}

});

require(
		[ 'jquery', 'highlight' ],
		function($) {
			$(function() {
				$('.highlight').each(function(i, item) {
					var id = $(item).prop('id');
					var words = $('#' + id + '-words').text().split(',');
					$(item).highlight(words);
				});
				$('#btn-highlight').click(
						function() {
							$('#txt-highlight').html($('#txt').val());
							$('#txt-highlight').highlight(
									$('#txt-words').val().split(','));

						});

				function toPatterns(words, classes, flag) {
					var cjReg = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/i;
					var isCJ = function(str) {
						return cjReg.exec(str);
					}
					var toCDB = function(str) {
						var tmp = "";
						for (var i = 0; i < str.length; i++) {
							if (str.charCodeAt(i) > 65248
									&& str.charCodeAt(i) < 65375) {
								tmp += String
										.fromCharCode(str.charCodeAt(i) - 65248);
							} else {
								tmp += String.fromCharCode(str.charCodeAt(i));
							}
						}
						return tmp
					}
					var cls = new Array();
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

										var endChar = word.charAt(
												word.length - 1).toString();

										var tmp = endChar == '*'
												|| endChar == '?' ? word
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
													pattern = pattern + c
															+ replace;
												} else {
													pattern += c;
												}

											}
										} else {
											pattern += tmp.replace(filterRegex,
													"[^\\r\\na-z]{0,}")
										}

										var preChar = word.charAt(
												word.length - 2).toString();
										var preiscj = isCJ(preChar);

										if (endChar == '*' || endChar == '?') {
											pattern = pattern.replace(/[*]/g,
													"[\\S]{0,}").replace(
													/[?]/g, "[\\S]{0,}");
											pattern += '[\\S]';

											if (endChar == '*')
												pattern += '{0,}';
											if (endChar == '?')
												pattern += '{0,1}';
										} else {
											pattern = pattern.replace(/[*]/g,
													"[\\S]{0,}").replace(
													/[?]/g, "[\\S]{0,}");
										}

										pattern += ')';

										if (null == iscj)
											pattern = '\\b' + pattern + '\\b';

										var cls = i < classes.length ? classes[i]
												: classes[parseInt(Math
														.random()
														* (classes.length - 1))];

										return {
											'pattern' : new RegExp(pattern,
													flag),
											'class' : cls
										};
									});
				}
				$('#ipc-txt').highlight($('#ipc-words').text().split(','), {
					toPatterns : toPatterns
				});
			});
		});