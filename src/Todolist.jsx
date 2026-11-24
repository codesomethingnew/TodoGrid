
import { useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import { DataGrid } from '@mui/x-data-grid';

import './App.css';

function Todolist() {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (!description.trim() || !date || !status.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newTodo = {
      id: Date.now(),
      description,
      date,
      status
    };

    setTasks(oldTasks => [...oldTasks, newTodo]);

    setDescription('');
    setDate('');
    setStatus('');
  };

  const deleteTask = (id) => {
    setTasks(oldTasks =>
      oldTasks.filter(task => task.id !== id)
    );
  };

  const clearTasks = () => {
    setTasks([]);
  };

  const columns = [
    {
      field: 'description',
      headerName: 'Description',
      flex: 1
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.7,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="Delete todo">
          <IconButton
            color="error"
            onClick={() => deleteTask(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  return (
    <div className="App">
      <h1>My Todolist</h1>

      <div className="form">
        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <input
          placeholder="Status"
          value={status}
          onChange={e => setStatus(e.target.value)}
        />

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={addTask}
        >
          Add
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={clearTasks}
          disabled={tasks.length === 0}
        >
          Clear
        </Button>
      </div>

      <div className="grid">
        <DataGrid
          rows={tasks}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
                page: 0
              }
            }
          }}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}

export default Todolist;
