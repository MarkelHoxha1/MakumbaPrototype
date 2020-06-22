class Query{
	constructor(string){
		this.q = string;
	}
	where(string){ 
		if(!isDirtyAgain)
		{
			queries[globalIndex] = {
				projections: [],
				querySections: [this.q, string, null, null, null, null, null],
				parentIndex: globalIndex - 1,
				limit: -1,
				offset: 0,
			};
			whereQuery = string;
		}
		return new Query(this.q + string);
	}
	async map(func)
	{
		mapObject[globalIndex] = func;
		func(closure, -1); // dry run
		//await runQueries(queries);
		while(dirty)
		{
			await runQueries(queries);
				dirty = false;
				isSecondMapFinished = false;
				if(resultFromAPI){
					returnValueEnd = resultFromAPI[0].map((record, index)=> {
						function dataFunc(value){
							if(!record[value])
							{
								if(!queries[globalIndex].projections.includes(value)){
									queries[globalIndex].projections.push(value);
									dirty = true;
									queriesCopy = [];
									isDirtyAgain = true;
									resultFromAPICopy = [];
								}
								return undefined;
							}
							else {
								return record[value];
							}
						}
						localIndex = index;
						if(mapObject[0].toString() == func.toString()){
							return func(dataFunc, index);
						}
						while(!isSecondMapFinished){
							let recordLength = record[1].length;
							localObject = record[1].map((valueInside, index) => {
							function dataFuncLevel2(value){
									if(!valueInside[value])
									{
										if(!queries[globalIndex].projections.includes(value)){
											queries[globalIndex].projections.push(value);
											dirty = true;
											queriesCopy = [];
											isDirtyAgain = true;
											resultFromAPICopy = [];
										}
										return undefined;
									}
									else{
										return valueInside[value];
									}
								}
								if (mapObject[1].toString() == func.toString()){
									return func(dataFuncLevel2, index);
								}
							});
	
						if(recordLength == index + 1){
							isSecondMapFinished = true;
						}
						return localObject;
						}
					});
				}
				if(JSON.stringify(queriesCopy) != JSON.stringify(queries)){
					dirty = true;
				}
		}
		return returnValueEnd;
}
	groupBy(string){ 
		queries[globalIndex] = {
			projections: [],
			querySections: [this.q, whereQuery, string, null, null, null, null],
			parentIndex: globalIndex - 1,
			limit: -1,
			offset: 0,
		  };
		  groupByQuery = string;
		return  new Query(this.q +string);
	}
	orderBy(string){ 
		queries[globalIndex] = {
			projections: [],
			querySections: [this.q, whereQuery, groupByQuery, string, null, null, null],
			parentIndex: globalIndex - 1,
			limit: -1,
			offset: 0,
		  };
		  orderByQuery = string;
		return  new Query(this.q +string);
	}
  }
  
  function getResults(queries){
	return runQueries(queries);
  }

  function searchOneLevel(nameKey, myArray){
	for (var i=0; i < myArray.length; i++) {
		if (myArray[i].name === nameKey) {
			return myArray[i];
		}
	}
  }
  
  function searchTwoLevel(nameKey, myArray){
	for (var i=0; i < myArray.length; i++) {
		if (myArray[i].name === nameKey) {
			return myArray[i];
		}
	}
  }
  
  function getKey(value) {
	return [...mapObject].find(([key, val]) => val.toString() == value.toString());
  }
  
  function closure(value){
  //console.log(value);
	queries[globalIndex].projections.push(value);
  }
  
  function anotherClosure(value){
	console.log(value);
  }
  
  async function runQueries(queriesCreated){
	//console.log(queriesCreated);
	if(JSON.stringify(queriesCopy) == JSON.stringify(queriesCreated))
	{
		await 1;
	}
	else {
		queriesCopy = queriesCreated;
		let response = await fetch("https://brfenergi.se/task-planner/MakumbaQueryServlet", {
		method: "POST",
		credentials: 'include',
		body: "request=" + encodeURIComponent(JSON.stringify({ queries: queriesCreated })) + "&analyzeOnly=false"
		});
		hasResultFromAPI = false;
		let data = await response.json();
		console.log(data);
		resultFromAPI = data.resultData;
		if(JSON.stringify(resultFromAPI) !== JSON.stringify(resultFromAPICopy)){
			dirty = true;
			isNotFinishedYet = true;
		}
		else{
			isNotFinishedYet = false;
		}
		resultFromAPICopy = resultFromAPI;
	}
  }
  
  function from(string){
	if(!isDirtyAgain)
	{
	  queries[globalIndex + 1] = {
		  projections: [],
		  querySections: [string, undefined, null, null, null, null, null],
		  parentIndex: globalIndex,
		  limit: -1,
		  offset: 0,
		};
		globalIndex ++;
	}
	return new Query(string);
  }
  
  let globalIndex = -1;
  let queries = [];
  let whereQuery = undefined;
  let groupByQuery = undefined;
  let orderByQuery = undefined;
  let dirty = true;
  let secondDirty = true;
  let firstMap = false;
  let resultFromAPI;
  let returnValueEnd;
  let localObject;
  let localIndex;
  let mapObject = new Map();
  let isDirtyAgain = false;
  let isSecondMapFinished = false;
  let isNotFinishedYet = true;
  let resultFromAPICopy;
  let queriesCopy = [];
  let hasResultFromAPI = false;
  
  
  async function testTheProgram(){
	console.log(JSON.stringify(await from("Task t").where("1=1").map(
	  data=> ({ 
		customerName:data("t.customer"), 
		days:data("t.days"), 
		end: data("t.days") == "70" ? data("t.endDate") : data("t.startDate") 
	  })
	  )));
  }

//   console.log(await from("ProductionLine line").map(
//     data=>
// 	({
// 	    lineName: data("line.name") == "L1" ? data("line.name") : "Testing",
// 	    tasks: from("Task t").where("t.line=line").map(
// 		data=>
// 		    ({
// 			customerName:data("t.customer"),
// 			end: data("t.days") == "70" ? data("t.endDate") : data("t.startDate") ,
// 		    }))
// 	})));

// from("ProductionLine line").map(   // index 0
//     data=>
// 	({
// 	    lineName: data("line.name"),
// 	    tasks: from("Task t").where("t.line=line").map(  // index1
//             data=>
//                 ({
//                 customerName:data("t.customer"),
//                 testCase:data("line.name")=="L2" ? data("t1.days") : data("t1.startDate"),

//                 })),
// 	    unplannedTasks: from("Task t1").where("t1.line=null").map( //2
//             data=> ({
// 			    customerName:data("t1.customer") 
//         }))
// 	}));


// from("ProductionLine line").map(   // index 0
//     data=>
// 	({
// 	    lineName: data("line.name"),
// 	    tasks: from("Task t").where("t.line=line").map(  // index1
//             data=>
//                 ({
//                 customerName:data("t.customer"),
//                 testCase:data("line.name")=="L2" ? data("t.days") : data("t.startDate"),

//                 })),
// 	    unplannedTasks: from("Task t1").where("t1.line=null").map( //2
//             data=> ({
// 			    customerName:data("t1.customer") 
//         }))
// 	}));