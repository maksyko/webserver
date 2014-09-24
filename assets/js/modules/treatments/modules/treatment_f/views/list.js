define([
	'jquery',
	'backbone',
	'layouts/layoutBasic/layout',
	'text!modules/treatments/modules/treatment_f/templates/listTemplate.html',
	'modules/treatments/modules/treatment_f/views/item',
	'modules/treatments/modules/treatment_f/collections/treatment'

], function($, Backbone, Layout, listTemplate, ItemView, Collection) {

	var websocket;
	var websocket_btn;
	var ws_closer;

	function connect() {
		wsUrl = "ws://" + window.location.host + "/websocket";
		websocket = new WebSocket(wsUrl);
		websocket.onmessage = function(evt) { onMessage(evt) };		
	};

	function connect_btn() {
		wsUrl = "ws://" + window.location.host + "/ws_btn";
		websocket_btn = new WebSocket(wsUrl);
		websocket_btn.onmessage = function(evt) { onMessage_btn(evt) };		
	};

	function connect_closer() {
		wsUrl = "ws://" + window.location.host + "/ws_closer";
		ws_closer = new WebSocket(wsUrl);
		ws_closer.onmessage = function(evt) { onMessage_closer(evt) };		
	};

	function onMessage(evt) { 
        var obj = $.parseJSON(evt.data);    
        showScreen(obj); 
    };

	function onMessage_btn(evt) { 
        $("#work"+evt.data).removeClass('btn btn-success').addClass('btn btn-danger').text('закрыть');
        $("#status"+evt.data).show();
    };

    function onMessage_closer(id) { 
    	
        $("#work"+id.data).parent().parent().remove();

    };

    function showScreen(data) { 
    	var d = new Date();
    	
    	var dd = d.getDate();
    	if ( dd < 10 ) dd = '0' + dd;
    	var mm = d.getMonth()+1 ;
    	if ( mm < 10 ) mm = '0' + mm;

    	var hh = d.getHours();
    	if ( hh < 10 ) hh = '0' + hh;
    	var m = d.getMinutes();
    	if ( m < 10 ) m = '0' + m;
    	var s = d.getSeconds();
    	if ( s < 10 ) s = '0' + s;
    	

    	var datetime = d.getFullYear() + '-' + mm + '-' +dd+ ' '+ hh+':'+m+':'+s;
    	$('#list').prepend('<tr class="'+data.sh_cli_id+'"><td>'+data.email+'</td><td>'+data.phone+'</td><td>'+data.vopros+'</td><td style="width:30px;">'+datetime+'</td><td style="width:30px;"><div class="in_work btn btn-success" id="work'+data.sh_cli_id+'" data="'+data.sh_cli_id+'">в работу</div></td><td style="width:30px;"><span class="status label label-danger" id="status'+data.sh_cli_id+'" style="display:none;">В работе</span></td></tr>');
    	$("."+data.sh_cli_id).css('backgroundColor', 'yellow').animate({ backgroundColor: "white"}, 3000);

	}    	
	var List = Backbone.View.extend({
		
		template: _.template(listTemplate),
		events: {
			'click .in_work' : 'in_work'
		},
		initialize: function() {
			connect();
			connect_btn();
			connect_closer();
			this.collection = new Collection();
			this.collection.fetch({
				reset: true
			});
			this.listenTo(this.collection, 'reset', this.render);
			return this;
		},

		render: function() {
			this.$el.html(this.template(this));
			this.collection.each(this.renderOne, this);
			return this;
		},
		renderOne: function(item) {
			var itemView = new ItemView({
				model: item
			});
			$("#list").append(itemView.render().el);
		},
		in_work: function(event) {
			id = $(event.currentTarget).attr('data');
			$.ajax({
	            url : '/api/treatments?condition=in_work&id='+id,
	            type: "POST",
	            dataType: "json",
	            success: function(){
	            	              
	            }
	        });
			if(websocket_btn.readyState == websocket_btn.OPEN) {				
				websocket_btn.send(id);
				window.location = '/treatment_f/edit/' + id;
			} else {
				alert('websocket is not connected');
			}	
		}
	});

	return Layout.extend({
		content: List
	});

});