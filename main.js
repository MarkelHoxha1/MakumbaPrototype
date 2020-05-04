class Query{
    constructor(string){
         this.q = string;
        } 
    where(string){ 
        queries[globalIndex] = {
            projections: [],
            querySections: [this.q, string, null, null, null, null, null],
            parentIndex: globalIndex - 1,
            limit: -1,
            offset: 0,
          }
          whereQuery = string;
        return  new Query(this.q + string);
    }
    map(func){
      func(closure, -1);
      return new Query("");
   }
    
    groupBy(string){ 
        queries[globalIndex] = {
            projections: [],
            querySections: [this.q, whereQuery, string, null, null, null, null],
            parentIndex: globalIndex - 1,
            limit: -1,
            offset: 0,
          }
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
          }
          orderByQuery = string;
        return  new Query(this.q +string);
    }
    runQueries(){
        console.log(queries);
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

function closure(value){
  queries[globalIndex].projections.push(value);
}

function from(string){
    queries[globalIndex + 1] = {
        projections: [],
        querySections: [string, undefined, null, null, null, null, null],
        parentIndex: globalIndex,
        limit: -1,
        offset: 0,
      }
      globalIndex ++;
    return new Query(string);
}

let globalIndex = -1;
let queries = [];
let whereQuery = undefined;
let groupByQuery = undefined;
let orderByQuery = undefined;
