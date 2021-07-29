
async function init() {
  class WorldMap {
    constructor(svg) {
      this.height = 960;
      this.width = 600;
      this.x_leg = 900;
      this.y_leg = 275;
      this.svg = svg;
      this.yLegend = d3.scaleLinear()
        .domain([1, 9])
        .rangeRound([250, 450]);

      this.colorScheme = d3.schemeReds[9];
      //      colorScheme.unshift("#eee");
      this.colorScale = d3.scaleThreshold()
        .domain(d3.range(2, 80))
        .range(this.colorScheme);
    }
    generateParameter() {
      $("#parameter").html("");
      $("#parameter").append('<input type="radio" id="Female_Married_by_15" name="child_marriage" value="Female_Married_by_15" > <label for="Female_Married_by_15">Female Married By 15</label> ');
      $("#parameter").append('<div style="height: 20px;"> <br> </div>');
      $("#parameter").append('<input type="radio" id="Female_Married_by_18" name="child_marriage" value="Female_Married_by_18" checked> <label for="Female_Married_by_18">Female Married By 18</label> ');
      $("#parameter").append('<div style="height: 20px;"> <br> </div>');
      $("#parameter").append('<input type="radio" id="Male_Married_by_18" name="child_marriage" value="Male_Married_by_18" > <label for="Male_Married_by_18">Male Married by  18</label> ');


      //$("#parameter").append('<text>Female Married by 15</text> <label id="Female_Married_by_15" class="switch"> <input type="checkbox"> <span class="slider round"></span> </label>');
      //$("#parameter").append('<div style="height: 20px;"> <br> </div>');

      //$("#parameter").append('<text>Female Married by 18</text> <label id="Female_Married_by_18" class="switch"> <input type="checkbox"> <span class="slider round"></span> </label>');
      //$("#parameter").append('<div style="height: 20px;"> <br> </div>');

      //$("#parameter").append('<text>Male Married by 18</text> <label id="Male_Married_by_18" class="switch"> <input type="checkbox"> <span class="slider round"></span> </label>');
    }

    handlers() {

      svg = this.getSvg();
      clearAnnotation(svg);
      d3.select("#Female_Married_by_18").on("change", function (d) {
        obj.renderOnParameterChange(world, child_marriage_by_country, names, "Female_Married_by_18");
        annotate(svg, (width / 2) - 50, height / 2, 60, 225, 20, "#Female Married under 18  highest in Sub Saharan Region");
      })


      d3.select("#Female_Married_by_15").on("change", function (d) {
        console.log(d);
        clearAnnotation(svg);
        obj.renderOnParameterChange(world, child_marriage_by_country, names, "Female_Married_by_15");
        annotate(svg, (width / 2) - 50, height / 2, 60, 225, 20, "#Female Married under 15 highest in Sub Saharan Region");
      })
      d3.select("#Male_Married_by_18").on("change", function (d) {
        obj.renderOnParameterChange(world, child_marriage_by_country, names, "Male_Married_by_18");
        annotate(svg, (width / 2) - 250, height / 2, 60, 225, 20, "#Male Child marraige is less compare to Female in Sub Saharan as well as in world");
      })

    }
    getSvg() {
      return this.svg;
    }
    generateMessage(message) {
      $("#scene-message").html("<p>" + message + "</p>");
    }
    drawColorScale() {
      this.svg.selectAll("rect")
        .data(colorScale.range().map(function (d) {
          d = colorScale.invertExtent(d);
          if (d[0] == null) d[0] = yLegend.domain()[0];
          if (d[1] == null) d[1] = yLegend.domain()[1];
          return d;
        }))
        .enter().append("rect")
        .attr("height", 25)
        .attr("x", this.x_leg)
        .attr("y", function (d) {
          return yLegend(d[0]) + 12;
        })
        .attr("width", 23)
        .attr("fill", function (d) { return colorScale(d[0]); });
      /*Place the legend axis with the values in it*/
      this.svg
        .call(d3.axisRight(this.yLegend)
          .tickSize(0)
          .tickFormat(function (y, i) {
            if (i > 8) return "";
            if (i == 0) return "≤" + 10 + "%";
            if (i == 8) return "≥" + i * 10 + "%";
            return "≥" + i * 10 + "%";
          })
          .tickValues(this.colorScale.domain()))
        .select(".domain")
        .remove()
      this.svg.selectAll("text").attr("transform", "translate(920, 0)");

      /*legend title*/
      this.svg.append("text")
        .attr("font-family", "sans-serif")
        .attr("x", this.x_leg - 40)
        .attr("y", this.y_leg - 10)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-size", "11px")
        .attr("font-weight", "bold")
        .text("Child Marriage %");
    }
    async loadData() {
      this.names = await d3.csv("data/world-country-names.csv");
      this.world = await d3.json("data/world-110m2.json");
      this.child_marriage_by_country = await d3.csv("data/child_marriage_data.csv");
    }

    async drawWorldMap(world, child_marriage_by_country, names, parameter_name) {

      var projection = d3.geoMercator()
        .center([0, 5])
        .scale(150)
        .rotate([-180, 0]);


      var path = d3.geoPath()
        .projection(projection);


      function generateHTMLForToolTip(d) {
        var resultObject = search(d.id, names);
        if (typeof resultObject === 'undefined') {
          return "data_missing_in_unicef";
        }



        var child_marriage = searchByName((resultObject.name), child_marriage_by_country);
        if (typeof child_marriage === 'undefined') {
          return "data_missing_in_unicef";
        }

        var tooltipHTML = "<p>";
        tooltipHTML += "Country : ";
        tooltipHTML += child_marriage.name;
        tooltipHTML += "<br></br>"

        if (isNumeric(child_marriage.Female_Married_by_18)) {
          tooltipHTML += "Female child_marriage by 18 : ";
          tooltipHTML += child_marriage.Female_Married_by_18;
          tooltipHTML += "%";
          tooltipHTML += "<br></br>"
        }
        if (isNumeric(child_marriage.Female_Married_by_15)) {
          tooltipHTML += "Female child_marriage by 15: ";
          tooltipHTML += child_marriage.Female_Married_by_15;
          tooltipHTML += "%";
          tooltipHTML += "<br></br>"
        }
        if (isNumeric(child_marriage.Male_Married_by_18)) {
          tooltipHTML += "Male child_marriage by 18: ";
          tooltipHTML += child_marriage.Male_Married_by_18;
          tooltipHTML += "%";
          tooltipHTML += "<br></br>"
        }
        return tooltipHTML;
      }
      var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);



      // load and display the World
      this.svg.append('g')
        .attr("class", "country")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append('path')
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("d", path)
        .on("mousemove", function (d) {
          tooltip.classed("hidden", false)
            .style("top", (d3.event.pageY) + "px")
            .style("left", (d3.event.pageX + 10) + "px")
            //.style("top",  (d3.mouse(this)[1]) + "px")
            //.style("left",  "px")
            //          .style("width", "200")
            //          .style("height", "200")
            .style("opacity", .9)
            .html(generateHTMLForToolTip(d));

          console.log("onmousemove");
        })
        .on("mouseout", function (d, i) {
          //d3.select(this).attr("fill","white").attr("stroke-width",1);
          tooltip.classed("hidden", true)
            .style("opacity", 0);
        });
      // tooltips
      //.on('mouseover', function (d) {
      //  tip.show(d);
      //  d3.select(this)
      //    .style('opacity', 1)
      //    .style('stroke-width', 3);
      //})
      //.on('mouseout', function (d) {
      //  tip.hide(d);
      //  d3.select(this)
      //    .style('opacity', 0.8)
      //    .style('stroke-width', 0.3);
      //});
      this.svg.append('g')
        .append("path")
        .datum(topojson.mesh(world, world.objects.countries, function (a, b) { return a !== b; }))
        .attr("class", "country")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("d", path);


      //this.svg.selectAll("path")
      //  .attr("class", "countries")
      //  .attr("fill", function (d, i) {
      //    var resultObject = search(d.id, names);
      //    if (typeof resultObject === 'undefined') {
      //      return colorScale(0);
      //      //return "grey";
      //    }

      //    var child_marriage = searchByName((resultObject.name), child_marriage_by_country);
      //    if (typeof child_marriage === 'undefined') {
      //      return colorScale(0);
      //      //return "grey";
      //    }
      //    var val ;
      //    if(parameter_name === "Female_Married_by_18")
      //    {
      //      val = child_marriage.Female_Married_by_18;
      //      console.log(val)
      //    }
      //    else if(parameter_name === "Female_Married_by_15")
      //    {
      //      val = child_marriage.Female_Married_by_15
      //      console.log(val)
      //    }
      //    else if(parameter_name === "Male_Married_by_18")
      //    {
      //      val = child_marriage.Male_Married_by_18;
      //      console.log(val)
      //    }
      //    //console.log(child_marriage.name + "--> " +child_marriage.Female_Married_by_18);
      //    if (isNumeric(val))
      //    {
      //      console.log(val)
      //      return colorScale(Math.ceil(val / 10));
      //    }

      //    return colorScale(0);

      this.svg.selectAll("path")
        .attr("class", "countries")
        .attr("fill", function (d, i) {
          var resultObject = search(d.id, names);
          if (typeof resultObject === 'undefined') {
            return colorScale(0);
            //return "grey";
          }

          var child_marriage = searchByName((resultObject.name), child_marriage_by_country);
          if (typeof child_marriage === 'undefined') {
            return colorScale(0);
            //return "grey";
          }
          var val;
          if (parameter_name === "Female_Married_by_18") {
            val = child_marriage.Female_Married_by_18;
            //console.log(val)
          }
          else if (parameter_name === "Female_Married_by_15") {
            val = child_marriage.Female_Married_by_15
            //console.log(val)
          }
          else if (parameter_name === "Male_Married_by_18") {
            val = child_marriage.Male_Married_by_18;
            //console.log(val)
          }
          //console.log(child_marriage.name + "--> " +child_marriage.Female_Married_by_18);
          if (isNumeric(val)) {
            //console.log(val)
            return colorScale(Math.ceil(val / 10));
          }

          return colorScale(0);
        });   //  });

    }

    renderOnParameterChange(world, child_marriage_by_country, names, parameter_name) {

      this.svg.selectAll("*").remove();

      this.drawColorScale()

      this.svg.selectAll("path")
        .attr("class", "countries")
        .attr("fill", function (d, i) {
          return "white";
        }
        );
      this.drawWorldMap(world, child_marriage_by_country, names, parameter_name);

    }
  };

  currentSlide = 1;
  var width = 960,
    height = 600;

  var x_leg = 900;
  var y_leg = 275;
  var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);
  let obj = new WorldMap(svg);

  var scene_1_message = "<p> Child marriage is generally understood to mean marriages that take place before age 18, but for many girls, marriage occurs much earlier. In some countries, girls as young as 7 or 8 are forced by their families to marry much older men. </p> " + 
  "<p>Every year, 12 million girls marry before the age of 18. Child marriage happens across countries, cultures and religions.</p>" +
  "<p> The international community and country governments are increasingly aware of the negative impacts of child marriage, yet investments to end the practice remain limited. </p>" +
  "<p>In order to inspire greater commitments towards ending child marriage, this visualization demonstrates the negative impacts of the practice on population growth and its economic costs globally.</p>" 
  + "<p>This visualization is based on a study by  International Bank for Reconstruction and Development / The World Bank and The International Center for Research on Women (ICRW), Washington, DC</p>"

  obj.generateMessage(scene_1_message);
  obj.generateParameter()
  obj.handlers();

  yLegend = obj.yLegend;
  colorScheme = obj.colorScheme;
  colorScale = obj.colorScale;

  obj.drawColorScale();

  await obj.loadData();

  names = obj.names;
  world = obj.world;
  child_marriage_by_country = obj.child_marriage_by_country;

  obj.renderOnParameterChange(world, child_marriage_by_country, names, "Female_Married_by_15");
  obj.renderOnParameterChange(world, child_marriage_by_country, names, "Male_Married_by_18");
  obj.renderOnParameterChange(world, child_marriage_by_country, names, "Female_Married_by_18");
  annotate(svg, (width / 2) - 50, height / 2, 60, 225, 20, "#Female Married under 18  highest in Sub Saharan Region");
  //clearAnnotation(svg);
}
