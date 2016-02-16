"use strict";
var fs = require('fs');
var request = require('request');
var _ = require("underscore");

var hdataUrl = "http://www.hanokdb.kr/data/map/data.map.test.js";
request(hdataUrl, function(err, resp, html){
	let hdataRaw = resp.body.replace("var data =", "");
	hdataRaw = hdataRaw.replace(";", "");
	let hdata = JSON.parse(hdataRaw).hanok;
	createGeoJson(hdata);
});

function createGeoJson(data) {
	let gj = {type:"FeatureCollection", features:[]};
	_.each(data, function(row){
		let feature = {
			type:"Feature", 
			geometry:{type:"Point", coordinates:[+row.longitude, +row.latitude]},
			properties:row
		};
		if ((+row.longitude<=180&&+row.longitude>=-180) && (+row.latitude<=90&&+row.latitude>=-90)) {
			gj.features.push(feature);
		}
		
	});
	fs.writeFile("hanok.geojson", JSON.stringify(gj, null, 4));
}