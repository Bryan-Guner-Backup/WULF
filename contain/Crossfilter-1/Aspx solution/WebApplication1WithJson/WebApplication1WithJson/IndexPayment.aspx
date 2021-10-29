<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="IndexPayment.aspx.cs" Inherits="WebApplication1WithJson.IndexPayment" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>

    <form id="form1" runat="server">

    <input type="button" id="Button1" value="Get Payment" />
    <div id="output"></div>
    </form>
    <link href="Content/dc.css" rel="stylesheet" />
    <link href="Content/style.css" rel="stylesheet" />
    <script type="text/javascript" src="Scripts/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="Scripts/mapreduce.js"></script>
    <script type="text/javascript" src="Scripts/crossfilter.v1.min.js"></script>
    <script type="text/javascript" src="Scripts/crossfilter.v1.js"></script>
    <script type="text/javascript" src="Scripts/d3.v3.min.js"></script>
    <script type="text/javascript" src="Scripts/d3.v3.js"></script>
    <script type="text/javascript" src="Scripts/dc.js"></script>
    <script type="text/javascript" src="Scripts/cross.js"></script>
    <script type="text/javascript">
        $(function () {
            $('#Button1').click(getPayment);
        });

</script>
    <p>ss</p>
    <div id="charts">

<div class="dc-data-count" >
<h2>
<span>
<span class="filter-count"></span>
selected out of
<span class="total-count"></span>
records |
<a href="javascript:dc.filterAll(); dc.renderAll();">Reset All</a>
</span>
</h2>
</div>
     <div class='span4' id='dayChart'>

</div>


<div class='span4' id='dayChart2'>
	<h3>Day of Week
	<span>
	<a class="reset"
		href="javascript:dayOfWeekChart.filterAll();dc.redrawAll();"
		style="display:none;">
		reset
	</a>
	</span>
	</h3>
</div>

<div id='dayChart3'>
	<h3>Time of Day
	<span>
	<a class="reset"
		href="javascript:hoursOfDay.filterAll();dc.redrawAll();"
		style="display:none;">
		reset
	</a>
	</span>
	</h3>
</div>


<div id='dayChart4'>
<h3>Payment Amount
	<span>
	<a class="reset"
		href="javascript:paymentAmounts.filterAll();dc.redrawAll();"
		style="display:none;">
		reset
	</a>
	</span>
	</h3>
</div>


<div id='dayChart5'>
<h3>Payment type
	<span>
	<a class="reset"
		href="javascript:paymentTypes.filterAll();dc.redrawAll();"
		style="display:none;">
		reset
	</a>
	</span>
	</h3>
	
	

</div>
    
</div>

<div class='container' style='font: 12px sans-serif;'>

<div class='row'>
<div class='span6' id='dc-magnitude-chart'>
<h4></h4>
</div>
<div class='span6' id='blank'>
<h4></h4>
</div>
</div>
<div id="lists">
  <div id="Sales-list" class="list"></div>
  <div id="Transaction-list" class="list"></div>
</div>
    </div>
</body>
</html>
