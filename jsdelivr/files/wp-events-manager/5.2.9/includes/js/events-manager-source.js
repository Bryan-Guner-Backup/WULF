var load_ui_css = false; //load jquery ui css?
jQuery(document).ready( function($){
	/* Time Entry */
	if( $("#start-time").length > 0 ){
		$("#start-time, #end-time").timePicker({
			show24Hours: EM.show24hours == 1,
			step:15
		});
		// Store time used by duration.
		var oldTime = $.timePicker("#start-time").getTime();
		// Keep the duration between the two inputs.
		$("#start-time").change(function() {
		  if ($("#end-time").val()) { // Only update when second input has a value.
		    // Calculate duration.
		    var duration = ($.timePicker("#end-time").getTime() - oldTime);
		    var time = $.timePicker("#start-time").getTime();
		    // Calculate and update the time in the second input.
		    $.timePicker("#end-time").setTime(new Date(new Date(time.getTime() + duration)));
		    oldTime = time;
		  }
		});
		// Validate.
		$("#end-time").change(function() {
		  if($.timePicker("#start-time").getTime() > $.timePicker(this).getTime()) { $(this).addClass("error"); }
		  else { $(this).removeClass("error"); }
		});
		//Sort out all day checkbox
		$('#em-time-all-day').change(function(){
			if( $('#em-time-all-day').is(':checked') ){
				$("#start-time").css('background-color','#ccc');
				$.timePicker("#start-time").setTime(new Date(0,0,0,0,0,0));
				$("#end-time").css('background-color','#ccc');
				$.timePicker("#end-time").setTime(new Date(0,0,0,0,0,0));
			}else{
				$("#end-time").css('background-color','#fff');
				$("#start-time").css('background-color','#fff');			
			}
		}).trigger('change');
	}
	/* Calendar AJAX */
	$('.em-calendar-wrapper a').unbind("click");
	$('.em-calendar-wrapper a').undelegate("click");
	$('.em-calendar-wrapper').delegate('a.em-calnav, a.em-calnav', 'click', function(e){
		e.preventDefault();
		$(this).closest('.em-calendar-wrapper').prepend('<div class="loading" id="em-loading"></div>');
		var url = em_ajaxify($(this).attr('href'));
		$(this).closest('.em-calendar-wrapper').load(url, function(){$(this).trigger('em_calendar_load');});
	} );

	//Events Search
	$('.em-events-search-form select[name=country]').change( function(){
		$('.em-events-search select[name=state]').html('<option value="">'+EM.txt_loading+'</option>');
		$('.em-events-search select[name=region]').html('<option value="">'+EM.txt_loading+'</option>');
		$('.em-events-search select[name=town]').html('<option value="">'+EM.txt_loading+'</option>');
		var data = {
			action : 'search_states',
			country : $(this).val(),
			return_html : true
		};
		$('.em-events-search select[name=state]').load( EM.ajaxurl, data );
		data.action = 'search_regions';
		$('.em-events-search select[name=region]').load( EM.ajaxurl, data );
		data.action = 'search_towns';
		$('.em-events-search select[name=town]').load( EM.ajaxurl, data );
	});

	$('.em-events-search-form select[name=region]').change( function(){
		$('.em-events-search select[name=state]').html('<option value="">'+EM.txt_loading+'</option>');
		$('.em-events-search select[name=town]').html('<option value="">'+EM.txt_loading+'</option>');
		var data = {
			action : 'search_states',
			region : $(this).val(),
			country : $('.em-events-search-form select[name=country]').val(),
			return_html : true
		};
		$('.em-events-search select[name=state]').load( EM.ajaxurl, data );
		data.action = 'search_towns';
		$('.em-events-search select[name=town]').load( EM.ajaxurl, data );
	});

	$('.em-events-search-form select[name=state]').change( function(){
		$('.em-events-search select[name=town]').html('<option value="">'+EM.txt_loading+'</option>');
		var data = {
			action : 'search_towns',
			state : $(this).val(),
			region : $('.em-events-search-form select[name=region]').val(),
			country : $('.em-events-search-form select[name=country]').val(),
			return_html : true
		};
		$('.em-events-search select[name=town]').load( EM.ajaxurl, data );
	});
	
	//in order for this to work, you need the above classes to be present in your templates
	$(document).delegate('.em-events-search-form', 'submit', function(e){
    	if( this.search && this.search.value== EM.txt_search ){ this.search.value = ''; }
    	if( this.em_search && this.em_search.value== EM.txt_search){ this.em_search.value = ''; }
    	if( $('#em-wrapper .em-events-search-ajax').length == 1 ){
    		e.preventDefault();
			$('.em-events-search-form :submit').val(EM.txt_searching);
			$.ajax( EM.ajaxurl, {
	    		dataType : 'html',
	    		data : $(this).serialize(),
			    success : function(responseText) {
					$('.em-events-search-form :submit').val(EM.txt_search);
					$('#em-wrapper .em-events-search-ajax').replaceWith(responseText);
			    }
	    	});
			return false;
    	} 
	});
	if( $('#em-wrapper .em-events-search-ajax').length > 0 ){
		$(document).delegate('#em-wrapper .em-events-search-ajax a.page-numbers', 'click', function(e){
			e.preventDefault();
			var pageNo = $(this).attr('title');
			if( $('.em-events-search-form input[name="page"]').length > 0 ){
				$('.em-events-search-form input[name="page"]').val(pageNo);
			}else{
				$('.em-events-search-form').append('<input type="hidden" name="page" value="'+pageNo+'" />');
			}
			$('.em-events-search-form').trigger('submit');
			return false;
		});
	}
		
	/*
	 * ADMIN AREA AND PUBLIC FORMS (Still polishing this section up, note that form ids and classes may change accordingly)
	 */
	//Events List
		//Approve/Reject Links
		$(document).delegate('.em-event-delete', 'click', function(){
			if( !confirm("Are you sure you want to delete?") ){ return false; }
			var url = em_ajaxify( el.attr('href'));		
			var td = el.parents('td').first();
			td.html("Loading...");
			td.load( url );
			return false;
		});
	//Tickets
		//Tickets overlay
		if( $("#em-tickets-add").length > 0 ){
			var triggers = $("#em-tickets-add").overlay({
				mask: { 
					color: '#ebecff',
					loadSpeed: 200,
					opacity: 0.9
				},
				closeOnClick: true,
				onLoad: function(){
					$('#ui-datepicker-div').appendTo('#em-tickets-form').hide();
				},
				onClose: function(){
					$('#ui-datepicker-div').appendTo('body').hide();
				}
			});
		}
		//Submitting ticket (Add/Edit)
		$('#em-tickets-form form').submit(function(e){
			e.preventDefault();
			$('#em-tickets-intro').remove();
			//first we get the template to insert this to
			if( $('#em-tickets-form form input[name=prev_slot]').val() ){
				//grab slot and populate
				var slot = $('#'+$('#em-tickets-form form input[name=prev_slot]').val());
				var rowNo = slot.attr('id').replace('em-tickets-row-','');
				var edit = true;
			}else{
				//create copy of template slot, insert so ready for population
				var rowNo = $('#em-tickets-body').children('tr').length+1;
				var slot = $('#em-tickets-body tr').first().clone().attr('id','em-tickets-row-'+ rowNo).appendTo($('#em-tickets-body'));
				var edit = false;
				slot.show();
			}
			var postData = {};
			$.each($('#em-tickets-form form *[name]'), function(index,el){
				el = $(el);
				slot.find('input.'+el.attr('name')).attr({
					'value' : el.attr('value'),
					'name' : 'em_tickets['+rowNo+']['+el.attr('name')+']'
				});
				slot.find('span.'+el.attr('name')).text(el.attr('value'));
			});
			//allow for others to hook into this
			$(document).triggerHandler('em_maps_tickets_edit', [slot, rowNo, edit]);
			//sort out dates and localization masking
			var start_pub = $("#em-tickets-form input[name=ticket_start_pub]").val();
			var end_pub = $("#em-tickets-form input[name=ticket_end_pub]").val();
			$('#em-tickets-form *[name]').attr('value','');
			$('#em-tickets-form .close').trigger('click');
			return false;
		});
		//Edit a Ticket
		$(document).delegate('.ticket-actions-edit', 'click', function(e){
			//first, populate form, then, trigger click
			e.preventDefault();
			$('#em-tickets-add').trigger('click');
			var rowId = $(this).parents('tr').first().attr('id');
			$('#em-tickets-form *[name]').attr('value','');
			$.each( $('#'+rowId+' *[name]'), function(index,el){
				var el = $(el);
				var selector = el.attr('class');
				$('#em-tickets-form *[name='+selector+']').attr('value',el.attr('value'));
			});
			$("#em-tickets-form input[name=prev_slot]").attr('value',rowId);
			$("#em-tickets-form .start-loc").datepicker('refresh');
			$("#em-tickets-form .end-loc").datepicker('refresh');
	
			date_dateFormat =$("#em-tickets-form .start-loc").datepicker('option', 'dateFormat');
			if( $('#em-tickets-form .start').val() != '' || $('#em-tickets-form .end').val() != '' ){			
				start_date_formatted = $.datepicker.formatDate( date_dateFormat, $.datepicker.parseDate('yy-mm-dd', $('#em-tickets-form .start').val()) );
				end_date_formatted = $.datepicker.formatDate( date_dateFormat, $.datepicker.parseDate('yy-mm-dd', $('#em-tickets-form .end').val()) );
				$("#em-tickets-form .start-loc").val(start_date_formatted);
				$("#em-tickets-form .end-loc").val(end_date_formatted);
			}
			return false;
		});	
		//Delete a ticket
		$(document).delegate('.ticket-actions-delete', 'click', function(e){
			e.preventDefault();
			var el = $(this);
			var rowId = $(this).parents('tr').first().attr('id');
			if( $('#'+rowId+' input.ticket_id').attr('value') == '' ){
				//not saved to db yet, so just remove
				$('#'+rowId).remove();
			}else{
				//only will happen if no bookings made
				el.text('Deleting...');	
				$.getJSON( $(this).attr('href'), {'em_ajax_action':'delete_ticket', 'id':$('#'+rowId+' input.ticket_id').attr('value')}, function(data){
					if(data.result){
						$('#'+rowId).remove();
					}else{
						el.text('Delete');
						alert(data.error);
					}
				});
			}
			return false;
		});
	//Manageing Bookings
		//Pagination link clicks
			$(document).delegate('#em-bookings-table .tablenav-pages a', 'click', function(){
				var el = $(this);
				var form = el.parents('#em-bookings-table form.bookings-filter');
				//get page no from url, change page, submit form
				var match = el.attr('href').match(/#[0-9]+/);
				if( match != null && match.length > 0){
					var pno = match[0].replace('#','');
					form.find('input[name=pno]').val(pno);
				}else{
					form.find('input[name=pno]').val(1);
				}
				form.trigger('submit');
				return false;
			});
			//Widgets and filter submissions
			$(document).delegate('#em-bookings-table form.bookings-filter', 'submit', function(e){
				var el = $(this);			
				el.parents('#em-bookings-table').find('.table-wrap').first().append('<div id="em-loading" />');
				$.post( EM.ajaxurl, el.serializeArray(), function(data){
					el.parents('#em-bookings-table').first().replaceWith(data);
					//Settings Overlay
					if( $("#em-bookings-table-settings-trigger").length > 0 ){
						$("#em-bookings-table-settings-trigger").overlay({
							mask: { color: '#ebecff', loadSpeed: 200, opacity: 0.9 },
							closeOnClick: true
						});
						setup_sortable();
					}
					if( $("#em-bookings-table-export-trigger").length > 0 ){
						$("#em-bookings-table-export-trigger").overlay({
							mask: { color: '#ebecff', loadSpeed: 200, opacity: 0.9 },
							closeOnClick: true
						});
					}
				});
				return false;
			});
			//Settings Overlay
			if( $("#em-bookings-table-settings-trigger").length > 0 ){
				$("#em-bookings-table-settings-trigger").overlay({
					mask: { color: '#ebecff', loadSpeed: 200, opacity: 0.9 },
					closeOnClick: true
				});
				$(document).delegate('#em-bookings-table-settings-form', 'submit', function(el){
					el.preventDefault();
					var arr = $('form#em-bookings-table-settings-form').serializeArray();
					//we know we'll deal with cols, so wipe hidden value from main
					$("#em-bookings-table form.bookings-filter [name=cols]").val('');
					$.each(arr, function(i,item){
						item_match = $('form#em-bookings-table-settings-form [name='+item.name+']');
						if( item_match.length > 0 && item_match.hasClass('em-bookings-col-item') && item_match.val() == 1 ){
							var match = $("#em-bookings-table form.bookings-filter [name=cols]");
							if( match.length > 0 ){
								if(match.val() != ''){
									match.val(match.val()+','+item.name);
								}else{
									match.val(item.name);
								}
							}
						}else{
							//copy it into the main form, overwrite those values
							var match = $("#em-bookings-table form.bookings-filter [name="+item.name+"]");
							if( match.length > 0 ){ match.val(item.value); }
						}
					});
					//submit main form
					$('#em-bookings-table-settings a.close').trigger('click');
					$('#em-bookings-table-settings').trigger('submitted'); //hook into this with bind()
					$('#em-bookings-table form.bookings-filter').trigger('submit');					
					return false;
				});
				var setup_sortable = function(){
					$( ".em-bookings-cols-sortable" ).sortable({
						connectWith: ".em-bookings-cols-sortable",
						over: function(event, ui) {
							if( ui.item.hasClass('ui-state-highlight') ){
								ui.item.addClass('ui-state-default').removeClass('ui-state-highlight').children('input').val(0);							
							}else{
								ui.item.addClass('ui-state-highlight').removeClass('ui-state-default').children('input').val(1);
							}
						}
					}).disableSelection();
					load_ui_css = true;
				}
				setup_sortable();
			}
			//Export Overlay
			if( $("#em-bookings-table-export-trigger").length > 0 ){
				$("#em-bookings-table-export-trigger").overlay({
					mask: { color: '#ebecff', loadSpeed: 200, opacity: 0.9 },
					closeOnClick: true
				});
			}
			var export_overlay_show_tickets = function(){
				if( $(this).is(':checked') ){
					$('#em-bookings-table-export-form .em-bookings-col-item-ticket').show();
					$('#em-bookings-table-export-form #em-bookings-export-cols-active .em-bookings-col-item-ticket input').val(1);
				}else{
					$('#em-bookings-table-export-form .em-bookings-col-item-ticket').hide().find('input').val(0);					
				}
			};
			export_overlay_show_tickets();
			$(document).delegate('#em-bookings-table-export-form input[name=show_tickets]', 'click', export_overlay_show_tickets);
			
		//Old Bookings Table
			//Widgets and filter submissions
			$(document).delegate('.em_bookings_events_table form, .em_bookings_pending_table form', 'submit', function(e){
				var el = $(this);
				var url = em_ajaxify( el.attr('action') );		
				el.parent('.em_obj').prepend('<div id="em-loading" />');
				$.get( url, el.serializeArray(), function(data){
					el.parent('.em_obj').replaceWith(data);
				});
				return false;
			});
			//Pagination link clicks
			$(document).delegate('.em_bookings_events_table .tablenav-pages a, .em_bookings_pending_table .tablenav-pages a', 'click', function(){		
				var el = $(this);
				var url = em_ajaxify( el.attr('href') );	
				el.parents('.em_obj').find('.table-wrap').first().append('<div id="em-loading" />');
				$.get( url, function(data){
					el.parents('.em_obj').first().replaceWith(data);
				});
				return false;
			});
		//Approve/Reject Links
		$(document).delegate('.em-bookings-approve,.em-bookings-reject,.em-bookings-unapprove,.em-bookings-delete', 'click', function(){
			var el = $(this); 
			if( el.hasClass('em-bookings-delete') ){
				if( !confirm("Are you sure you want to delete?") ){ return false; }
			}
			var url = em_ajaxify( el.attr('href'));		
			var td = el.parents('td').first();
			td.html("Loading...");
			td.load( url );
			return false;
		});
		
	//Datepicker
	if( $('#em-date-start').length > 0 ){
		if( EM.locale != 'en' ){
			$.datepicker.regional['nl']={closeText:'Sluiten',prevText:'???',nextText:'???',currentText:'Vandaag',monthNames:['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'],monthNamesShort:['jan','feb','maa','apr','mei','jun','jul','aug','sep','okt','nov','dec'],dayNames:['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'],dayNamesShort:['zon','maa','din','woe','don','vri','zat'],dayNamesMin:['zo','ma','di','wo','do','vr','za'],weekHeader:'Wk',dateFormat:'dd/mm/yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['af']={closeText:'Selekteer',prevText:'Vorige',nextText:'Volgende',currentText:'Vandag',monthNames:['Januarie','Februarie','Maart','April','Mei','Junie','Julie','Augustus','September','Oktober','November','Desember'],monthNamesShort:['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Des'],dayNames:['Sondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrydag','Saterdag'],dayNamesShort:['Son','Maa','Din','Woe','Don','Vry','Sat'],dayNamesMin:['So','Ma','Di','Wo','Do','Vr','Sa'],weekHeader:'Wk',dateFormat:'dd/mm/yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['ar']={closeText:'??????????',prevText:'<????????????',nextText:'????????????>',currentText:'??????????',monthNames:['?????????? ????????????','????????','????????','??????????','????????','????????????','????????','????','??????????','?????????? ??????????','?????????? ????????????','?????????? ??????????'],monthNamesShort:['1','2','3','4','5','6','7','8','9','10','11','12'],dayNames:['??????????','??????????','??????????????','????????????????','????????????????','????????????','????????????'],dayNamesShort:['??????','??????','??????????','????????????','????????????','????????','????????'],dayNamesMin:['??????','??????','??????????','????????????','????????????','????????','????????'],weekHeader:'??????????',dateFormat:'dd/mm/yy',firstDay:0,isRTL:true,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['az']={closeText:'Ba??la',prevText:'<Geri',nextText:'??r??li>',currentText:'Bug??n',monthNames:['Yanvar','Fevral','Mart','Aprel','May','??yun','??yul','Avqust','Sentyabr','Oktyabr','Noyabr','Dekabr'],monthNamesShort:['Yan','Fev','Mar','Apr','May','??yun','??yul','Avq','Sen','Okt','Noy','Dek'],dayNames:['Bazar','Bazar ert??si','????r????nb?? ax??am??','????r????nb??','C??m?? ax??am??','C??m??','????nb??'],dayNamesShort:['B','Be','??a','??','Ca','C','??'],dayNamesMin:['B','B','??','??','??','C','??'],weekHeader:'Hf',dateFormat:'dd.mm.yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['bg']={closeText:'??????????????',prevText:'<??????????',nextText:'????????????>',nextBigText:'>>',currentText:'????????',monthNames:['????????????','????????????????','????????','??????????','??????','??????','??????','????????????','??????????????????','????????????????','??????????????','????????????????'],monthNamesShort:['??????','??????','??????','??????','??????','??????','??????','??????','??????','??????','??????','??????'],dayNames:['????????????','????????????????????','??????????????','??????????','??????????????????','??????????','????????????'],dayNamesShort:['??????','??????','??????','??????','??????','??????','??????'],dayNamesMin:['????','????','????','????','????','????','????'],weekHeader:'Wk',dateFormat:'dd.mm.yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['bs']={closeText:'Zatvori',prevText:'<',nextText:'>',currentText:'Danas',monthNames:['Januar','Februar','Mart','April','Maj','Juni','Juli','August','Septembar','Oktobar','Novembar','Decembar'],monthNamesShort:['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],dayNames:['Nedelja','Ponedeljak','Utorak','Srijeda','??etvrtak','Petak','Subota'],dayNamesShort:['Ned','Pon','Uto','Sri','??et','Pet','Sub'],dayNamesMin:['Ne','Po','Ut','Sr','??e','Pe','Su'],weekHeader:'Wk',dateFormat:'dd.mm.yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['cs']={closeText:'Zav????t',prevText:'<D????ve',nextText:'Pozd??ji>',currentText:'Nyn??',monthNames:['leden','??nor','b??ezen','duben','kv??ten','??erven','??ervenec','srpen','z??????','????jen','listopad','prosinec'],monthNamesShort:['led','??no','b??e','dub','kv??','??er','??vc','srp','z????','????j','lis','pro'],dayNames:['ned??le','pond??l??','??ter??','st??eda','??tvrtek','p??tek','sobota'],dayNamesShort:['ne','po','??t','st','??t','p??','so'],dayNamesMin:['ne','po','??t','st','??t','p??','so'],weekHeader:'T??d',dateFormat:'dd.mm.yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['da']={closeText:'Luk',prevText:'<Forrige',nextText:'N??ste>',currentText:'Idag',monthNames:['Januar','Februar','Marts','April','Maj','Juni','Juli','August','September','Oktober','November','December'],monthNamesShort:['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],dayNames:['S??ndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','L??rdag'],dayNamesShort:['S??n','Man','Tir','Ons','Tor','Fre','L??r'],dayNamesMin:['S??','Ma','Ti','On','To','Fr','L??'],weekHeader:'Uge',dateFormat:'dd-mm-yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['de']={closeText:'schlie??en',prevText:'<zur??ck',nextText:'Vor>',currentText:'heute',monthNames:['Januar','Februar','M??rz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],monthNamesShort:['Jan','Feb','M??r','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],dayNames:['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],dayNamesShort:['So','Mo','Di','Mi','Do','Fr','Sa'],dayNamesMin:['So','Mo','Di','Mi','Do','Fr','Sa'],weekHeader:'Wo',dateFormat:'dd.mm.yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['el']={closeText:'????????????????',prevText:'????????????????????????',nextText:'????????????????',currentText:'???????????? ??????????',monthNames:['????????????????????','??????????????????????','??????????????','????????????????','??????????','??????????????','??????????????','??????????????????','??????????????????????','??????????????????','??????????????????','????????????????????'],monthNamesShort:['??????','??????','??????','??????','??????','????????','????????','??????','??????','??????','??????','??????'],dayNames:['??????????????','??????????????','??????????','??????????????','????????????','??????????????????','??????????????'],dayNamesShort:['??????','??????','??????','??????','??????','??????','??????'],dayNamesMin:['????','????','????','????','????','????','????'],weekHeader:'??????',dateFormat:'dd/mm/yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['en-GB']={closeText:'Done',prevText:'Prev',nextText:'Next',currentText:'Today',monthNames:['January','February','March','April','May','June','July','August','September','October','November','December'],monthNamesShort:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],dayNames:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],dayNamesShort:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],dayNamesMin:['Su','Mo','Tu','We','Th','Fr','Sa'],weekHeader:'Wk',dateFormat:'dd/mm/yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['eo']={closeText:'Fermi',prevText:'<Anta',nextText:'Sekv>',currentText:'Nuna',monthNames:['Januaro','Februaro','Marto','Aprilo','Majo','Junio','Julio','A??gusto','Septembro','Oktobro','Novembro','Decembro'],monthNamesShort:['Jan','Feb','Mar','Apr','Maj','Jun','Jul','A??g','Sep','Okt','Nov','Dec'],dayNames:['Diman??o','Lundo','Mardo','Merkredo','??a??do','Vendredo','Sabato'],dayNamesShort:['Dim','Lun','Mar','Mer','??a??','Ven','Sab'],dayNamesMin:['Di','Lu','Ma','Me','??a','Ve','Sa'],weekHeader:'Sb',dateFormat:'dd/mm/yy',firstDay:0,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['et']={closeText:'Sulge',prevText:'Eelnev',nextText:'J??rgnev',currentText:'T??na',monthNames:['Jaanuar','Veebruar','M??rts','Aprill','Mai','Juuni','Juuli','August','September','Oktoober','November','Detsember'],monthNamesShort:['Jaan','Veebr','M??rts','Apr','Mai','Juuni','Juuli','Aug','Sept','Okt','Nov','Dets'],dayNames:['P??hap??ev','Esmasp??ev','Teisip??ev','Kolmap??ev','Neljap??ev','Reede','Laup??ev'],dayNamesShort:['P??hap','Esmasp','Teisip','Kolmap','Neljap','Reede','Laup'],dayNamesMin:['P','E','T','K','N','R','L'],weekHeader:'Sm',dateFormat:'dd.mm.yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['eu']={closeText:'Egina',prevText:'<Aur',nextText:'Hur>',currentText:'Gaur',monthNames:['Urtarrila','Otsaila','Martxoa','Apirila','Maiatza','Ekaina','Uztaila','Abuztua','Iraila','Urria','Azaroa','Abendua'],monthNamesShort:['Urt','Ots','Mar','Api','Mai','Eka','Uzt','Abu','Ira','Urr','Aza','Abe'],dayNames:['Igandea','Astelehena','Asteartea','Asteazkena','Osteguna','Ostirala','Larunbata'],dayNamesShort:['Iga','Ast','Ast','Ast','Ost','Ost','Lar'],dayNamesMin:['Ig','As','As','As','Os','Os','La'],weekHeader:'Wk',dateFormat:'yy/mm/dd',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['fa']={closeText:'????????',prevText:'<????????',nextText:'????????>',currentText:'??????????',monthNames:['??????????????','????????????????','??????????','??????','??????????','????????????','??????','????????','??????','????','????????','??????????'],monthNamesShort:['1','2','3','4','5','6','7','8','9','10','11','12'],dayNames:['????????????','????????????','???????????????','????????????????','??????????????','????????','????????'],dayNamesShort:['??','??','??','??','??','??','??'],dayNamesMin:['??','??','??','??','??','??','??'],weekHeader:'????',dateFormat:'yy/mm/dd',firstDay:6,isRTL:true,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['fo']={closeText:'Lat aftur',prevText:'<Fyrra',nextText:'N??sta>',currentText:'?? dag',monthNames:['Januar','Februar','Mars','Apr??l','Mei','Juni','Juli','August','September','Oktober','November','Desember'],monthNamesShort:['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Des'],dayNames:['Sunnudagur','M??nadagur','T??sdagur','Mikudagur','H??sdagur','Fr??ggjadagur','Leyardagur'],dayNamesShort:['Sun','M??n','T??s','Mik','H??s','Fr??','Ley'],dayNamesMin:['Su','M??','T??','Mi','H??','Fr','Le'],weekHeader:'Vk',dateFormat:'dd-mm-yy',firstDay:0,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['fr-CH']={closeText:'Fermer',prevText:'<Pr??c',nextText:'Suiv>',currentText:'Courant',monthNames:['Janvier','F??vrier','Mars','Avril','Mai','Juin','Juillet','Ao??t','Septembre','Octobre','Novembre','D??cembre'],monthNamesShort:['Jan','F??v','Mar','Avr','Mai','Jun','Jul','Ao??','Sep','Oct','Nov','D??c'],dayNames:['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],dayNamesShort:['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],dayNamesMin:['Di','Lu','Ma','Me','Je','Ve','Sa'],weekHeader:'Sm',dateFormat:'dd.mm.yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['fr']={closeText:'Fermer',prevText:'<Pr??c',nextText:'Suiv>',currentText:'Courant',monthNames:['Janvier','F??vrier','Mars','Avril','Mai','Juin','Juillet','Ao??t','Septembre','Octobre','Novembre','D??cembre'],monthNamesShort:['Jan','F??v','Mar','Avr','Mai','Jun','Jul','Ao??','Sep','Oct','Nov','D??c'],dayNames:['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],dayNamesShort:['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],dayNamesMin:['Di','Lu','Ma','Me','Je','Ve','Sa'],weekHeader:'Sm',dateFormat:'dd/mm/yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['he']={closeText:'????????',prevText:'<??????????',nextText:'??????>',currentText:'????????',monthNames:['??????????','????????????','??????','??????????','??????','????????','????????','????????????','????????????','??????????????','????????????','??????????'],monthNamesShort:['1','2','3','4','5','6','7','8','9','10','11','12'],dayNames:['??????????','??????','??????????','??????????','??????????','????????','??????'],dayNamesShort:['??\'','??\'','??\'','??\'','??\'','??\'','??????'],dayNamesMin:['??\'','??\'','??\'','??\'','??\'','??\'','??????'],weekHeader:'Wk',dateFormat:'dd/mm/yy',firstDay:0,isRTL:true,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['hu']={closeText:'K??sz',prevText:'El??z??',nextText:'K??vetkez??',currentText:'Ma',monthNames:['janu??r','febru??r','m??rcius','??prilis','m??jus','j??nius','j??lius','augusztus','szeptember','okt??ber','november','cecember'],monthNamesShort:['jan','febr','m??rc','??pr','m??j','j??n','j??l','aug','szept','okt','nov','dec'],dayNames:['vas??rnap','h??tf??','kedd','szerda','cs??t??rt??k','p??ntek','szombat'],dayNamesShort:['va','h??','k','sze','cs??','p??','szo'],dayNamesMin:['v','h','k','sze','cs','p','szo'],weekHeader:'Wk',dateFormat:'yy.mm.dd.',firstDay:1,isRTL:false,showMonthAfterYear:true,yearSuffix:''};
			$.datepicker.regional['hr']={closeText:'Zatvori',prevText:'<',nextText:'>',currentText:'Danas',monthNames:['Sije??anj','Velja??a','O??ujak','Travanj','Svibanj','Lipanj','Srpanj','Kolovoz','Rujan','Listopad','Studeni','Prosinac'],monthNamesShort:['Sij','Velj','O??u','Tra','Svi','Lip','Srp','Kol','Ruj','Lis','Stu','Pro'],dayNames:['Nedjelja','Ponedjeljak','Utorak','Srijeda','??etvrtak','Petak','Subota'],dayNamesShort:['Ned','Pon','Uto','Sri','??et','Pet','Sub'],dayNamesMin:['Ne','Po','Ut','Sr','??e','Pe','Su'],weekHeader:'Tje',dateFormat:'dd.mm.yy.',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['ja']={closeText:'?????????',prevText:'<???',nextText:'???>',currentText:'??????',monthNames:['1???','2???','3???','4???','5???','6???','7???','8???','9???','10???','11???','12???'],monthNamesShort:['1???','2???','3???','4???','5???','6???','7???','8???','9???','10???','11???','12???'],dayNames:['?????????','?????????','?????????','?????????','?????????','?????????','?????????'],dayNamesShort:['???','???','???','???','???','???','???'],dayNamesMin:['???','???','???','???','???','???','???'],weekHeader:'???',dateFormat:'yy/mm/dd',firstDay:0,isRTL:false,showMonthAfterYear:true,yearSuffix:'???'};
			$.datepicker.regional['ro']={closeText:'??nchide',prevText:'?? Luna precedent??',nextText:'Luna urm??toare ??',currentText:'Azi',monthNames:['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'],monthNamesShort:['Ian','Feb','Mar','Apr','Mai','Iun','Iul','Aug','Sep','Oct','Nov','Dec'],dayNames:['Duminic??','Luni','Mar??i','Miercuri','Joi','Vineri','S??mb??t??'],dayNamesShort:['Dum','Lun','Mar','Mie','Joi','Vin','S??m'],dayNamesMin:['Du','Lu','Ma','Mi','Jo','Vi','S??'],weekHeader:'S??pt',dateFormat:'dd.mm.yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['sk']={closeText: 'Zavrie??',prevText: '&#x3c;Predch??dzaj??ci',nextText: 'Nasleduj??ci&#x3e;',currentText: 'Dnes',monthNames: ['Janu??r','Febru??r','Marec','Apr??l','M??j','J??n','J??l','August','September','Okt??ber','November','December'],monthNamesShort: ['Jan','Feb','Mar','Apr','M??j','J??n','J??l','Aug','Sep','Okt','Nov','Dec'],dayNames: ['Nedel\'a','Pondelok','Utorok','Streda','??tvrtok','Piatok','Sobota'],dayNamesShort: ['Ned','Pon','Uto','Str','??tv','Pia','Sob'],dayNamesMin: ['Ne','Po','Ut','St','??t','Pia','So'],weekHeader: 'Ty',dateFormat: 'dd.mm.yy',firstDay: 1,isRTL: false,showMonthAfterYear: false,yearSuffix: ''};			
			$.datepicker.regional['sq']={closeText:'mbylle',prevText:'<mbrapa',nextText:'P??rpara>',currentText:'sot',monthNames:['Janar','Shkurt','Mars','Prill','Maj','Qershor','Korrik','Gusht','Shtator','Tetor','N??ntor','Dhjetor'],monthNamesShort:['Jan','Shk','Mar','Pri','Maj','Qer','Kor','Gus','Sht','Tet','N??n','Dhj'],dayNames:['E Diel','E H??n??','E Mart??','E M??rkur??','E Enjte','E Premte','E Shtune'],dayNamesShort:['Di','H??','Ma','M??','En','Pr','Sh'],dayNamesMin:['Di','H??','Ma','M??','En','Pr','Sh'],weekHeader:'Ja',dateFormat:'dd.mm.yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['sr-SR']={closeText:'Zatvori',prevText:'<',nextText:'>',currentText:'Danas',monthNames:['Januar','Februar','Mart','April','Maj','Jun','Jul','Avgust','Septembar','Oktobar','Novembar','Decembar'],monthNamesShort:['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Avg','Sep','Okt','Nov','Dec'],dayNames:['Nedelja','Ponedeljak','Utorak','Sreda','??etvrtak','Petak','Subota'],dayNamesShort:['Ned','Pon','Uto','Sre','??et','Pet','Sub'],dayNamesMin:['Ne','Po','Ut','Sr','??e','Pe','Su'],weekHeader:'Sed',dateFormat:'dd/mm/yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['sr']={closeText:'??????????????',prevText:'<',nextText:'>',currentText:'??????????',monthNames:['????????????','??????????????','????????','??????????','??????','??????','??????','????????????','??????????????????','??????????????','????????????????','????????????????'],monthNamesShort:['??????','??????','??????','??????','??????','??????','??????','??????','??????','??????','??????','??????'],dayNames:['????????????','??????????????????','????????????','??????????','????????????????','??????????','????????????'],dayNamesShort:['??????','??????','??????','??????','??????','??????','??????'],dayNamesMin:['????','????','????','????','????','????','????'],weekHeader:'??????',dateFormat:'dd/mm/yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['sv']={closeText:'St??ng',prevText:'??F??rra',nextText:'N??sta??',currentText:'Idag',monthNames:['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December'],monthNamesShort:['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],dayNamesShort:['S??n','M??n','Tis','Ons','Tor','Fre','L??r'],dayNames:['S??ndag','M??ndag','Tisdag','Onsdag','Torsdag','Fredag','L??rdag'],dayNamesMin:['S??','M??','Ti','On','To','Fr','L??'],weekHeader:'Ve',dateFormat:'yy-mm-dd',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['ta']={closeText:'????????????',prevText:'???????????????????????????',nextText:'????????????????????????',currentText:'???????????????',monthNames:['??????','????????????','?????????????????????','????????????????????????','??????????????????','?????????','?????????','????????????','???????????????????????????','??????????????????','??????????????????????????????','?????????????????????'],monthNamesShort:['??????','????????????','?????????','????????????','????????????','?????????','?????????','??????','?????????','?????????','????????????','????????????'],dayNames:['?????????????????????????????????????????????','????????????????????????????????????','?????????????????????????????????????????????','??????????????????????????????','????????????????????????????????????','???????????????????????????????????????','??????????????????????????????'],dayNamesShort:['??????????????????','?????????????????????','????????????????????????','???????????????','?????????????????????','??????????????????','?????????'],dayNamesMin:['??????','??????','??????','??????','??????','??????','???'],weekHeader:'????',dateFormat:'dd/mm/yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['th']={closeText:'?????????',prevText:'????????????????',nextText:'???????????????????',currentText:'??????????????????',monthNames:['??????????????????','??????????????????????????????','??????????????????','??????????????????','?????????????????????','????????????????????????','?????????????????????','?????????????????????','?????????????????????','??????????????????','???????????????????????????','?????????????????????'],monthNamesShort:['???.???.','???.???.','??????.???.','??????.???.','???.???.','??????.???.','???.???.','???.???.','???.???.','???.???.','???.???.','???.???.'],dayNames:['?????????????????????','??????????????????','??????????????????','?????????','????????????????????????','???????????????','???????????????'],dayNamesShort:['??????.','???.','???.','???.','??????.','???.','???.'],dayNamesMin:['??????.','???.','???.','???.','??????.','???.','???.'],weekHeader:'Wk',dateFormat:'dd/mm/yy',firstDay:0,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['vi']={closeText:'????ng',prevText:'<Tr?????c',nextText:'Ti???p>',currentText:'H??m nay',monthNames:['Th??ng M???t','Th??ng Hai','Th??ng Ba','Th??ng T??','Th??ng N??m','Th??ng S??u','Th??ng B???y','Th??ng T??m','Th??ng Ch??n','Th??ng M?????i','Th??ng M?????i M???t','Th??ng M?????i Hai'],monthNamesShort:['Th??ng 1','Th??ng 2','Th??ng 3','Th??ng 4','Th??ng 5','Th??ng 6','Th??ng 7','Th??ng 8','Th??ng 9','Th??ng 10','Th??ng 11','Th??ng 12'],dayNames:['Ch??? Nh???t','Th??? Hai','Th??? Ba','Th??? T??','Th??? N??m','Th??? S??u','Th??? B???y'],dayNamesShort:['CN','T2','T3','T4','T5','T6','T7'],dayNamesMin:['CN','T2','T3','T4','T5','T6','T7'],weekHeader:'Tu',dateFormat:'dd/mm/yy',firstDay:0,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['zh-TW']={closeText:'??????',prevText:'<??????',nextText:'??????>',currentText:'??????',monthNames:['??????','??????','??????','??????','??????','??????','??????','??????','??????','??????','?????????','?????????'],monthNamesShort:['???','???','???','???','???','???','???','???','???','???','??????','??????'],dayNames:['?????????','?????????','?????????','?????????','?????????','?????????','?????????'],dayNamesShort:['??????','??????','??????','??????','??????','??????','??????'],dayNamesMin:['???','???','???','???','???','???','???'],weekHeader:'???',dateFormat:'yy/mm/dd',firstDay:1,isRTL:false,showMonthAfterYear:true,yearSuffix:'???'};
			$.datepicker.regional['es']={closeText:'Cerrar',prevText:'<Ant',nextText:'Sig>',currentText:'Hoy',monthNames:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],monthNamesShort:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],dayNames:['Domingo','Lunes','Martes','Mi??rcoles','Jueves','Viernes','S??bado'],dayNamesShort:['Dom','Lun','Mar','Mi??','Juv','Vie','S??b'],dayNamesMin:['Do','Lu','Ma','Mi','Ju','Vi','S??'],weekHeader:'Sm',dateFormat:'dd/mm/yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.regional['it']={closeText:'Fatto',prevText:'Precedente',nextText:'Prossimo',currentText:'Oggi',monthNames:['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],monthNamesShort:['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'],dayNames:['Luned??','Marted??','Mercoled??','Gioved??','Venerd??','Sabato','Domenica'],dayNamesShort:['Lun','Mar','Mer','Gio','Ven','Sab','Dom'],dayNamesMin:['Do','Lu','Ma','Me','Gi','Ve','Sa'],weekHeader:'Wk',dateFormat:'dd/mm/yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};
			$.datepicker.setDefaults($.datepicker.regional[EM.locale]);
		}
		//default picker vals
		var datepicker_vals = { altFormat: "yy-mm-dd", changeMonth: true, changeYear: true, firstDay : EM.firstDay };
		if( EM.dateFormat != ''){
			datepicker_vals.dateFormat = EM.dateFormat;
		}
		
		//bookings end date
		var bookings_datepicker_vals = { 
			altField : "#em-bookings-date" 
		};
		$.extend( bookings_datepicker_vals, datepicker_vals );
		$("#em-bookings-date-loc").datepicker(bookings_datepicker_vals);
		
		//start date
		var start_datepicker_vals = {
			altField : "#em-date-start",
			onSelect : function( selectedDate ) {
				if( $("#em-date-start").val() > $("#em-date-end").val() ){
					$("#em-date-end-loc").datepicker( "setDate" , selectedDate );
				}
				$("#em-date-end-loc").datepicker( "option", 'minDate', selectedDate );
			} 
		};
		$.extend( start_datepicker_vals, datepicker_vals );
		$("#em-date-start-loc").datepicker(start_datepicker_vals);

		//end date
		var end_datepicker_vals = { 
			altField : "#em-date-end" 
		};
		if( $("#em-date-start").val() != '' ){
			end_datepicker_vals.minDate = new Date($("#em-date-start").val());
		}
		$.extend( end_datepicker_vals, datepicker_vals );
		$("#em-date-end-loc").datepicker(end_datepicker_vals);
		
		//localize start/end dates
		if( $('#em-date-start').val() != '' ){
			load_ui_css = true;
			if( EM.locale != 'en' && $.datepicker.regional[EM.locale] != null ){
				var date_dateFormat = $.datepicker.regional[EM.locale].dateFormat;
			}else{
				var date_dateFormat = $("#em-date-start-loc").datepicker('option', 'dateFormat');
			}
			if($('#em-bookings-date').length > 0 && $('#em-bookings-date').val() != ''){
				var bookings_date_formatted = $.datepicker.formatDate( date_dateFormat, $.datepicker.parseDate('yy-mm-dd', $('#em-bookings-date').val()) );
				$("#em-bookings-date-loc").val(bookings_date_formatted);
			}
			var start_date_formatted = $.datepicker.formatDate( date_dateFormat, $.datepicker.parseDate('yy-mm-dd', $('#em-date-start').val()) );
			var end_date_formatted = $.datepicker.formatDate( date_dateFormat, $.datepicker.parseDate('yy-mm-dd', $('#em-date-end').val()) );
			$("#em-date-start-loc").val(start_date_formatted);
			$("#em-date-end-loc").val(end_date_formatted);
		}
		
		//for the tickets form too
		$(".em-ticket-form, #em-tickets-form").each(function(i, el){
			el = $(el);
			start = el.find('.start-loc');
			end = el.find('.end-loc');
			load_ui_css = true;
			if(start.length > 0){
				load_ui_css = true;
				datepicker_vals.altField = el.find('.start').first();
				start.datepicker(datepicker_vals);
				//formatting for both
				if( EM.locale != 'en' && $.datepicker.regional[EM.locale] != null ){
					var date_dateFormat = $.datepicker.regional[EM.locale].dateFormat;
				}else{
					var date_dateFormat = start.datepicker('option', 'dateFormat');
				}
				start_date_formatted = $.datepicker.formatDate( date_dateFormat, $.datepicker.parseDate('yy-mm-dd' , datepicker_vals.altField.val()) );
				el.find(".start-loc").val(start_date_formatted);
				//end 
				if(end.length > 0){
					load_ui_css = true;
					datepicker_vals.altField = el.find('.end').first();
					end.first().datepicker(datepicker_vals);
					end_date_formatted = $.datepicker.formatDate( date_dateFormat, $.datepicker.parseDate('yy-mm-dd' , datepicker_vals.altField.val()) );
					el.find(".end-loc").first().val(end_date_formatted);
				}
			}
		});
	}
	if( load_ui_css || $("#em-date-start-loc, #em-date-end-loc, .em-ticket-form .start-loc, #em-bookings-date-loc").length > 0 ){
		$('ui-datepicker-div').css();
		var script = document.createElement("link");
		script.id = 'jquery-ui-css';
		script.rel = "stylesheet";
		script.href = EM.ui_css;
		document.body.appendChild(script);
	}
	
	//previously in em-admin.php
	function updateIntervalDescriptor () { 
		$(".interval-desc").hide();
		var number = "-plural";
		if ($('input#recurrence-interval').val() == 1 || $('input#recurrence-interval').val() == "")
		number = "-singular";
		var descriptor = "span#interval-"+$("select#recurrence-frequency").val()+number;
		$(descriptor).show();
	}
	function updateIntervalSelectors () {
		$('p.alternate-selector').hide();   
		$('p#'+ $('select#recurrence-frequency').val() + "-selector").show();
	}
	function updateShowHideRecurrence () {
		if( $('input#event-recurrence').attr("checked")) {
			$("#event_recurrence_pattern").fadeIn();
			$("#event-date-explanation").hide();
			$("#recurrence-dates-explanation").show();
			$("h3#recurrence-dates-title").show();
			$("h3#event-date-title").hide();     
		} else {
			$("#event_recurrence_pattern").hide();
			$("#recurrence-dates-explanation").hide();
			$("#event-date-explanation").show();
			$("h3#recurrence-dates-title").hide();
			$("h3#event-date-title").show();   
		}
	}		 
	$("#recurrence-dates-explanation").hide();
	$("#date-to-submit").hide();
	$("#end-date-to-submit").hide();
	
	$("#localised-date").show();
	$("#localised-end-date").show();
	
	$('input.select-all').change(function(){
	 	if($(this).is(':checked'))
	 	$('input.row-selector').attr('checked', true);
	 	else
	 	$('input.row-selector').attr('checked', false);
	}); 
	
	updateIntervalDescriptor(); 
	updateIntervalSelectors();
	updateShowHideRecurrence();
	$('input#event-recurrence').change(updateShowHideRecurrence);
	   
	// recurrency elements   
	$('input#recurrence-interval').keyup(updateIntervalDescriptor);
	$('select#recurrence-frequency').change(updateIntervalDescriptor);
	$('select#recurrence-frequency').change(updateIntervalSelectors);
	
	/* Useful function for adding the em_ajax flag to a url, regardless of querystring format */
	var em_ajaxify = function(url){
		if ( url.search('em_ajax=0') != -1){
			url = url.replace('em_ajax=0','em_ajax=1');
		}else if( url.search(/\?/) != -1 ){
			url = url + "&em_ajax=1";
		}else{
			url = url + "?em_ajax=1";
		}
		return url;
	}

	/* Load any maps */	
	if( $('.em-location-map').length > 0 || $('.em-locations-map').length > 0 || $('#em-map').length > 0 ){
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = (EM.is_ssl) ? 'https://maps.google.com/maps/api/js?v=3.8&sensor=false&callback=em_maps':'http://maps.google.com/maps/api/js?v=3.4&sensor=false&callback=em_maps';
		document.body.appendChild(script);
	}
	
});

//Location functions
function em_location_input_ajax(){
	//Location stuff - only needed if inputs for location exist
	if( jQuery('select#location-select-id, input#location-address').length > 0 ){
		
		//load map info
		var refresh_map_location = function(){
			var location_latitude = jQuery('#location-latitude').val();
			var location_longitude = jQuery('#location-longitude').val();
			if( !(location_latitude == 0 && location_longitude == 0) ){
				var position = new google.maps.LatLng(location_latitude, location_longitude); //the location coords
				marker.setPosition(position);
				var mapTitle = (jQuery('input#location-name').length > 0) ? jQuery('input#location-name').val():jQuery('input#title').val();
				marker.setTitle( jQuery('input#location-name input#title, #location-select-id').first().val() );
				jQuery('#em-map').show();
				jQuery('#em-map-404').hide();
				google.maps.event.trigger(map, 'resize');
				map.setCenter(position);
				map.panBy(40,-55);
				infoWindow.setContent( 
					'<div id="location-balloon-content"><strong>' + 
					mapTitle + 
					'</strong><br/>' + 
					jQuery('#location-address').val() + 
					'<br/>' + jQuery('#location-town').val()+ 
					'</div>'
				);
				infoWindow.open(map, marker);
			} else {
    			jQuery('#em-map').hide();
    			jQuery('#em-map-404').show();
			}
		}
		
		//Load map
		if(jQuery('#em-map').length > 0){
			var em_LatLng = new google.maps.LatLng(0, 0);
			var map = new google.maps.Map( document.getElementById('em-map'), {
			    zoom: 14,
			    center: em_LatLng,
			    mapTypeId: google.maps.MapTypeId.ROADMAP,
			    mapTypeControl: false
			});
			var marker = new google.maps.Marker({
			    position: em_LatLng,
			    map: map,
			    draggable: true
			});
			var infoWindow = new google.maps.InfoWindow({
			    content: ''
			});
			var geocoder = new google.maps.Geocoder();
			google.maps.event.addListener(infoWindow, 'domready', function() { 
				document.getElementById('location-balloon-content').parentNode.style.overflow=''; 
				document.getElementById('location-balloon-content').parentNode.parentNode.style.overflow=''; 
			});
			google.maps.event.addListener(marker, 'dragend', function() {
				var position = marker.getPosition();
				jQuery('#location-latitude').val(position.lat());
				jQuery('#location-longitude').val(position.lng());
				map.setCenter(position);
				map.panBy(40,-55);
			});
		    refresh_map_location();
		}
		
		//Add listeners for changes to address
		var get_map_by_id = function(id){
			if(jQuery('#em-map').length > 0){
				jQuery.getJSON(document.URL,{ em_ajax_action:'get_location', id:id }, function(data){
					if( data.location_latitude!=0 && data.location_longitude!=0 ){
						loc_latlng = new google.maps.LatLng(data.location_latitude, data.location_longitude);
						marker.setPosition(loc_latlng);
						marker.setTitle( data.location_name );
						jQuery('#em-map').show();
						jQuery('#em-map-404').hide();
						map.setCenter(loc_latlng);
						map.panBy(40,-55);
						infoWindow.setContent( '<div id="location-balloon-content">'+ data.location_balloon +'</div>');
						infoWindow.open(map, marker);
						google.maps.event.trigger(map, 'resize');
					}else{
						jQuery('#em-map').hide();
						jQuery('#em-map-404').show();
					}
				});
			}
		}
		jQuery('#location-select-id').change( function(){get_map_by_id(jQuery(this).val())} );
		jQuery('#location-town, #location-address, #location-state, #location-postcode, #location-country').change( function(){
			//build address
			var addresses = [ jQuery('#location-address').val(), jQuery('#location-town').val(), jQuery('#location-state').val(), jQuery('#location-postcode').val() ];
			var address = '';
			jQuery.each( addresses, function(i, val){
				if( val != '' ){
					address = ( address == '' ) ? address+val:address+', '+val;
				}
			});
			//do country last, as it's using the text version
			if( jQuery('#location-country option:selected').val() != 0 ){
				address = ( address == '' ) ? address+jQuery('#location-country option:selected').text():address+', '+jQuery('#location-country option:selected').text();
			}
			if( address != '' && jQuery('#em-map').length > 0 ){
				geocoder.geocode( { 'address': address }, function(results, status) {
				    if (status == google.maps.GeocoderStatus.OK) {
						jQuery('#location-latitude').val(results[0].geometry.location.lat());
						jQuery('#location-longitude').val(results[0].geometry.location.lng());
					}
				    refresh_map_location();
				});
			}
		});
		
		//Finally, add autocomplete here
		//Autocomplete
		if( jQuery( "#em-location-data input#location-name, " ).length > 0 ){
			jQuery( "#em-location-data input#location-name" ).autocomplete({
				source: EM.locationajaxurl,
				minLength: 2,
				focus: function( event, ui ){
					jQuery("input#location-id" ).val( ui.item.value );
					return false;
				},			 
				select: function( event, ui ){
					jQuery("input#location-id" ).val(ui.item.id);
					jQuery("input#location-name" ).val(ui.item.value);
					jQuery('input#location-address').val(ui.item.address);
					jQuery('input#location-town').val(ui.item.town);
					jQuery('input#location-state').val(ui.item.state);
					jQuery('input#location-region').val(ui.item.region);
					jQuery('input#location-postcode').val(ui.item.postcode);
					if( ui.item.country == '' ){
						jQuery('select#location-country option:selected').removeAttr('selected');
					}else{
						jQuery('select#location-country option[value="'+ui.item.country+'"]').attr('selected', 'selected');
					}
					get_map_by_id(ui.item.id);
					jQuery('#em-location-data input, #em-location-data select').css('background-color','#ccc');
					jQuery('#em-location-data input#location-name').css('background-color','#fff');
					jQuery('#em-location-reset').show();
					return false;
				}
			}).data( "autocomplete" )._renderItem = function( ul, item ) {
				html_val = "<a>" + item.label + '<br><span style="font-size:11px"><em>'+ item.address + ', ' + item.town+"</em></span></a>";
				return jQuery( "<li></li>" ).data( "item.autocomplete", item ).append(html_val).appendTo( ul );
			};
			jQuery('#em-location-reset').click( function(){
				jQuery('#em-location-data input').css('background-color','#fff').val('');
				jQuery('#em-location-data select').css('background-color','#fff');
				jQuery('#em-location-data option:selected').removeAttr('selected');
				jQuery('input#location-id').val('');
				jQuery('#em-location-reset').hide();
				marker.setPosition(new google.maps.LatLng(0, 0));
				infoWindow.close();
				jQuery('#em-map').hide();
				jQuery('#em-map-404').show();
				marker.setDraggable(true);
				return false;
			});
			if( jQuery('input#location-id').val() != '0' && jQuery('input#location-id').val() != '' ){
				jQuery('#em-location-data input, #em-location-data select').css('background-color','#ccc');
				jQuery('#em-location-data input#location-name').css('background-color','#fff');
				jQuery('#em-location-reset').show();
				marker.setDraggable(false);
			}
		}
	}
}

/*
 * MAP FUNCTIONS
 */
var maps = {};
//Load single maps (each map is treated as a seperate map.
function em_maps() {
	//Find all the maps on this page
	jQuery('.em-location-map').each( function(index){
		el = jQuery(this);
		var map_id = el.attr('id').replace('em-location-map-','');
		em_LatLng = new google.maps.LatLng( jQuery('#em-location-map-coords-'+map_id+' .lat').text(), jQuery('#em-location-map-coords-'+map_id+' .lng').text());
		maps[map_id] = new google.maps.Map( document.getElementById('em-location-map-'+map_id), {
		    zoom: 14,
		    center: em_LatLng,
		    mapTypeId: google.maps.MapTypeId.ROADMAP,
		    mapTypeControl: false
		});
		var marker = new google.maps.Marker({
		    position: em_LatLng,
		    map: maps[map_id]
		});
		var infowindow = new google.maps.InfoWindow({ content: jQuery('#em-location-map-info-'+map_id+' .em-map-balloon').get(0) });
		infowindow.open(maps[map_id],marker);
		maps[map_id].panBy(40,-70);
		
		//JS Hook for handling map after instantiation
		//Example hook, which you can add elsewhere in your theme's JS - jQuery(document).bind('em_maps_location_hook', function(){ alert('hi');} );
		jQuery(document).triggerHandler('em_maps_location_hook', [maps[map_id], infowindow, marker]);
	});
	jQuery('.em-locations-map').each( function(index){
		var el = jQuery(this);
		var map_id = el.attr('id').replace('em-locations-map-','');
		var em_data = jQuery.parseJSON( jQuery('#em-locations-map-coords-'+map_id).text() );
		jQuery.getJSON(document.URL, em_data , function(data){
			if(data.length > 0){
				  var myLatlng = new google.maps.LatLng(data[0].location_latitude,data[0].location_longitude);
				  var myOptions = {
				    mapTypeId: google.maps.MapTypeId.ROADMAP
				  };
				  maps[map_id] = new google.maps.Map(document.getElementById("em-locations-map-"+map_id), myOptions);
				  
				  var minLatLngArr = [0,0];
				  var maxLatLngArr = [0,0];
				  
				  for (var i = 0; i < data.length; i++) {
					  if( !(data[i].location_latitude == 0 && data[i].location_longitude == 0) ){
						var latitude = parseFloat( data[i].location_latitude );
						var longitude = parseFloat( data[i].location_longitude );
						var location = new google.maps.LatLng( latitude, longitude );
						var marker = new google.maps.Marker({
						    position: location, 
						    map: maps[map_id]
						});
						marker.setTitle(data[i].location_name);
						var myContent = '<div class="em-map-balloon"><div id="em-map-balloon-'+map_id+'" class="em-map-balloon-content">'+ data[i].location_balloon +'</div></div>';
						em_map_infobox(marker, myContent, maps[map_id]);
						
						//Get min and max long/lats
						minLatLngArr[0] = (latitude < minLatLngArr[0] || i == 0) ? latitude : minLatLngArr[0];
						minLatLngArr[1] = (longitude < minLatLngArr[1] || i == 0) ? longitude : minLatLngArr[1];
						maxLatLngArr[0] = (latitude > maxLatLngArr[0] || i == 0) ? latitude : maxLatLngArr[0];
						maxLatLngArr[1] = (longitude > maxLatLngArr[1] || i == 0) ? longitude : maxLatLngArr[1];
					  }
				  }
				  // Zoom in to the bounds
				  var minLatLng = new google.maps.LatLng(minLatLngArr[0],minLatLngArr[1]);
				  var maxLatLng = new google.maps.LatLng(maxLatLngArr[0],maxLatLngArr[1]);
				  var bounds = new google.maps.LatLngBounds(minLatLng,maxLatLng);
				  maps[map_id].fitBounds(bounds);
				//Call a hook if exists
				jQuery(document).triggerHandler('em_maps_locations_hook', [maps[map_id]]);
			}else{
				el.children().first().html('No locations found');
			}
		});
	});
	em_location_input_ajax();
}
  
function em_map_infobox(marker, message, map) {
  var infowindow = new google.maps.InfoWindow({ content: message });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
}

 /* jQuery Tools 1.2.5 Overlay & Expose */
 (function(a){function t(d,b){var c=this,j=d.add(c),o=a(window),k,f,m,g=a.tools.expose&&(b.mask||b.expose),n=Math.random().toString().slice(10);if(g){if(typeof g=="string")g={color:g};g.closeOnClick=g.closeOnEsc=false}var p=b.target||d.attr("rel");f=p?a(p):d;if(!f.length)throw"Could not find Overlay: "+p;d&&d.index(f)==-1&&d.click(function(e){c.load(e);return e.preventDefault()});a.extend(c,{load:function(e){if(c.isOpened())return c;var h=q[b.effect];if(!h)throw'Overlay: cannot find effect : "'+b.effect+
 '"';b.oneInstance&&a.each(s,function(){this.close(e)});e=e||a.Event();e.type="onBeforeLoad";j.trigger(e);if(e.isDefaultPrevented())return c;m=true;g&&a(f).expose(g);var i=b.top,r=b.left,u=f.outerWidth({margin:true}),v=f.outerHeight({margin:true});if(typeof i=="string")i=i=="center"?Math.max((o.height()-v)/2,0):parseInt(i,10)/100*o.height();if(r=="center")r=Math.max((o.width()-u)/2,0);h[0].call(c,{top:i,left:r},function(){if(m){e.type="onLoad";j.trigger(e)}});g&&b.closeOnClick&&a.mask.getMask().one("click",
 c.close);b.closeOnClick&&a(document).bind("click."+n,function(l){a(l.target).parents(f).length||c.close(l)});b.closeOnEsc&&a(document).bind("keydown."+n,function(l){l.keyCode==27&&c.close(l)});return c},close:function(e){if(!c.isOpened())return c;e=e||a.Event();e.type="onBeforeClose";j.trigger(e);if(!e.isDefaultPrevented()){m=false;q[b.effect][1].call(c,function(){e.type="onClose";j.trigger(e)});a(document).unbind("click."+n).unbind("keydown."+n);g&&a.mask.close();return c}},getOverlay:function(){return f},
 getTrigger:function(){return d},getClosers:function(){return k},isOpened:function(){return m},getConf:function(){return b}});a.each("onBeforeLoad,onStart,onLoad,onBeforeClose,onClose".split(","),function(e,h){a.isFunction(b[h])&&a(c).bind(h,b[h]);c[h]=function(i){i&&a(c).bind(h,i);return c}});k=f.find(b.close||".close");if(!k.length&&!b.close){k=a('<a class="close"></a>');f.prepend(k)}k.click(function(e){c.close(e)});b.load&&c.load()}a.tools=a.tools||{version:"1.2.5"};a.tools.overlay={addEffect:function(d,
 b,c){q[d]=[b,c]},conf:{close:null,closeOnClick:true,closeOnEsc:true,closeSpeed:"fast",effect:"default",fixed:!a.browser.msie||a.browser.version>6,left:"center",load:false,mask:null,oneInstance:true,speed:"normal",target:null,top:"10%"}};var s=[],q={};a.tools.overlay.addEffect("default",function(d,b){var c=this.getConf(),j=a(window);if(!c.fixed){d.top+=j.scrollTop();d.left+=j.scrollLeft()}d.position=c.fixed?"fixed":"absolute";this.getOverlay().css(d).fadeIn(c.speed,b)},function(d){this.getOverlay().fadeOut(this.getConf().closeSpeed,
 d)});a.fn.overlay=function(d){var b=this.data("overlay");if(b)return b;if(a.isFunction(d))d={onBeforeLoad:d};d=a.extend(true,{},a.tools.overlay.conf,d);this.each(function(){b=new t(a(this),d);s.push(b);a(this).data("overlay",b)});return d.api?b:this}})(jQuery);
 (function(b){function k(){if(b.browser.msie){var a=b(document).height(),d=b(window).height();return[window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,a-d<20?d:a]}return[b(document).width(),b(document).height()]}function h(a){if(a)return a.call(b.mask)}b.tools=b.tools||{version:"1.2.5"};var l;l=b.tools.expose={conf:{maskId:"exposeMask",loadSpeed:"slow",closeSpeed:"fast",closeOnClick:true,closeOnEsc:true,zIndex:9998,opacity:0.8,startOpacity:0,color:"#fff",onLoad:null,
 onClose:null}};var c,i,e,g,j;b.mask={load:function(a,d){if(e)return this;if(typeof a=="string")a={color:a};a=a||g;g=a=b.extend(b.extend({},l.conf),a);c=b("#"+a.maskId);if(!c.length){c=b("<div/>").attr("id",a.maskId);b("body").append(c)}var m=k();c.css({position:"absolute",top:0,left:0,width:m[0],height:m[1],display:"none",opacity:a.startOpacity,zIndex:a.zIndex});a.color&&c.css("backgroundColor",a.color);if(h(a.onBeforeLoad)===false)return this;a.closeOnEsc&&b(document).bind("keydown.mask",function(f){f.keyCode==
 27&&b.mask.close(f)});a.closeOnClick&&c.bind("click.mask",function(f){b.mask.close(f)});b(window).bind("resize.mask",function(){b.mask.fit()});if(d&&d.length){j=d.eq(0).css("zIndex");b.each(d,function(){var f=b(this);/relative|absolute|fixed/i.test(f.css("position"))||f.css("position","relative")});i=d.css({zIndex:Math.max(a.zIndex+1,j=="auto"?0:j)})}c.css({display:"block"}).fadeTo(a.loadSpeed,a.opacity,function(){b.mask.fit();h(a.onLoad);e="full"});e=true;return this},close:function(){if(e){if(h(g.onBeforeClose)===
 false)return this;c.fadeOut(g.closeSpeed,function(){h(g.onClose);i&&i.css({zIndex:j});e=false});b(document).unbind("keydown.mask");c.unbind("click.mask");b(window).unbind("resize.mask")}return this},fit:function(){if(e){var a=k();c.css({width:a[0],height:a[1]})}},getMask:function(){return c},isLoaded:function(a){return a?e=="full":e},getConf:function(){return g},getExposed:function(){return i}};b.fn.mask=function(a){b.mask.load(a);return this};b.fn.expose=function(a){b.mask.load(a,this);return this}})(jQuery);
 
 /* jQuery timePicker - http://labs.perifer.se/timedatepicker/ @ http://github.com/perifer/timePicker commit 100644 */
 (function(a){function g(a){a.setFullYear(2001),a.setMonth(0),a.setDate(0);return a}function f(a,b){if(a){var c=a.split(b.separator),d=parseFloat(c[0]),e=parseFloat(c[1]);b.show24Hours||(d===12&&a.indexOf("AM")!==-1?d=0:d!==12&&a.indexOf("PM")!==-1&&(d+=12));var f=new Date(0,0,0,d,e,0);return g(f)}return null}function e(a,b){return typeof a=="object"?g(a):f(a,b)}function d(a){return(a<10?"0":"")+a}function c(a,b){var c=a.getHours(),e=b.show24Hours?c:(c+11)%12+1,f=a.getMinutes();return d(e)+b.separator+d(f)+(b.show24Hours?"":c<12?" AM":" PM")}function b(b,c,d,e){b.value=a(c).text(),a(b).change(),a.browser.msie||b.focus(),d.hide()}a.fn.timePicker=function(b){var c=a.extend({},a.fn.timePicker.defaults,b);return this.each(function(){a.timePicker(this,c)})},a.timePicker=function(b,c){var d=a(b)[0];return d.timePicker||(d.timePicker=new jQuery._timePicker(d,c))},a.timePicker.version="0.3",a._timePicker=function(d,h){var i=!1,j=!1,k=e(h.startTime,h),l=e(h.endTime,h),m="selected",n="li."+m;a(d).attr("autocomplete","OFF");var o=[],p=new Date(k);while(p<=l)o[o.length]=c(p,h),p=new Date(p.setMinutes(p.getMinutes()+h.step));var q=a('<div class="time-picker'+(h.show24Hours?"":" time-picker-12hours")+'"></div>'),r=a("<ul></ul>");for(var s=0;s<o.length;s++)r.append("<li>"+o[s]+"</li>");q.append(r),q.appendTo("body").hide(),q.mouseover(function(){i=!0}).mouseout(function(){i=!1}),a("li",r).mouseover(function(){j||(a(n,q).removeClass(m),a(this).addClass(m))}).mousedown(function(){i=!0}).click(function(){b(d,this,q,h),i=!1});var t=function(){if(q.is(":visible"))return!1;a("li",q).removeClass(m);var b=a(d).offset();q.css({top:b.top+d.offsetHeight,left:b.left}),q.show();var e=d.value?f(d.value,h):k,i=k.getHours()*60+k.getMinutes(),j=e.getHours()*60+e.getMinutes()-i,n=Math.round(j/h.step),o=g(new Date(0,0,0,0,n*h.step+i,0));o=k<o&&o<=l?o:k;var p=a("li:contains("+c(o,h)+")",q);p.length&&(p.addClass(m),q[0].scrollTop=p[0].offsetTop);return!0};a(d).focus(t).click(t),a(d).blur(function(){i||q.hide()});var u=a.browser.opera||a.browser.mozilla?"keypress":"keydown";a(d)[u](function(c){var e;j=!0;var f=q[0].scrollTop;switch(c.keyCode){case 38:if(t())return!1;e=a(n,r);var g=e.prev().addClass(m)[0];g?(e.removeClass(m),g.offsetTop<f&&(q[0].scrollTop=f-g.offsetHeight)):(e.removeClass(m),g=a("li:last",r).addClass(m)[0],q[0].scrollTop=g.offsetTop-g.offsetHeight);return!1;case 40:if(t())return!1;e=a(n,r);var i=e.next().addClass(m)[0];i?(e.removeClass(m),i.offsetTop+i.offsetHeight>f+q[0].offsetHeight&&(q[0].scrollTop=f+i.offsetHeight)):(e.removeClass(m),i=a("li:first",r).addClass(m)[0],q[0].scrollTop=0);return!1;case 13:if(q.is(":visible")){var k=a(n,r)[0];b(d,k,q,h)}return!1;case 27:q.hide();return!1}return!0}),a(d).keyup(function(a){j=!1}),this.getTime=function(){return f(d.value,h)},this.setTime=function(b){d.value=c(e(b,h),h),a(d).change()}},a.fn.timePicker.defaults={step:30,startTime:new Date(0,0,0,0,0,0),endTime:new Date(0,0,0,23,30,0),separator:":",show24Hours:!0}})(jQuery)