"use client";

import { useEffect, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { fetchData, fetchLastPage } from "./serviceData";
import PaginationSection from "./components/pagination";
import { User } from "@/lib/types";

const AdminPage = () => {
  const [page, setPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [last, setLast] = useState(1);

  const [name, setName] = useState<string>("");
  const [fetch, setFetch] = useState<boolean>(false);

  useEffect(() => {
    setPage(1);
  }, [fetch]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data:User[] = await fetchData(page,name);
      setFilteredUsers(data);
    };
    fetchUsers();
  }, [page,fetch]);

  useEffect(() => {
    const fetchLast = async () => {
      const data = await fetchLastPage(name);
      setLast(data);
    };
    fetchLast();
  }, [fetch]);

  const handlePrev = () => {
    if (page > 1) {
      setPage((prevState) => prevState - 1);
    }
  };

  const handleNext = () => {
    if (page < last) {
      setPage((prevState) => prevState + 1);
    }
  };

  const handleSearchValueChange = (value: string) => {
    if (!value) {
      setFetch(!fetch);
    }
    setName(value);
  };

  const handleSearch = () => {
    setFetch(!fetch);

  }

  const handleClick = (currentPage: number) => {
    setPage(currentPage);
  };

  return (
    <div className="w-full">
        <DataTable 
        columns={columns} 
        onSearchClick={handleSearch}
        onSearchValueChange={handleSearchValueChange}
        data={filteredUsers} />'
        
        <PaginationSection
          lastPage={last}
          currentPage={page}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleClick={handleClick}
        />
    </div>
  );
};
export default AdminPage;
