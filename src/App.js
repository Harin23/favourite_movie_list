import React, { useState, useEffect, useRef } from "react";
import "./App.css";
// import "../node_modules/primereact/resources/themes/saga-blue/theme.css";
// import "../node_modules/primereact/resources/primereact.min.css";
// import "../node_modules/primeicons/primeicons.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";

function App() {
  const [movieData, setMovieData] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loadingTable, setLoadingTable] = useState(true);
  const [uniqueDirectors, setUniqueDirectors] = useState([]);
  const [selectedDirectors, setSelectedDirectors] = useState(null);
  const [selectedCertifications, setSelectedCertifications] = useState(null);
  const myRef = useRef(null);
  // const [tableFilters, setTableFilters] = useState({
  //   'title': { value: null, matchMode: 'startsWith' },
  //   'releaseDate': { value: null, matchMode: 'startsWith'},
  //   'date': { value: null, matchMode: 'startsWith'},
  //   'representative': { value: null, matchMode: 'in' },
  //   'balance': { value: null, matchMode: 'equals' },
  //   'status': { value: null, matchMode: 'startsWith'},
  // })

  useEffect(() => {
    fetch("https://skyit-coding-challenge.herokuapp.com/movies")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        // console.log(res);
        setLoadingTable(false);
        setMovieData(
          res.map((row) => {
            row.rating = (Math.round((row.rating / 5) * 10000) / 100).toFixed(2) + "%";
            return row;
          })
        );
        setUniqueDirectors(
          res
            .map((row) => row.director)
            .filter(
              (director, index, selfArr) => selfArr.indexOf(director) === index
            )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let certificationBodyTemplate = (rowData) => {
    const certificationClassName = classNames({
      "green-certification": rowData.certification === "General",
      "red-certification": rowData.certification === "14 Accompaniment",
      "yellow-certification": rowData.certification === "CA-PG",
    });

    return (
      <span className={certificationClassName}>{rowData.certification}</span>
    );
  };

  let directorsListTemplate = (option) => {
    return (
      <div className="p-multiselect-representative-option">{option}</div>
    );
  };

  let directorColFilterTemplate = (options) => {
    // console.log(options);
    return (
      <MultiSelect
        value={selectedDirectors}
        options={uniqueDirectors}
        itemTemplate={directorsListTemplate}
        onChange={(e) => {
          myRef.current.filter(e.value, 'director', 'in');
          setSelectedDirectors(e.value);
        }}
        placeholder="Any"
        className="p-column-filter"
      />
    );
  };

  let certificationListTemplate = (option) => {
    const certificationClassName = classNames({
      "green-certification": option.name === "General",
      "red-certification": option.name === "14 Accompaniment",
      "yellow-certification": option.name === "CA-PG",
    });
    return (
      <span
        className={
          "p-multiselect-representative-option " + certificationClassName
        }
      >
        {option}
      </span>
    );
  };

  let certificationColFilterTemplate = (options) => {
    return (
      <Dropdown
        value={selectedCertifications}
        options={[
         "General",
          "CA-PG",
          "14 Accompaniment"
        ]}
        itemTemplate={certificationListTemplate}
        onChange={(e) => {
          myRef.current.filter(e.value, 'certification', 'equals');
          setSelectedCertifications(e.value);
        }}
        placeholder="Any"
        className="p-column-filter"
      />
    );
  };

  return (
    <div className="App">
      <DataTable
        ref={myRef}
        value={movieData}
        dataKey="_id"
        header="Favourite Movie List"
        rowHover
        selection={selectedMovie}
        selectionMode="radiobutton"
        onSelectionChange={(e) => setSelectedMovie(e.value)}
        // onRowSelect={() => {
        //   console.log(selectedMovie);
        // }}
        paginator={true}
        rows={10}
        filterDisplay="row"
        // filters={tableFilters}
        loading={loadingTable}
      >
        <Column selectionMode="single" headerStyle={{ width: "3em" }} />
        <Column
          field={"title"}
          header={"Title"}
          body={(row) => row.title}
          filter
          filterPlaceholder="search by title"
          showClearButton={false}
          showFilterMenu={false}
        />
        <Column
          field={"releaseDate"}
          header={"Year"}
          body={(row) => row.releaseDate}
          filter
          filterPlaceholder="search by year"
          showClearButton={false}
          showFilterMenu={false}
        />
        <Column
          field={"length"}
          header={"Running Time"}
          body={(row) => row.length}
          filter
          filterPlaceholder="search by time"
          showClearButton={false}
          showFilterMenu={false}
        />
        <Column
          header={"Director"}
          filterField={"director"}
          showFilterMenu={false}
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "14rem" }}
          body={(row) => <React.Fragment>{row.director}</React.Fragment>}
          filter
          filterElement={directorColFilterTemplate}
        />
        <Column
          filterField={"certification"}
          header={"Certification"}
          body={certificationBodyTemplate}
          filterMatchMode="equals"
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "14rem" }}
          filter
          filterElement={certificationColFilterTemplate}
          showFilterMenu={false}
        />
        <Column
          field={"rating"}
          header={"Rating"}
          filter
          filterPlaceholder="search by rating"
          showClearButton={false}
          showFilterMenu={false}
        />
      </DataTable>
    </div>
  );
}

export default App;
