import React, { useState, useEffect } from 'react';
import './App.css';
import '../node_modules/primereact/resources/themes/saga-blue/theme.css'
import '../node_modules/primereact/resources/primereact.min.css'
import '../node_modules/primeicons/primeicons.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';

function App() {
  const [movieData, setMovieData] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(()=>{
    fetch('https://skyit-coding-challenge.herokuapp.com/movies')
    .then(res=>{
      return res.json();
    })
    .then(res=>{ setLoadingTable(false); setMovieData(res);})
    .catch(err=>{console.log(err)})
  }, [])

  let certificationBodyTemplate=(rowData)=>{
    const certificationClassName = classNames({
        'green-certification': rowData.certification === 'General',
        'red-certification': rowData.certification === '14 Accompaniment',
        'yellow-certification': rowData.certification === 'CA-PG'
    });

    return (
        <span className={certificationClassName}>
            {rowData.certification}
        </span>
    );
  }

  let filterFunc=(val, filter)=>{
    console.log(val, ((Math.round((val/5)*10000)/100).toFixed(2)+'%'), filter)
    return ((Math.round((val/5)*10000)/100).toFixed(2)+'%').startsWith(filter)!==false ? true:false;
  }
  
  return (
    <div className="App">
      {/* {console.log(movieData)} */}
        <DataTable value={movieData}
         dataKey='_id' 
         header='Favourite Movie List'
         rowHover
         selection={selectedMovie}
         selectionMode='radiobutton'
         onSelectionChange={(e)=>setSelectedMovie(e.value)}
         onRowSelect={()=>{console.log(selectedMovie)}}
         paginator={true}
         rows={10}
         globalFilterFields={['title', 'releaseDate', 'length', 'rating']}
         filterDisplay='row'
         loading={loadingTable}
 
        >
            <Column selectionMode="single" headerStyle={{width: '3em'}}/>
            <Column field={'title'} header={'Title'} body={(row)=>row.title} filter filterPlaceholder='search by title' showClearButton={false} showFilterMenu={false}/>
            <Column field={'releaseDate'} header={'Year'} body={(row)=>row.releaseDate} filter filterPlaceholder='search by year' showClearButton={false} showFilterMenu={false}/>
            <Column field={'length'} header={'Running Time'} body={(row)=>row.length} filter filterPlaceholder='search by time' showClearButton={false} showFilterMenu={false}/>
            <Column field={'director'} header={'Director'} body={(row)=>row.director} filter filterPlaceholder/>
            <Column field={'certification'} header={'Certification'} body={certificationBodyTemplate} filter filterPlaceholder/>
            <Column field={'rating'} header={'Rating'} body={(row)=>(Math.round((row.rating/5)*10000)/100).toFixed(2)+'%'} filter filterPlaceholder='search by rating' showClearButton={false} showFilterMenu={false} filterMatchMode="custom" filterFunction={filterFunc}/>
        </DataTable>
    </div>
  );
}

export default App;
