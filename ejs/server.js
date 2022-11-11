const express = require('express');
const ejs = require('ejs');

const { Router, text } = require('express');
const Contenedor = require("./contenedor");

const app = express();

const PORT = 8080;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"))

app.set("view engine", "ejs")
app.set("views",__dirname+"/views")

const manejador = new Contenedor("productos.txt");

const routerProductos = Router();

routerProductos.get("/",async(req,res)=>{
    try {
        const resp = await manejador.getAll();
        res.status(resp.status).send(resp.data);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

routerProductos.get("/:id",async (req,res)=>{
    try {
        const resp = await manejador.getById(req.params.id);    
        res.status(resp.status).json(resp.data)
    } catch (error) {
        res.status(error.status).send(error.message);
    }
    
});

routerProductos.post("/",async (req,res)=>{
    try {
        const resp = await manejador.save(req.body);
        res.status(resp.status).json(resp.message)
    } catch (error) {
        res.status(error.status).send(error.message);
    }
})

routerProductos.delete("/:id",async (req,res)=>{
    //console.log("deleteProducto: ",req.params.id);
    try {
        const resp = await manejador.deleteById(req.params.id);
        res.status(resp.status).send(resp.message);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

routerProductos.delete("/",async (req,res)=>{
    //console.log("deleteProducto: ",req.params.id);
    try {
        const resp = await manejador.deleteAll();
        res.status(resp.status).send(resp.message);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

app.use('/api/productos', routerProductos);

app.post("/productos", async (req, res) => {
    const resp = await manejador.save(req.body);
    res.redirect('/')
})
app.get("/productos",async (req,res)=>{

    const resp = await manejador.getAll();

    console.log("productos: ",resp.data)

    res.render("listado",{
        productos: resp.data,
        total: resp.data.length
    })
})

app.listen( PORT, ()=>{
    console.log(`Servidor escuchando el puerto: ${PORT}`);
});