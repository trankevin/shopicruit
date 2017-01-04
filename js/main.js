$( document ).ready(function() {
	//Get orders
	var orders = [];
	var count = 0;
	var total = 0;

	var products = {};
	var p_total = 0

	for (var i = 0; i < 3; i++) {
		var key = i + 1;
		var filename = "orders" + key + ".json";
		console.log(filename);
		$.getJSON(filename, function(res) {
			addOrder(res.orders);
			
			//console.log(res.orders.length);
		});
		
	};
	
	function addOrder(data) {
		$.each(data, function(index, val) {
				orders.push(val);
				total += parseFloat(val.total_price);

				//tally types
				$.each(val.line_items, function(i, v) {
					 var text = v.title;
					 text = text.split(" ");
					 $.each(text, function(key, x) {
					 	 // if (key == 0) {
					 	 // 	y = "type";
					 	 // } else if(key == 1){
					 	 // 	y = "material";
					 	 // } else 
					 	 if(key == 2){
					 	 	y = "item";
					 	 	if (!products[x]) {
					 	 		products[x] = 0;
					 	 	};
					 	 	products[x] += 1;
					 	 	p_total += 1;
					 	 };
					 	 
					 });
				});
			});
			
		// Set the table after 3	
		count++;
		if(count == 3) {
			setTable(orders);
			$('.total').html("Total Revenue: &#36;" + total.toFixed(2))
			//console.log(JSON.stringify(products));

			// $.each(products, function(ind, va) {
			setPie();
			// });
			
		}
		

	}

	//Pie chart
	function setPie(){
		var pieData = [];
		//var total = 0;
		var count = 0;
		$.each(products, function(i, val) {
			var percent = val / p_total * 100;
			var obj = {name : i, y: percent};
			if (i == "Computer") {
				obj.sliced = true;
				obj.selected = true;
			} 
			pieData.push(obj);
			count++;
			
			if (count == Object.keys(products).length) {
				//console.log(JSON.stringify(pieData));
				// Build the chart
		        Highcharts.chart('type', {
		                chart: {
		                    plotBackgroundColor: null,
		                    plotBorderWidth: null,
		                    plotShadow: false,
		                    type: 'pie'
		                },
		                title: {
		                    text: 'Product Types'
		                },
		                tooltip: {
		                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		                },
		                plotOptions: {
		                    pie: {
		                        allowPointSelect: true,
		                        cursor: 'pointer',
		                        dataLabels: {
		                            enabled: true,
		                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
		                            style: {
		                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
		                            }
		                        }
		                    }
		                },
		                series: [{
		                    name: 'Types',
		                    colorByPoint: true,
		                    data: pieData
		                }]
		            });

			}// end if 
		});
	}

	function setTable(data) {
		$('#orders-table').DataTable( {
        data: data,
        columns: [
	        { "data": "order_number" },
			{ "data": "customer.first_name" },
			{ "data": "customer.last_name" },
			{ "data": "customer.email" },
			{ "data": "subtotal_price" },
			{ "data": "total_tax" },
			{ "data": "total_price" },

        ],
        pageLength: 50,
        searching: false
    } );

	}
 
}); //end ready

