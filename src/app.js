// make console.log write to the page for better in-browser experience
(function () {
    let body = document.querySelector('body');
    body.style['fontFamily'] = 'monospace';
    body.style['fontSize'] = '2em';
    // console.log = function (x) { body.innerText += x + '\n'; };
}());


let crackingIR = d3.json("src/data.json", (data) => {
    // For simplicity, we'll scan the records and give each a primary key
    data.map((d) => {
        d['id'] = `${d.year}_${d.measureTypeCd}_${d.systemCd}`;
        return d;
    });

    let dataMap = _.groupBy(data, 'measureTypeCd');
    let crackingData = dataMap['CRACKING'];
    let crackingIR = _.groupBy(crackingData, 'systemCd')['interstate'];
    let crackingYear = crackingIR[0];


    // Create a Linear scale
    let linearScale = d3.scaleLinear()
        .domain([0, crackingYear.totalMiles])
        .range([0, 600])
        .clamp(true);

    console.log(linearScale(crackingYear.poor));
    console.log(linearScale(crackingYear.fair));
    console.log(linearScale(crackingYear.good));


    // Perform a data join between the dom elements and the data, the returned value is
    // a reference to the update selection
    let update = d3
        .select('#chart')
        .append('svg')
        .attr('width', 600)
        .attr('height', 400)
        .attr('stroke', 'darkgrey')
        .attr('stroke-width', 1)
        .selectAll('rect')


        // The data function accepts a key function as the second parameter.
        // In that function, d is a data element and context of the function is
        // the selected element
        .data(crackingIR, function (d) {
            return d ? d.name : this.innerText;
        });


    // UPDATE
    // we are executing the update selection data handling here; that is, elements
    // that already exist
    update
        .style('color', 'blue');


    // ENTER
    // enter portion of join, new data entering, so elements need to be created
    let enter = update.enter()
        .append('rect')
        .text(function (d) {
            return d.id;
        })
        .attr('y', (d, i) => { // i is the data index, height is 33 for each rect
            return i * 33;
        })
        .attr('width', d => linearScale(d['good']))
        .attr('class', 'bar');


    // EXIT
    // exit portion of join, elements leaving
    update.exit().remove();

    // MERGE
    // merge is performed on all remaining elements after the joins have completed...so all
    // remaining elements post-join
    update.merge(enter);


});


// d3.select('.title')
//     .append('div')
//     .style('color', 'red')
//     .html('Inventory <b>SALE</b>')
//     .append('button')
//     .style('display', 'block')
//     .text('submit');


