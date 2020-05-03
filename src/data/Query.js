var globalIndex = -1;
var queries = [];
var whereQuery = undefined;
var groupByQuery = undefined;
var orderByQuery = undefined;

class Query {
    constructor(string) {
        this.q = string;
    }

    where(string) {
        queries[globalIndex + 1] = {
            projections: [],
            querySections: [this.q, string, null, null, null, null, null],
            parentIndex: globalIndex,
            limit: -1,
            offset: 0,
        }
        whereQuery = string;
        return new Query(this.q + string);
    }

    map(func) {
        globalIndex++;
        let val = func(null);
        globalIndex--;  // dry run
        queries[globalIndex + 1].projections = Object.values(val).filter(item => item);
        if (globalIndex == -1)
            return new Query("");
    }

    groupBy(string) {
        queries[globalIndex + 1] = {
            projections: [],
            querySections: [this.q, whereQuery, string, null, null, null, null],
            parentIndex: globalIndex,
            limit: -1,
            offset: 0,
        }
        groupByQuery = string;
        return new Query(this.q + string);
    }

    orderBy(string) {
        queries[globalIndex + 1] = {
            projections: [],
            querySections: [this.q, whereQuery, groupByQuery, string, null, null, null],
            parentIndex: globalIndex,
            limit: -1,
            offset: 0,
        }
        orderByQuery = string;
        return new Query(this.q + string);
    }

    static from(string) {
        queries[globalIndex + 1] = {
            projections: [],
            querySections: [string, undefined, null, null, null, null, null],
            parentIndex: globalIndex,
            limit: -1,
            offset: 0,
        }
        return new Query(string);
    }

    static buildQuery() {
        return queries
    }

    static reset() {
        globalIndex = -1;
        queries = [];
        whereQuery = undefined;
        groupByQuery = undefined;
        orderByQuery = undefined;
    }
}


export default Query;
