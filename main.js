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

  async oldMap(func){
          mapObject[globalIndex] = func;
          func(closure, -1); // dry run
          while(dirty)
          {
            dirty = false;
            await runQueries(queries);
            returnValueEnd = resultFromAPI[0].map((record, index)=> {
              function dataFunc(value){
                //console.log(value);
                if(!record[value])
                {
                  if(!queries[globalIndex].projections.includes(value)){
                    queries[globalIndex].projections.push(value);
                    dirty = true;
                  }
                  return undefined;
                }
                else{
                  return record[value];
                }
              }
              localIndex = index;
            return func(dataFunc, index); 
            });
        }
        console.log(returnValueEnd);
        return returnValueEnd;
  }
  async map(func)
  {
    mapObject[globalIndex] = func;
    func(closure, -1); // dry run
    while(dirty)
    {
      await runQueries(queries);
      dirty = false;
      isSecondMapFinished = false;
      returnValueEnd = resultFromAPI[0].map((record, index)=> {
        function dataFunc(value){
          if(!record[value])
          {
            if(!queries[globalIndex].projections.includes(value)){
              queries[globalIndex].projections.push(value);
              dirty = true;
              isDirtyAgain = true;
            }
            return undefined;
          }
          else{
            return record[value];
          }
        }
        localIndex = index;
        if(mapObject[0].toString() == func.toString())
         return  func(dataFunc, index);

        while(!isSecondMapFinished){
          let recordLength = record[1].length;
            localObject = record[1].map((valueInside, index) => {
            function dataFuncLevel2(value){
              if(!valueInside[value])
              {
                if(!queries[globalIndex].projections.includes(value)){
                  queries[globalIndex].projections.push(value);
                  secondDirty = true;
                  dirty = true;
                  isDirtyAgain = true;
                  isNotFinishedYet = true;
                  dirtyValues.push(value);
                }
              return undefined;
              }
              else{
                return valueInside[value];
              }
            }
          //isNotFinishedYet = false;
          if (mapObject[1].toString() == func.toString())
            return func(dataFuncLevel2, index);
          });
          if(recordLength == index + 1)
            isSecondMapFinished = true;
          return localObject;
        }
      });
      // if(mapObject.length == 1){
      //   dirtyValues.forEach(element => {
      //     if(searchOneLevel(element, resultFromAPI[0]))
      //     {
      //       dirty = true;
      //     }
      //   });
      // }
      // else if(mapObject.length == 2){
      //   dirtyValues.forEach(element => {
      //     if(searchTwoLevel(element, resultFromAPI[0][0][1]))
      //     {
      //       dirty = true;
      //     }
      //   });
      //}
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
  await fetch("https://brfenergi.se/task-planner/MakumbaQueryServlet", {
    method: "POST",
    credentials: 'include',
    body: "request=" + encodeURIComponent(JSON.stringify({ queries: queriesCreated })) + "&analyzeOnly=false"
  }).then(response =>  response.json())
    .then(data => {
      //console.log(data);
      resultFromAPI = data.resultData;
    })
    .catch(e => console.error(e));
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
let dirtyValues = new Array();
let isDirtyAgain = false;
let isSecondMapFinished = false;
let isNotFinishedYet = true;


async function testTheProgram(){
  console.log(JSON.stringify(await from("Task t").where("1=1").map(
    data=> ({ 
      customerName:data("t.customer"), 
      days:data("t.days"), 
      end: data("t.days") == "70" ? data("t.endDate") : data("t.startDate") 
    })
    )));
}
 

