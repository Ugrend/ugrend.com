"use client";
import * as React from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import PatsToast from './PatsToast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const columns: GridColDef[] = [
    {
      field: "player", 
      headerName: "Player", 
      width: 150,
      renderCell: (params: GridCellParams) => {
        const v = params.value as any;
        return <div style={{display: "flex"}}>
          <img src={v.avatar_uri} height={30}width={30}/>
          {v.name}
        </div>
      }


    },
    {field: "pats", headerName: "Total Pats"},
    {field: "dotes", headerName: "Total Dotes"},
    {field: "hugs", headerName: "Total Hugs"},
    {field: "slaps", headerName: "Total Slaps"}
]


const PatsTable = ({rows}: any) => {
  const [currentData, setCurrentData] = React.useState(rows);
  return <div>
<DataGrid
    columns={columns}
    rows={currentData}
    rowHeight={30}
    pageSizeOptions={[15]}
    initialState={
      {
        pagination:{
          paginationModel: {
            pageSize: 15
          }
        },
        sorting: {
          sortModel: [{field: 'pats', sort: "desc"}]
        }
      }
    }
  />
    <ToastContainer />
  <PatsToast updateData={setCurrentData} currentData={currentData} />
  </div>}
export default PatsTable
