var selectCodeOn = true;
var ipsumCount = 6;
var content = 
{
 "htmlMT":"&lt;html&gt;<br>",
 "htmlIE":"&lt;!--[if lte IE 6]&gt;&lt;html class=\"preIE7 preIE8 preIE9\"&gt;&lt;![endif]--&gt;<br>&lt;!--[if IE 7]&gt;&lt;html class=\"preIE8 preIE9\"&gt;&lt;![endif]--&gt;<br>&lt;!--[if IE 8]&gt;&lt;html class=\"preIE9\"&gt;&lt;![endif]--&gt;<br>&lt;!--[if gte IE 9]&gt;&lt;!--&gt;&lt;html&gt;&lt;!--&lt;![endif]--&gt;<br>",
 "xua":"&nbsp;&nbsp;&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;<br>",
 "metas":"&nbsp;&nbsp;&lt;meta name=&quot;author&quot; content=&quot;<span class=\"edit\" onclick=\"editText('Enter author name',this);\">name</span>&quot;&gt;<br>&nbsp;&nbsp;&lt;meta name=&quot;description&quot; content=&quot;<span class=\"edit\" onclick=\"editText('Enter page description',this);\">description here</span>&quot;&gt;<br>",
 "favicon":"&nbsp;&nbsp;&lt;link rel=&quot;shortcut icon&quot; href=&quot;<span class=\"edit\" onclick=\"editText('Enter favicon URL',this);\">favicon.ico</span>&quot; type=&quot;image/vnd.microsoft.icon&quot;&gt;<br>",
 "webfonts":"&nbsp;&nbsp;&lt;link rel='stylesheet' href='//fonts.googleapis.com/css?family=<span class=\"edit\" onclick=\"editText('Enter font names',this);\">font1|font2|etc</span>' type='text/css'&gt;<br>",
 "linkedcss":"&nbsp;&nbsp;&lt;link rel=&quot;stylesheet&quot; href=&quot;<span class=\"edit\" onclick=\"editText('Enter stylesheet URL',this);\">stylesheet.css</span>&quot; type=&quot;text/css&quot;&gt;<br>",
 "embeddedcss":"&nbsp;&nbsp;&lt;style type=&quot;text/css&quot;&gt;<br>&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&lt;/style&gt;<br>",
 "analytics":"&nbsp;&nbsp;&lt;script type=&quot;text/javascript&quot;&gt;<br/>&nbsp;&nbsp;&nbsp;var _gaq = _gaq || [];<br/>&nbsp;&nbsp;&nbsp;_gaq.push(['_setAccount', '<span class=\"edit\" onclick=\"editText('Enter tracking ID',this);\">UA-XXXXXXXX-Y</span>']);<br/>&nbsp;&nbsp;&nbsp;_gaq.push(['_trackPageview']);<br/>&nbsp;&nbsp;&nbsp;(function()<br/>&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;<br/>&nbsp;&nbsp;&nbsp;&nbsp;ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';<br/>&nbsp;&nbsp;&nbsp;&nbsp;var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);<br/>&nbsp;&nbsp;&nbsp;})();<br/>&nbsp;&nbsp;&lt;/script&gt;<br/>",
 "jquery":"&nbsp;&nbsp;&lt;script src=&quot;//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;<br>",
 "jqueryui":"&nbsp;&nbsp;&lt;script src=&quot//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;<br>",
 "dojo":"&nbsp;&nbsp;&lt;script src=&quot;//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojo/dojo.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;<br>",
 "mootools":"&nbsp;&nbsp;&lt;script src=&quot;//ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;<br>",
 "prototype":"&nbsp;&nbsp;&lt;script src=&quot;//ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;<br>",
 "modernizr":"&nbsp;&nbsp;&lt;script src=&quot;//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;<br>",
 "domready":"&nbsp;&nbsp;&lt;script type=&quot;text/javascript&quot;&gt;<br>&nbsp;&nbsp;&nbsp;function autorun()<br>&nbsp;&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;if (document.addEventListener) document.addEventListener(&quot;DOMContentLoaded&quot;, autorun, false);<br>&nbsp;&nbsp;&nbsp;else if (document.attachEvent) document.attachEvent(&quot;onreadystatechange&quot;, autorun);<br>&nbsp;&nbsp;&nbsp;else window.onload = autorun;<br>&nbsp;&nbsp;&lt;/script&gt;<br>",
 "pageloaded":"&nbsp;&nbsp;&lt;script type=&quot;text/javascript&quot;&gt;<br>&nbsp;&nbsp;&nbsp;function autorun()<br>&nbsp;&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;if (window.addEventListener) window.addEventListener(&quot;load&quot;, autorun, false);<br>&nbsp;&nbsp;&nbsp;else if (window.attachEvent) window.attachEvent(&quot;onload&quot;, autorun);<br>&nbsp;&nbsp;&nbsp;else window.onload = autorun;<br>&nbsp;&nbsp;&lt;/script&gt;<br>"
};
var ipsumContent = 
{
 "ipsum1":"<br/>Ut id aliis narrare gestiant? Proclivi currit oratio. Easdemne res? Erat enim Polemonis. Sed plane dicit quod intellegit. Sed vos squalidius, illorum vides quam niteat oratio.<br/>",
 "ipsum2":"<br/>Proclivi currit oratio. Audeo dicere, inquit. Sed quid sentiat, non videtis. Satis est ad hoc responsum. Confecta res esset. Quamquam te quidem video minime esse deterritum. Quid sequatur, quid repugnet, vident.<br/>",
 "ipsum3":"<br/>Tamen a proposito, inquam, aberramus. Qui-vere falsone, quaerere mittimus-dicitur oculis se privasse; Quibus ego vehementer assentior. At certe gravius. Vide, quantum, inquam, fallare, Torquate.<br/>",
 "ipsum4":"<br/>Non est igitur voluptas bonum. Est enim effectrix multarum et magnarum voluptatum. Quare attende, quaeso. Praeteritis, inquit, gaudeo. Immo videri fortasse.<br/>",
 "ipsum5":"<br/>At ille pellit, qui permulcet sensum voluptate. Falli igitur possumus. Iam enim adesse poterit. Age, inquies, ista parva sunt. Sequitur disserendi ratio cognitioque naturae; Pauca mutat vel plura sane;<br/>",
 "ipsum6":"<br/>Nemo igitur esse beatus potest. Iam id ipsum absurdum, maximum malum neglegi. Idem iste, inquam, de voluptate quid sentit? Haeret in salebra. Et quidem, inquit, vehementer errat; Quis istud possit, inquit, negare?<br/>",
 "ipsum7":"<br/>Audeo dicere, inquit. Cur iustitia laudatur? Erat enim Polemonis. Quae similitudo in genere etiam humano apparet. Sumenda potius quam expetenda. Venit ad extremum; Sed ille, ut dixi, vitiose. Proclivi currit oratio.<br/>",
 "ipsum8":"<br/>Duo Reges: constructio interrete. Quod quidem nobis non saepe contingit. Nihilo magis. Quid me istud rogas? Quantum Aristoxeni ingenium consumptum videmus in musicis?<br/>",
 "ipsum9":"<br/>Comprehensum, quod cognitum non habet? Sumenda potius quam expetenda. Quaerimus enim finem bonorum. Laboro autem non sine causa; Sint ista Graecorum; Utram tandem linguam nescio?<br/>",
};

$(function()
{
 if(window.getSelection)
 {
  $(".selectHintText").css("display", "inline");
 }
});

function selectCode(target)
{
 if(window.getSelection && selectCodeOn)
 {
  var codeRange = document.createRange();
  codeRange.selectNodeContents(target);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(codeRange);
 }
 else
 {
  selectCodeOn = true;
 }
}

function editText(message, span)
{
 var newString = prompt(message, $(span).text());
 if(newString != "" && newString != null) $(span).text(newString);
 selectCodeOn = false;
}

function selectOption(selectedElement, deselectedElementList, showSpanNameList, hideSpanNameList)
{
  $(selectedElement).addClass("selectedOption").removeClass("deselectedOption");
  $.each(deselectedElementList, function(index, elementName)
  {
   $("#" + elementName).addClass("deselectedOption").removeClass("selectedOption");
  });
  $.each(showSpanNameList, function(index, spanName)
  {
   $("#" + spanName + "-span").html(content[spanName]).slideDown();
  });
  $.each(hideSpanNameList, function(index, spanName)
 {
  $("#" + spanName + "-span").slideUp(function()
  {
   $("#" + spanName + "-span").html("");
  });
 });
}

function showMore()
{
 if(ipsumCount < 10)
 {
  $("#ipsum" + ipsumCount).html(ipsumContent["ipsum" + ipsumCount++]).slideDown();
  $("#less").addClass("enabled").removeClass("disabled");
 }
 if(ipsumCount == 10)
 {
  $("#more").addClass("disabled").removeClass("enabled");
 }
}

function showLess()
{
 if(ipsumCount > 1)
 {
  $("#ipsum" + --ipsumCount).slideUp(function()
  {
   $("#ipsum" + ipsumCount).html("");
  });
  $("#more").addClass("enabled").removeClass("disabled");
 }
 if(ipsumCount == 1)
 {
  $("#less").addClass("disabled").removeClass("enabled");
 }
}