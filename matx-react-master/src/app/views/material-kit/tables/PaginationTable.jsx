import { useState, useEffect } from "react";
import {
  Box,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Toolbar
} from "@mui/material";
import { obtenerUsuarios, eliminarUsuario, actualizarUsuario, crearUsuario } from "services/apis";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
  }
}));

export default function PaginationTable() {
  const [usuarios, setUsuarios] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [currentUsuario, setCurrentUsuario] = useState({
    pkUsuario: null,
    nombre: "",
    userName: "",
    password: "",
    fkRol: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerUsuarios();
        setUsuarios(Array.isArray(data.result) ? data.result : []);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setUsuarios([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredUsuarios(
        usuarios.filter(
          (usuario) =>
            usuario.pkUsuario?.toString().includes(searchTerm) ||
            usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredUsuarios(usuarios);
    }
  }, [searchTerm, usuarios]);

  useEffect(() => {
    if (page > 0 && page * rowsPerPage >= filteredUsuarios.length) {
      setPage(0);
    }
  }, [filteredUsuarios, rowsPerPage, page]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      await eliminarUsuario(id);
      setUsuarios(usuarios.filter((usuario) => usuario.pkUsuario !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const handleEdit = (usuario) => {
    setCurrentUsuario({
      pkUsuario: usuario.pkUsuario,
      nombre: usuario.nombre,
      userName: usuario.userName,
      password: usuario.password,
      fkRol: usuario.fkRol
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleAdd = () => {
    setCurrentUsuario({ pkUsuario: null, nombre: "", userName: "", password: "", fkRol: null });
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUsuario({ pkUsuario: null, nombre: "", userName: "", password: "", fkRol: null });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentUsuario({ ...currentUsuario, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await actualizarUsuario(currentUsuario.pkUsuario, currentUsuario);
        setUsuarios(
          usuarios.map((usuario) =>
            usuario.pkUsuario === currentUsuario.pkUsuario ? currentUsuario : usuario
          )
        );
      } else {
        const newUsuario = await crearUsuario(currentUsuario);
        setUsuarios([...usuarios, newUsuario.result]);
      }
      handleClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  return (
    <Box width="100%" overflow="auto">
      <Toolbar>
        <TextField
          label="Buscar por Nombre o ID"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <Button startIcon={<AddIcon />} onClick={handleAdd}>
          Agregar Usuario
        </Button>
      </Toolbar>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Nombre</TableCell>
            <TableCell align="center">Usuario</TableCell>
            <TableCell align="center">Rol</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsuarios
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((usuario, index) => (
              <TableRow key={index}>
                <TableCell align="left">{usuario.pkUsuario}</TableCell>
                <TableCell align="left">{usuario.nombre}</TableCell>
                <TableCell align="center">{usuario.userName}</TableCell>
                <TableCell align="center">{usuario.fkRol ? "Activo" : "Inactivo"}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(usuario)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(usuario.pkUsuario)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>

      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={filteredUsuarios.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="nombre"
            label="Nombre"
            type="text"
            fullWidth
            value={currentUsuario.nombre ?? ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="userName"
            label="Usuario"
            type="text"
            fullWidth
            value={currentUsuario.userName ?? ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Contraseña"
            type="password"
            fullWidth
            value={currentUsuario.password ?? ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="fkRol"
            label="Rol"
            type="text"
            fullWidth
            value={currentUsuario.fkRol ?? ""}
            onChange={(e) => setCurrentUsuario({ ...currentUsuario, fkRol: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            {isEditing ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
