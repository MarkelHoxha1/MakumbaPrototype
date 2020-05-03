import React, { useEffect, useState } from 'react';
import './App.css';
import Query from './data/Query';
import ApiService from './data/ApiService';

const App = (props) => {
    const [responseData, setResponseData ] = useState('')

    function fetchData(){
        Query.reset();
        Query.from("ProductionLine line").map(
            data =>
                ({
                    lineName: ("line.name"),
                    tasks: Query.from("Task t").where("t.line=line").map(
                        data => ({
                            subtask: Query.from("Task t1").where("t1=t").map(
                                data =>
                                    ({
                                        customerName: ("t1.customer"),
                                        days: ("t.days"),
                                        name: ("line.name")
                                    }))
                        }))
                })
        );
        const queries = Query.buildQuery()
        ApiService.getData(queries).then(response => {
            console.log('Query Response', response)
            if(response.resultData){
                setResponseData(JSON.stringify(response.resultData))
            }
        }).catch(error => {
            console.log('Query error', error)
        })
    }

    return (
        <div className="App">
            <button onClick={fetchData}>
                Fetch Data     
            </button>
            <p>{responseData}</p>
        </div>
    );
}

export default App;
