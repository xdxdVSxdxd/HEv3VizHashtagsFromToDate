var svg;
var sizebub = 800;
var bubble;
var duration = 200;
var delay = 0;

$( document ).ready(function() {

	$('.datepicker').datepicker({ format: "yyyy-mm-dd"});

	$("#vizualize").click(function(){
		var elem = document.getElementById("fromdate");
		var instance = M.Datepicker.getInstance(elem);
		var fromdate = instance.toString();
		elem = document.getElementById("todate");
		instance = M.Datepicker.getInstance(elem);
		var todate = instance.toString();
		if(fromdate=="" || todate==""){
			alert("Please select values for the two dates.");
		} else {
			var from = Date.parse(fromdate);
			var to = Date.parse(todate);
			if(from>=to){
				alert("The From date must be before the To date.");
			} else {
				gendraph(fromdate,todate);
			}
		}
	});
   
 
});



function gendraph(fromdate,todate){


	$.getJSON("https://stopdisinformation.com/~capture1/HEv3/api/getTagsFromToDate",
		{
			"researches": "125,126",
			"fromdate": fromdate,
			"todate": todate 
		},
		function(data){
			data = data.results;
			//console.log(data);


			$("#visualization").html("");

			svg = d3.select('#visualization').append('svg').attr('width', $("#visualization").width()).attr('height', sizebub);
			bubble = d3.layout.pack()
				.size([sizebub, sizebub])
				.value(function(d) {return d.c;})
			
			var nodes = bubble.nodes(data)
   				// filter out the outer bubble
   				.filter(function(d) { return !d.children; });
   			var g = svg.append('g');
   			var vis = svg.selectAll('circle')
   			.data(nodes, function(d) { return d.label; });


   			//console.log(nodes);
			
			vis.enter().append('circle')
			.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
			.attr('r', function(d) { return d.r; })
			.attr('class', function(d) { return d.label + " circleclass"; });

			vis.select('circle').transition()
			.duration(duration)
			.delay(function(d, i) {delay = i * 7; return delay;}) 
			.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
			.attr('r', function(d) { return d.r; })


			vis.select('text').transition()
			.duration(duration)
			.delay(function(d, i) {delay = i * 7; return delay;}) 
			.attr("x", function(d){ return d.x; })
			.attr("y", function(d){ return d.y; })
            .attr("font-size", function(d){
                return d.r/5;
            });

			var entered = vis.enter();

			entered.append('circle')
				.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
				.attr('r', function(d) { return d.r; })
				.attr('class', function(d) { return d.label  + " circleclass"; })
				.style('opacity', 0) 
				.transition()
				.duration(duration * 1.2)
					.style('opacity', 1);

				// append labels
			entered.append("text")
			.attr("x", function(d){ return d.x; })
			.attr("y", function(d){ return d.y; })
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.label;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

			vis.exit()
				.transition()
				.duration(duration + delay)
				.style('opacity', 0)
				.remove();


		}
	);

}




function wrap(d) {
    var text = d3.select(this),
      width = d.r * 2,
      x = d.x,
      y = d.y,
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1,
      tspan = text.text(null).append("tspan").attr("x", x).attr("y", y);
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + "em").text(word);
      }
    }
}