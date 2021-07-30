//Used for common functions and data acros scenes
var currentSlide = 0;
var transitionTimer = 100;

function nextPrevHandlers() {

  //  clearAnnotation(svg);
  d3.select("#next-button").on("click", function (d) {
    if(currentSlide === 4 )
    {
      currentSlide = 4; 
    }
    else
    {
    currentSlide = currentSlide + 1;
    }
    changeRoute("scene-"+currentSlide+".html");
    console.log("Next button Clicked" + currentSlide)
  });
  d3.select("#prev-button").on("click", function (d) {
    if(currentSlide === 1 )
    {
      currentSlide = 1; 
    }
    else
    {
    currentSlide = currentSlide - 1;
    }
    changeRoute("scene-"+currentSlide+".html");
    console.log("Prev button Clicked")
  });
}

function displayCurrentSlide(slideNumber)
{
  for (let i = 1; i < 5; i++) {
    var button_id = "scene-btn-" + i;
    document.getElementById(button_id).style.backgroundColor = '#F08080';
  }

  var button_id = "scene-btn-" + slideNumber;
  document.getElementById(button_id).style.backgroundColor = '#3E81A8';
  /*
  TODO
  if(slideNumber === 4 )
  {
    //disable next
  }
  else if(slideNumber ===  1)
  {
    //disable Prev
  }
  else
  {
    //enable next enable prev
  }
  */
}



function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}
function annotate(chartSVG,xcoord,ycoord,x2coord,y2coord,radius,textx) 
{
    var transitionDuration = 1000;
    console.log("annotate");
    /*var xcoord = 0,
        ycoord = 0,
        x2coord = 0,
        y2coord = 0;
    */

    chartSVG.append("circle")
    //chartSVG.selectAll("#antCir")
        .transition().duration(transitionDuration)
        .attr("id", "antCir")
        .style("stroke", "blue")
        .style("opacity", "0.3")
        .style("border", "2px")
        .style("stroke-width", 5)
        .attr("cx", function() {
            return x2coord;
        })
        .attr("cy", function() {
            return y2coord;
        })
        .attr("r", radius);

    console.log("xcoord:" + xcoord + ", ycoord:" + ycoord + " - currentSlide]: " + currentSlide);

    chartSVG.append("line")
    //chartSVG.selectAll("#antPath")
        .transition().duration(transitionDuration)
        .attr("id", "antPath")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("x1", xcoord)
        .attr("y1", ycoord)
        .attr("x2", x2coord)
        .attr("y2", y2coord)

    chartSVG.append("text")
    //chartSVG.selectAll("#antText")
        .transition().duration(transitionDuration)
        .attr("id", "antText")
        .attr("x",  xcoord)
        .attr("y", ycoord)
        .attr("font-family", "sans-serif")
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "blue")
        .text(textx);
}

function clearAnnotation(svg) {
    console.log("Clearing Annotations")
    //$("#antCir").html("");
    //$("#antPath").html("");
    //$("#antText").html("");
    svg.selectAll("#antCir").remove();
    svg.selectAll("#antPath").remove();
    svg.selectAll("#antText").remove();
}



  function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  function search(id, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (parseInt(myArray[i].id) === parseInt(id)) {
        return myArray[i];
      }
    }
  }

  function searchByName(name, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name === name) {
        //console.log("found " + myArray[i].name + "with " + name);
        return myArray[i];
      }
    }
  }

nextPrevHandlers();

