
	var payments = [
		{date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, discounts: 200, refunds:0, Tax:0, type: "visa"},
		{date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, discounts: 100, refunds:0, Tax:0, type: "tab"},
		{date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, discounts: 100, refunds:0, Tax:0, type: "tab"},
		{date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, discounts: 200, refunds:0, Tax:0, type: "visa"},
		{date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, discounts: 0, refunds:0, Tax:0, type: "tab"},
		{date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, discounts: 0, refunds:0, Tax:0, type: "tab"},
		{date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, discounts: 0, refunds:0, Tax:0, type: "tab"},
		{date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, discounts: 0, refunds:0, Tax:0, type: "cash"},
		{date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, discounts: 0, refunds:0, Tax:0, type: "tab"},
		{date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, discounts: 0, refunds:0, Tax:0, type: "tab"},
		{date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, discounts: 100, refunds:0, Tax:0, type: "visa"},
		{date: "2011-11-14T12:22:59Z", quantity: 2, total: 90, discounts: 0, refunds:0, Tax:0, type: "tab"},
		{date: "2011-11-14T13:25:45Z", quantity: 2, total: 200, discounts: 0, refunds:0, Tax:0, type: "cash"},
		{date: "2011-11-15T17:29:52Z", quantity: 1, total: 200, discounts: 100, refunds:0, Tax:0, type: "visa"},
		{date: "2011-11-17T16:17:54Z", quantity: 2, total: 190, discounts: 100, refunds:0, Tax:0, type: "tab"},
		{date: "2011-11-20T16:20:19Z", quantity: 2, total: 190, discounts: 100, refunds:0, Tax:0, type: "tab"},
		{date: "2011-11-21T16:17:54Z", quantity: 2, total: 1000, discounts: 100, refunds:0, Tax:0, type: "tab"},
		{date: "2011-11-22T16:20:19Z", quantity: 2, total: 700, discounts: 100, refunds:0, Tax:0, type: "tab"}
		
		];
	
	var data = crossfilter(payments);
	var all = data.groupAll();

	var dateFormat = d3.time.format("%Y-%m-%d");
	var dateFormat2 = d3.time.format("%Y-%m-%dT%H:%M:%S");
	
	var days = data.dimension(function(d) {
		return date = d3.time.day(dateFormat2.parse(d.date.substr(0,19)));
    });
	
	var volumeByHour = data.dimension(function(d) {
		return d3.time.hour(dateFormat2.parse(d.date.substr(0,19)));
    });
	
	var dayOfWeek = data.dimension(function (d) {
	var day = d3.time.day(dateFormat2.parse(d.date.substr(0,19))).getDay();
		switch (day) {
			case 0:
		return "0.Sun";
			case 1:
		return "1.Mon";
			case 2:
		return "2.Tue";
			case 3:
		return "3.Wed";
			case 4:
		return "4.Thu";
			case 5:
		return "5.Fri";
			case 6:
		return "6.Sat";
		}
	});
	
	var timeOfDay = data.dimension(function (d) {
	var hour = d3.time.hour(dateFormat2.parse(d.date.substr(0,19))).getHours();

		switch (hour) {
			case 0:
		return "0.12 am";
			case 1:
		return "1.1 am";
			case 2:
		return "2.2 am";
			case 3:
		return "3.3 am";
			case 4:
		return "4.4 am";
			case 5:
		return "5.5 am";
			case 6:
		return "6.6 am";
			case 7:
		return "7.7 am";
			case 8:
		return "8.8 am";
			case 9:
		return "9.9 am";
			case 10:
		return "10.10 am";
			case 11:
		return "11.11 am";
			case 12:
		return "12.12 pm";
			case 13:
		return "13.1 pm";
			case 14:
		return "14.2 pm";
			case 15:
		return "15.3 pm";
			case 16:
		return "16.4 pm";
			case 17:
		return "17.5 pm";
			case 18:
		return "18.6 pm";
			case 19:
		return "19.7 pm";
			case 20:
		return "10.8 pm";
			case 21:
		return "11.9 pm";
			case 22:
		return "22.10 pm";
			case 23:
		return "23.11 pm";
		}
	});
	
	var paymentAmount = data.dimension(function (d) {
	var payment = d.total - d.discounts;
		switch (true) {
			case (payment <=50):
		return "0.Payment amount = 0-50";
			case (payment <=100):
		return "1.Payment amount = 51-100";
			case (payment <=200):
		return "0.Payment amount = 101 to 200";
			case (payment <=300):
		return "1.Payment amount = 201 to 300";
			case (payment <=400):
		return "0.Payment amount = 301 to 400";
			case (payment <=500):
		return "1.Payment amount = 401 to 500";
			case (payment <=1000):
		return "0.Payment amount = 501 to 1000";
			case (payment <=2000):
		return "1.Payment amount = 1001 to 2000";
			case (payment >2000):
		return "1.Payment amount = More than 2000";
		}
	});
	
	var paymentType = data.dimension(function (d) {
	var type = d.type;
		switch (true) {
			case (type == "visa"):
		return "0.visa";
			case (type == "tab"):
		return "1.tab";	
			case (type == "cash"):
		return "2.cash";
		}
	});
	
	
	
	
	var volumeByHourGroup = volumeByHour.group()
	.reduceSum(function(d) {return d.total;});
	
	var timeOfDayGroup = timeOfDay.group()
	.reduceSum(function(d) {return d.total;});
	
	var paymentTypeGroup = paymentType.group()
	.reduceSum(function(d){return d.total;});

	
	var viewByDay = days.group().reduceSum(function(d){
		return d.total;
	});
	
	var viewByType = days.group().reduceCount(function(d){
		return d.Type;
	});
	

	
	var dayChart = dc.barChart('#dayChart')
    .margins({top: 10, right: 50, bottom: 30, left: 40})
    .width(800)
    .dimension(days)
    .group(viewByDay)
	
	//.brushOn(false)
	.title(function(d){
	return d.key
	+"\nTotal Sales: "+ d.value;
	})
	.colors(d3.scale.ordinal().domain(["positive","negative"])
                                .range(["#9932CC","#FF0000"]))
	.renderTitle(true)
    .x(d3.time.scale().domain([new Date(2011, 10, 1), new Date(2011, 10, 30)]))
    .xAxis().ticks();
	

	
	
	var dayOfWeekGroup = dayOfWeek.group();
	var paymentAmountGroup = paymentAmount.group();
	
	dc.dataCount(".dc-data-count")
		.dimension(data)
		.group(all);
	
	var dayOfWeekChart = dc.rowChart("#dayChart2");
	
	dayOfWeekChart.width(300)
	.height(220)
	.margins({top: 5, left: 10, right: 10, bottom: 20})
	.dimension(dayOfWeek)
	.group(dayOfWeekGroup)
	.colors(d3.scale.category10())
	.label(function (d){
	return d.key.split(".")[1];
	})
	.title(
	function(d){return "Total count of sales : "+d.value;})
	.elasticX(true)
	.xAxis().ticks(4);
	
	var hoursOfDay = dc.rowChart("#dayChart3");
	
	hoursOfDay.width(300)
	.height(220)
	.margins({top: 5, left: 10, right: 10, bottom: 20})
	.dimension(timeOfDay)
	.group(timeOfDayGroup)
	.colors(d3.scale.category10())
	.label(function (d){
	return d.key.split(".")[1];
	})
	.title(
	function(d){return "Total sales : "+d.value;})
	.elasticX(true)
	.xAxis().ticks(4);
	
	var paymentAmounts = dc.rowChart("#dayChart4");
	
	paymentAmounts.width(300)
	.height(220)
	.margins({top: 5, left: 10, right: 10, bottom: 20})
	.dimension(paymentAmount)
	.group(paymentAmountGroup)
	.colors(d3.scale.category10())
	.label(function (d){
	return d.key.split(".")[1];
	})
	.title(
	function(d){return "Payment Count: "+d.value;})
	.elasticX(true)
	.xAxis().ticks(4);
	
	var paymentTypes = dc.rowChart("#dayChart5");
	
	paymentTypes.width(300)
	.height(220)
	.margins({top: 5, left: 10, right: 10, bottom: 20})
	.dimension(paymentType)
	.group(paymentTypeGroup)
	.colors(d3.scale.category10())
	.label(function (d){
	return d.key.split(".")[1];
	})
	.title(
	function(d){return "Payment amount: "+d.value;})
	.elasticX(true)
	.xAxis().ticks(4);
	
	


	dc.renderAll();