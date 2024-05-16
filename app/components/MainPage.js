"use client";
import React, { useEffect, useState } from "react";
import styles from "./MainPage.module.css";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
  Portal,
  Box,
  Button,
} from "@chakra-ui/react";
import Form from "./Form";
import axios from "axios";
// import { useSelector } from "react-redux";

const MainPage = () => {
  const [tableData, setTableData] = useState(null);
  const [onSave, setOnSave] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const tableInfo = async () => {
      try {
        const response = await axios.get("https://cruds-assignment.onrender.com/api/getUsers");
        setTableData(response.data.users);
      } catch (error) {
        console.log("Error fetching table data:", error);
      }
    };
    tableInfo();
    if (onSave) {
      setOnSave(false); // Reset onSave after fetching tableData
    }
  }, [onSave]);

  const handleRowClick = (id) => {
    const selectedIndex = selectedRows.indexOf(id);
    if (selectedIndex === -1) {
      // Row not selected, add to selectedRows
      setSelectedRows([...selectedRows, id]);
    } else {
      // Row already selected, remove from selectedRows
      const updatedSelectedRows = [...selectedRows];
      updatedSelectedRows.splice(selectedIndex, 1);
      setSelectedRows(updatedSelectedRows);
    }
  };

  const handleDelete = async (id) => {
    try {
      // for (const id of selectedRows) {
        await axios.delete(`https://cruds-assignment.onrender.com/api/users/${id}`);
      // }

      // Refresh table data after deletion
      const response = await axios.get("https://cruds-assignment.onrender.com/api/getUsers");
      setTableData(response.data.users);
      // Clear selected rows after deletion
      setSelectedRows([]);
    } catch (error) {
      console.log("Error deleting rows:", error);
    }
  };

  // const handleDelete = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:5002/api/users/${3}`);
  //     setTableData(response.data.users);
  //   } catch (error) {
  //     console.log("Error fetching table data:", error);
  //   }
  // };
  console.log(tableData, onSave);
  return (
    <div className={styles.mainPage}>
      {/* Form popup */}
      <Popover placement="auto-start">
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Button>Add User</Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                w="40vw"
                height="75vh"
                boxShadow="dark-lg"
                className="flex justify-center"
              >
                <PopoverCloseButton />
                <PopoverBody>
                  <Box>
                    <Form
                      onClose={onClose}
                      onSave={onSave}
                      setOnSave={setOnSave}
                    />
                  </Box>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </>
        )}
      </Popover>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>S.No</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Hobbies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.map((item) => (
              <tr key={item._id} onClick={() => handleRowClick(item._id)}>
                <td className="w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item._id)}
                  />
                </td>
                <td>{item.sno}</td>
                <td>{item.name}</td>
                <td>{item.phNo}</td>
                <td>{item.email}</td>
                <td>{item.hobbies}</td>
                <td>
                  <button>
                    <EditIcon />
                  </button>
                  <button onClick={()=>handleDelete(item._id)}>
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* selected rows */}
      <div>
        <p>
          {selectedRows.length} out of {tableData&&tableData.length} rows selected rows
        </p>
      </div>
    </div>
  );
};

export default MainPage;
