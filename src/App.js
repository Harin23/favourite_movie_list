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

  useEffect(()=>{
    fetch('https://skyit-coding-challenge.herokuapp.com/movies')
    .then(res=>{
      return res.json();
    })
    .then(res=>{ setMovieData(res);})
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
        >
            <Column selectionMode="single" headerStyle={{width: '3em'}} />
            <Column field={'title'} header={'Title'} body={(row)=>row.title} />
            <Column field={'releaseDate'} header={'Year'} body={(row)=>row.releaseDate} />
            <Column field={'length'} header={'Running Time'} body={(row)=>row.length} />
            <Column field={'director'} header={'Director'} body={(row)=>row.director} />
            <Column field={'certification'} header={'Certification'} body={certificationBodyTemplate} />
            <Column field={'rating'} header={'Rating'} body={(row)=>(Math.round((row.rating/5)*10000)/100).toFixed(2).toString()+'%'} />
        </DataTable>
    </div>
  );
}

export default App;
