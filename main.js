class Query{
    constructor(string){
         this.q = string;
        } 
    where(string){ 
        queries[globalIndex + 1] = {
            projections: [],
            querySections: [this.q, string, null, null, null, null, null],
            parentIndex: globalIndex,
            limit: -1,
            offset: 0,
          }
          whereQuery = string;
        return  new Query(this.q + string);
    }
    map(func){
        globalIndex++;
        let val = func(null);
        globalIndex --;  // dry run
        queries[globalIndex + 1].projections = Object.values(val).filter(item => item);
        if(globalIndex == -1)
            return new Query("");
	 }
    groupBy(string){ 
        queries[globalIndex + 1] = {
            projections: [],
            querySections: [this.q, whereQuery, string, null, null, null, null],
            parentIndex: globalIndex,
            limit: -1,
            offset: 0,
          }
          groupByQuery = string;
        return  new Query(this.q +string);
    }
    orderBy(string){ 
        queries[globalIndex + 1] = {
            projections: [],
            querySections: [this.q, whereQuery, groupByQuery, string, null, null, null],
            parentIndex: globalIndex,
            limit: -1,
            offset: 0,
          }
          orderByQuery = string;
        return  new Query(this.q +string);
    }
    runQueries(){
        // let arrayObjects = [];
        // arrayObjects.push({ 
        //     projections: ["line.name"],
        //     querySections: ["ProductionLine line", undefined, null, null, null, null, null],
        //     parentIndex: -1,
        //     limit: -1,
        //     offset: 0
        // },{
        //     projections: [],
        //     querySections: ["Task t", "t.line = line", null, null, null, null, null],
        //     parentIndex: 0,
        //     limit: -1,
        //     offset: 0  
        // },
        // {
        //     projections: ["t1.customer", "t.days","line.name"],
        //     querySections: ["Task t1", "t1 = t", null, null, null, null, null],
        //     parentIndex: 1,
        //     limit: -1,
        //     offset: 0
        // });
        fetch("https://brfenergi.se/task-planner/MakumbaQueryServlet", {
          method: "POST",
          credentials: 'include',
          body: "request=" + encodeURIComponent(JSON.stringify({ queries: queries })) + "&analyzeOnly=false"
        }).then(response =>  response.json())
          .then(data => {
            console.log(data);
          })
          .catch(e => console.error(e))
    }
}

function from(string){
    queries[globalIndex + 1] = {
        projections: [],
        querySections: [string, undefined, null, null, null, null, null],
        parentIndex: globalIndex,
        limit: -1,
        offset: 0,
      }
    return new Query(string);
}

let globalIndex = -1;
let queries = [];
let whereQuery = undefined;
let groupByQuery = undefined;
let orderByQuery = undefined;
