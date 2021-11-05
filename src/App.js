import React, { useState, useEffect } from 'react';
import './App.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function App() {
  const [movieData, setMovieData] = useState(null)

  useEffect(()=>{
    fetch('https://skyit-coding-challenge.herokuapp.com/movies')
    .then(res=>{
      return res.json();
    })
    .then(res=>{ setMovieData(res);})
    .catch(err=>{console.log(err)})
  }, [])
  // const dynamicColumns = Object.keys(movieData[0]).filter(key=>{
  //   if(key === '__v' || key === '_id'){
  //     return false;
  //   }else{
  //     return true;
  //   }
  // }).map((col,i) => {
  //   return <Column key={col} field={col} header={col} />;
  // });
  return (
    <div className="App">
      {console.log(movieData)}
        <DataTable value={movieData} dataKey='_id' header='Favourite Movie List' rowHover selection selectionMode='radiobutton'>
            <Column field={'title'} header={'Title'} body={(row)=>row.title}/>
            <Column field={'releaseDate'} header={'Year'} />
            <Column field={'length'} header={'Running Time'} />
            <Column field={'director'} header={'Director'} />
            <Column field={'certification'} header={'Certification'} />
            <Column field={'rating'} header={'Rating'} />
        </DataTable>
    </div>
  );
}

export default App;
