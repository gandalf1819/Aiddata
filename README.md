# Aiddata

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

AidData's Core Research Release 3.1 is a corrected snapshot of AidData's entire project-level database from April 2016. This database includes commitment information for over 1.5 million development finance activities funded between 1947 and 2013, covers 96 donors, and includes ODA, OOF flows, Equity Investments, and Export Credits where available. 

https://www.aiddata.org/data/aiddata-core-research-release-level-1-3-1

## Mini-Project-1: Graph Design (Geo)

#### Visualization 1: 
How do the countries compare in terms of how much they receive and donate from other countries? Are there countries that donate much more than they receive or receive much more than they donate?

![MP1-viz-1](https://github.com/gandalf1819/Aiddata/blob/master/Mini-Project-1/Viz-1/MP1-Viz-1.png)

#### Visualization 2: 
Do the countries that receive or donate the most tend to cluster around specific geographical areas of the world? Are there neighboring countries that have radically different patterns in terms of how much they receive vs. how much they donate?

![MP1-viz-2](https://github.com/gandalf1819/Aiddata/blob/master/Mini-Project-1/Viz-2/MP1-Viz-2-legend.png)

#### Visualization 3: 
Are there any major differences in how the top 5 most frequent purposes of disbursements distribute geographically in terms of  countries that receive donations? Are there countries that tend to receive more of certain types of donations than others? 

![MP1-viz-3](https://github.com/gandalf1819/Aiddata/blob/master/Mini-Project-1/Viz-3/MP1-Viz-3.png)

## Mini-Project-2: Graph Design (Time)

#### Visualization 1: 
a) How does the amount donated vs. amount received change over time across all countries? b) Are there countries that mostly send or mostly receive and countries that have a similar amount of donations they receive and send? c) Are there countries that change their role over time? That is, they used to mostly send donations and turn into mostly receiving donations and vice-versa? d) Are there countries in which you can find a sudden increase ("peak") or a sudden decrease ("valley")?

**Donor:**<br>
![MP2-viz-1a](https://github.com/gandalf1819/Aiddata/blob/master/Mini-Project-2/Viz-1/Donor/MP2-Viz-2-donor.png)<br>

**Recipient:**<br>
![MP2-viz-1b](https://github.com/gandalf1819/Aiddata/blob/master/Mini-Project-2/Viz-1/Recipient/MP2-Viz-2-recipient.png)<br>

#### Visualization 2: 
Focusing on the purpose of the transaction. a) What are the top 10 purposes of disbursements (in terms of total amount of disbursement) and how does their amount compare over time?; b) Are there purposes that have a much higher/lower total amount among the top 10?; c) Are there purposes that show an increasing or decreasing trend (in terms of amount of disbursements) over time or that have sudden peaks or valleys?

![MP2-viz-2](https://github.com/gandalf1819/Aiddata/blob/master/Mini-Project-2/MP2-Viz-2.png)

#### Visualization 3: 
Focusing on a country that has a history of sending donations to many other countries (pick one): a) how does the set of countries it sends donations to change over time?; b) Are there countries that receive higher amounts in specific time periods? 

![MP2-viz-3](https://github.com/gandalf1819/Aiddata/blob/master/Mini-Project-2/MP2-Viz-3.png)

## Mini-Project-3: Graph Design (Networks)

#### Visualization 1: 
Create an overview of the relationships between countries so that it is possible to see who donates to whom and how much. Questions one should be able to answer are: 1) Who are the major donors and to which countries do they donate the most? And conversely, who are the major receivers and which countries do they receive from the most? [Optional: 2) Are there groups of countries that tend to donate/receive to/from a similar set of countries?]

**Donor:**<br>
![MP3-viz-1](https://github.com/gandalf1819/Aiddata/blob/master/Mini-Project-3/Viz-1/MP3-Viz-1-donor.png)<br>

**Recipient:**<br>
![MP3-viz-2](https://github.com/gandalf1819/Aiddata/blob/master/Mini-Project-3/Viz-1/MP3-Viz-1-recipient.png)

#### Visualization 3: 
Considering only the top 5 purposes of donation, how does the relationship between countries look like in terms of purposes? What purposes do countries donate for to other countries? Are there countries that donate to a given country using multiple purposes? Or do counties always donate using one single purpose when donating to another country?

![MP2-viz-3](https://github.com/gandalf1819/Aiddata/blob/master/Mini-Project-3/Viz-3/MP3-Viz-3-adj-matrix.png)

## References:

Heatmap: https://www.d3-graph-gallery.com/graph/heatmap_style.html

Multiple line chart: http://bl.ocks.org/asielen/44ffca2877d0132572cb

Grouped bar chart: https://observablehq.com/@d3/grouped-bar-chart

World Map: http://bl.ocks.org/d3noob/5193723

Adjacency Matrix: https://bl.ocks.org/micahstubbs/7f360cc66abfa28b400b96bc75b8984e

Force Directed Layout: https://observablehq.com/@d3/force-directed-graph
