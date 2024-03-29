"use client";
import * as React from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';


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
  return <DataGrid
    columns={columns}
    rows={rows}
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
}
export default PatsTable
