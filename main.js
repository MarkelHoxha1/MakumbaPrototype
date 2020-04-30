class Query{
    constructor(string){ this.q= string;} 
    where(string){ return  new Query(this.q +" WHERE "+string);}
    map(func){
	/*... func(element, index, array)...*/
    }
    groupBy(string){ return  new Query(this.q +" GROUP BY "+string);}
    orderBy(string){ return  new Query(this.q +" ORDER BY "+string);}
}


function from(string){
    return new Query("FROM "+string);
}

// root map pseudocode
function map(func){
	
	func(null , -1);   // dry run
	
	while(true){
	    const data= queries.execute() ; // only at the root
	    
	    try{
		return data.map(func);
	    }catch(e){ if(e==="new queries") continue; }
	}
}

// map() execution flow
function map(func){
    let fv_m1=  func(null, -1, []);  // dry run
    let fv0= func(val, 0, [val, val1, ...rest]);
    let fv1=func(val1, 1, [val, val1 , ...rest]);

    return  [fv0, fv1];
}
