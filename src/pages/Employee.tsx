import { Button, Container, IconButton, MenuItem, Pagination, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Delete, Edit, Save } from '@mui/icons-material'

// model
export type Employee = {
  id: string;
  fullName: string;
  dob: string;
  position: string;
  salary: number;
}

const positions = [
  "Frontend",
  "Backend",
  "Hr"
]

const firstNames = ["An", "Bình", "Cường", "Dũng", "Hải", "Hiếu", "Huy", "Khánh", "Lan", "Minh", "Nam", "Trang", "Tuấn", "Vy"];
const lastNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ"];

function randomName() {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${l} ${f}`;
}

function randomDate(startYear = 1980, endYear = 2003) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  const d = new Date(start + Math.random() * (end - start));
  return d.toISOString().slice(0, 10);
}

function randomSalary() {
  return Math.floor(800 + Math.random() * 3000);
}

function uid() {
  return Math.random().toString(36).substring(2, 9)
}

function generateEmployees(n: number): Employee[] {
  const data: Employee[] = [];
  for (let i = 0; i < n; i++) {
    data.push({
      id: uid(),
      fullName: randomName(),
      dob: randomDate(),
      position: positions[Math.floor(Math.random() * positions.length)],
      salary: randomSalary()
    })
  }

  return data;
}
// sort type
interface SortState {
  key: keyof Employee | null;
  direction: "asc" | "desc" | null;
}


const Employee = () => {
  const [employee, setEmployee] = useState<Employee[]>(() => generateEmployees(100));
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ key: null, direction: null });
  const [editing, setEditing] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10)

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    position: positions[0],
    salary: 1000
  })

  // search + sort
  const displayEmployee = useMemo(() => {
    let data = [...employee];

    // search theo tên
    if (search) {
      data = data.filter(e => e.fullName.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    }

    if (sort.key && sort.direction) {
      data.sort((a, b) => {
        const key = sort.key!;
        const valA: any = a[key];
        const valB: any = b[key];

        if (key === "salary") return sort.direction === "asc" ? valA - valB : valB - valA;
        if (key === "dob") return sort.direction == "asc"
          ? new Date(valA).getTime() - new Date(valB).getTime()
          : new Date(valB).getTime() - new Date(valA).getTime();

        return sort.direction === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA))
      });
    }
    return data;
  }, [employee, search, sort])

  const totalPages = Math.ceil(displayEmployee.length / limit);
  const pagination = useMemo(() => {
    const start = page * limit;
    const end = start + limit;
    return displayEmployee.slice(start, end);
  }, [displayEmployee, page, limit])

  useEffect(() => {
    const maxPage = Math.ceil(displayEmployee.length / limit) - 1;
    if (page > maxPage) {
      setPage(0);
    }
  }, [displayEmployee, limit, page]);

  // toggle sort
  const toggleSort = (key: keyof Employee) => {
    setPage(0); // reset về trang 0 khi sắp xếp
    setSort(prev => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction == "asc") return { key, direction: "desc" };
      return { key: null, direction: null };
    })
  }

  // handle 

  // add
  const handleAdd = () => {
    const newEmp: Employee = {
      id: uid(),
      fullName: form.fullName,
      dob: form.dob,
      position: form.position,
      salary: form.salary
    };
    setEmployee(emp => [newEmp, ...emp]);
    setForm({
      fullName: "",
      dob: "",
      position: positions[0],
      salary: 1000
    })
  }

  // remove
  const handleRemove = (id: string) => {
    setEmployee(emp => emp.filter(e => e.id !== id));
  }

  // update
  const handleUpdate = (id: string, key: keyof Employee, value: any) => {
    setEmployee(
      emp => emp.map(e => e.id === id
        ? { ...e, [key]: value }
        : e)
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Link to="/">Home</Link>

      <Typography variant='h4' gutterBottom>
        Employee Management
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant='h6' mb={2}>Thêm nhân viên</Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Họ tên"
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })} />
          <TextField
            type='date'
            label="Ngày sinh"
            InputLabelProps={{ shrink: true }}
            value={form.dob}
            onChange={e => setForm({ ...form, dob: e.target.value })} />
          <Select
            value={form.position}
            onChange={e => setForm({ ...form, position: e.target.value })}
          >
            {positions.map(p => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </Select>
          <TextField
            type='number'
            label="Lương"
            value={form.salary}
            onChange={e => setForm({ ...form, salary: Number(e.target.value) })}
          />
          <Button disabled={!form.fullName || !form.dob || !form.position || !form.salary} variant='contained' onClick={handleAdd}>
            Add
          </Button>
        </Stack>
      </Paper>

      <TextField
        fullWidth
        sx={{ mb: 2 }}
        label="Tìm kiếm nhân viên..."
        value={search}
        onChange={e => {
          setSearch(e.target.value)
          setPage(0)// reset lại trang khi tìm
        }
        } />

      <p>Bảng nhân viên</p>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell onClick={() => toggleSort("fullName")}>Họ tên</TableCell>
              <TableCell onClick={() => toggleSort("dob")}>Ngày sinh</TableCell>
              <TableCell onClick={() => toggleSort("position")}>Chức vụ</TableCell>
              <TableCell onClick={() => toggleSort("salary")}>Lương</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              pagination.map((e, i) => (
                <TableRow key={e.id}>
                  <TableCell>{page * limit + i + 1}</TableCell>

                  <TableCell>
                    {
                      editing === e.id
                        ? (
                          <TextField
                            value={e.fullName}
                            onChange={edit => handleUpdate(e.id, "fullName", edit.target.value)} />
                        )
                        : e.fullName
                    }
                  </TableCell>

                  <TableCell>
                    {
                      editing === e.id
                        ? (
                          <TextField
                            type='date'
                            value={e.dob}
                            onChange={edit => handleUpdate(e.id, "dob", edit.target.value)} />
                        )
                        : e.dob
                    }
                  </TableCell>

                  <TableCell>
                    {
                      editing === e.id
                        ? (
                          <TextField
                            value={e.position}
                            onChange={edit => handleUpdate(e.id, "position", edit.target.value)}
                          />
                        )
                        : e.position
                    }
                  </TableCell>

                  <TableCell>
                    {
                      editing === e.id
                        ? (
                          <TextField
                            type="number"
                            value={e.salary}
                            onChange={ev => handleUpdate(e.id, "salary", Number(ev.target.value))}
                          />
                        )
                        : e.salary
                    }
                  </TableCell>

                  <TableCell>
                    {
                      editing === e.id
                        ? (
                          <IconButton onClick={() => setEditing(null)}>
                            <Save />
                          </IconButton>
                        )
                        : (
                          <>
                            <IconButton onClick={() => setEditing(e.id)}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleRemove(e.id)}>
                              <Delete />
                            </IconButton>
                          </>
                        )
                    }
                  </TableCell>

                </TableRow>
              ))
            }
          </TableBody>

        </Table>
      </TableContainer>
      {/* <TablePagination
        component="div"
        count={totalPages}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={limit}
        onRowsPerPageChange={(event) => {
          setLimit(parseInt(event.target.value, 10))
          setPage(0)
        }}
        rowsPerPageOptions={[5, 10, 20]}
      /> */}
      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(_, value) => setPage(value - 1)}
        showFirstButton
        showLastButton
      />
    </Container>
  )
}

export default Employee